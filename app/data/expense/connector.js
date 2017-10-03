import Loaders from './loaders';

import asTransaction from 'data/asTransaction';

import { Expense, Event, TransactionStatus } from 'data/types';

import sort from 'lodash.orderby';

import uuid from 'uuid';

const LIMIT = 15;

export class ExpenseConnector {
  constructor({ db }) {
    this.db = db;
    this.loaders = Loaders({ db });

    this.addExpense = asTransaction(this.addExpense.bind(this));
    this.void = asTransaction(this.void.bind(this));
    this.pay = asTransaction(this.pay.bind(this));
    this.delPay = asTransaction(this.delPay.bind(this));
  }

  get(id) {
    return this.loaders.ids.load(id);
  }

  getPayment(id) {
    return this.loaders.payment.load(id);
  }

  getPayments(id) {
    return this.loaders.payments.load(id);
  }

  getItems(id) {
    return this.loaders.items.load(id);
  }

  async getExpense(id: string) {
    const expense = await this.loaders.ids.load(id);
    return {
      expense,
      ...(await this.loaders.info.load(expense.id)),
    };
  }

  async getExpenses({ cursor = 0, query }) {
    const objects = this.db
      .prepare(`SELECT * FROM expenses WHERE state <> @state;`)
      .all({
        // offset: cursor,
        // limit: LIMIT,
        state: TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
      })
      .map(Expense.fromDatabase);

    const length = await this.loaders.length.load('expenses');

    const expenses = await Promise.all(
      objects.map(async expense => ({
        expense,
        ...(await this.loaders.info.load(expense.id)),
      })),
    );

    return {
      expenses: sort(expenses, [query.orderBy], [query.order]),
      cursor: cursor + expenses.length,
      prevCursor: cursor,
      length,
    };
  }

  async addExpense(
    { refNo, beneficiary, dateCreated, items, isFullyPaid },
    { Now, Events, Products, Suppliers, Clients },
  ) {
    this.loaders.length.clear('expenses');

    const now = Now();

    const id = uuid();

    this.db
      .prepare(
        `INSERT INTO expenses (id, refNo, beneficiaryId, dateCreated, date, lastModified) VALUES (@id, @refNo, @beneficiary, @dateCreated, @date, @lastModified);`,
      )
      .run({
        id,
        refNo,
        beneficiary,
        dateCreated: +dateCreated,
        date: now,
        lastModified: now,
      });

    Suppliers.connector.loaders.balance.clear(beneficiary);
    Clients.connector.loaders.balance.clear(beneficiary);

    // Add items in series
    await items.reduce((_promise, { productId, qty, unitPrice }) => {
      return _promise.then(() => {
        return Products.newItem({
          type: Expense.TYPE,
          foreignId: id,
          productId,
          qty,
          unitPrice,
          dateCreated: +dateCreated,
          dateNow: now,
        });
      });

      // return _promise.then(async () => {
      //   this.db
      //     .prepare(
      //       `INSERT INTO items (id, type, foreignId, productId, qty, unitPrice, dateCreated, date) VALUES (@id, @type, @foreignId, @productId, @qty, @unitPrice, @dateCreated, @date);`,
      //     )
      //     .run({
      //       id: uuid(),
      //       type: Expense.TYPE,
      //       foreignId: id,
      //       productId,
      //       qty,
      //       unitPrice,
      //       dateCreated: +dateCreated,
      //       date: now,
      //     });
      // });
    }, Promise.resolve());

    if (isFullyPaid) {
      this.db
        .prepare(
          `INSERT INTO payments (id, type, foreignId, amount, dateCreated, date) VALUES (@id, @type, @foreignId, @amount, @dateCreated, @date);`,
        )
        .run({
          id: uuid(),
          type: Expense.TYPE,
          foreignId: id,
          amount: items.reduce(
            (sum, { qty, unitPrice }) => sum + qty * unitPrice,
            0,
          ),
          dateCreated: +dateCreated,
          date: now,
        });
    }

    const newExpense = await Events.create({
      ns: Event.NS_EXPENSES,
      type: Event.TYPE_NEW_EXPENSE,
      expenseId: id,
      metadata: JSON.stringify({}),
      timestamp: now,
    });

    return { id, events: [newExpense] };
  }

  async void(id, { Now, Events, Suppliers, Clients }) {
    Suppliers.connector.loaders.balance.clearAll();
    Clients.connector.loaders.balance.clearAll();

    this.loaders.ids.clear(id);
    this.loaders.info.clear(id);

    this.db
      .prepare(
        `UPDATE expenses SET state = @state, lastModified = @lastModified WHERE id = @id;`,
      )
      .run({
        state: TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
        lastModified: Now(),
        id,
      });

    const event = await Events.create({
      ns: Event.NS_EXPENSES,
      type: Event.TYPE_VOID_EXPENSE,
      expenseId: id,
      metadata: JSON.stringify({}),
      timestamp: Now(),
    });

    return { id, events: [event] };
  }

  async pay(id, { amount, dateCreated }, { Now, Events, Suppliers, Clients }) {
    this.loaders.ids.clear(id);
    this.loaders.info.clear(id);
    this.loaders.payments.clear(id);

    Suppliers.connector.loaders.balance.clearAll();
    Clients.connector.loaders.balance.clearAll();

    const paymentId = uuid();

    this.db
      .prepare(
        `INSERT INTO payments (id, type, foreignId, amount, dateCreated, date) VALUES (@id, @type, @foreignId, @amount, @dateCreated, @date);`,
      )
      .run({
        id: paymentId,
        type: Expense.TYPE,
        foreignId: id,
        amount,
        dateCreated: +dateCreated,
        date: Now(),
      });

    this.db
      .prepare(
        `UPDATE expenses SET lastModified = @lastModified WHERE id = @id;`,
      )
      .run({
        id,
        lastModified: Now(),
      });

    const event = await Events.create({
      ns: Event.NS_EXPENSES,
      type: Event.TYPE_EXPENSE_PAYMENT,
      expenseId: id,
      paymentId,
      metadata: JSON.stringify({}),
      timestamp: Now(),
    });

    return { id, paymentId, events: [event] };
  }

  async delPay(id, { Now, Events, Suppliers, Clients }) {
    const { foreignId } = this.db
      .prepare(`SELECT * from payments WHERE id = @id;`)
      .get({ id });

    this.loaders.ids.clear(foreignId);
    this.loaders.info.clear(foreignId);
    this.loaders.payments.clear(foreignId);
    this.loaders.payment.clear(id);

    Suppliers.connector.loaders.balance.clearAll();
    Clients.connector.loaders.balance.clearAll();

    // Cancel payment
    this.db.prepare(`UPDATE payments SET state = @state WHERE id = @id;`).run({
      id,
      state: TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
    });

    // touch expense
    this.db
      .prepare(
        `UPDATE expenses SET lastModified = @lastModified WHERE id = @id;`,
      )
      .run({ id: foreignId, lastModified: Now() });

    const event = await Events.create({
      ns: Event.NS_EXPENSES,
      type: Event.TYPE_VOID_EXPENSE_PAYMENT,
      expenseId: foreignId,
      paymentId: id,
      metadata: JSON.stringify({}),
      timestamp: Now(),
    });

    return { id: foreignId, paymentId: id, events: [event] };
  }
}
