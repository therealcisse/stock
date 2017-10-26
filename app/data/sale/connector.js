// @flow

import moment from 'moment';

import Loaders from './loaders';

import uniq from 'lodash.uniq';

import asTransaction from 'data/asTransaction';

import { Sale, Expense, Event, TransactionStatus } from 'data/types';

import { Money } from 'data/utils';

import uuid from 'uuid';

import sort from 'lodash.orderby';

const LIMIT = 15;

export class SaleConnector {
  db: any;
  loaders: any;

  constructor({ db }) {
    this.db = db;
    this.loaders = Loaders({ db });

    this.addSale = asTransaction(this.addSale.bind(this));
    this.void = asTransaction(this.void.bind(this));
    this.pay = asTransaction(this.pay.bind(this));
    this.delPay = asTransaction(this.delPay.bind(this));
  }

  async getResult({ from, to }: { from: Date, to: ?Date }, { Now }) {
    const now = moment().year();

    const expenses = this.db
      .prepare(
        `
        SELECT
          item.type AS type,
          expense.dateCreated AS dateCreated,
          item.qty AS qty,
          item.unitPrice AS unitPrice
        FROM items item
        LEFT JOIN expenses expense
        ON (item.foreignId = expense.id)
        WHERE item.type = @type AND expense.state <> @state
          AND expense.dateCreated BETWEEN @from AND @to;`,
      )
      .all({
        from: +from,
        to: to ? +to : Now(),
        type: Expense.TYPE,
        state: TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
      });

    const categories = [];
    const result = {};

    const expensesData = {};
    let expensesTotal = 0.0;

    const sales = this.db
      .prepare(
        `
        SELECT
          item.type AS type,
          sale.dateCreated AS dateCreated,
          item.qty AS qty,
          item.unitPrice AS unitPrice
        FROM items item
        LEFT JOIN sales sale
        ON (item.foreignId = sale.id)
        WHERE item.type = @type AND sale.state <> @state
          AND sale.dateCreated BETWEEN @from AND @to;`,
      )
      .all({
        from: +from,
        to: to ? +to : Now(),
        type: Sale.TYPE,
        state: TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
      });

    const salesData = {};
    let salesTotal = 0.0;

    sort(
      sales.concat(expenses),
      ['dateCreated'],
      ['asc'],
    ).forEach(({ type, dateCreated, qty, unitPrice }) => {
      const key = (function() {
        const mDate = moment(dateCreated);
        return mDate.year() === now
          ? mDate.format('ll').replace(` ${mDate.year()}`, '')
          : mDate.format('ll');
      })();

      categories.push(key);

      if (!result[key]) {
        result[key] = {
          name: key,
          y: 0.0,
        };
      }

      const amount = qty * Money.fromDatabase(unitPrice);

      if (type === Sale.TYPE) {
        if (!salesData[key]) {
          salesData[key] = {
            name: key,
            y: 0.0,
          };
        }

        salesTotal += amount;
        salesData[key].y += amount;
        result[key].y += amount;
      } else {
        if (!expensesData[key]) {
          expensesData[key] = {
            name: key,
            y: 0.0,
          };
        }

        expensesTotal += amount;
        expensesData[key].y += amount;
        result[key].y -= amount;
      }
    });

    return {
      categories: uniq(categories),
      totalExpenses: expensesTotal,
      totalSales: salesTotal,
      expenses: Object.keys(expensesData).map(key => ({
        ...expensesData[key],
        y: -1 * expensesData[key].y,
      })),
      sales: Object.keys(salesData).map(key => ({
        ...salesData[key],
        y: +1 * salesData[key].y,
      })),
      result: Object.keys(result).map(key => result[key]),
    };
  }

  getNextRefNo() {
    const { maxRefNo } = this.db
      .prepare(`SELECT MAX(refNo) AS maxRefNo FROM sales;`)
      .get();

    return maxRefNo ? maxRefNo + 1 : 1;
  }

  getSalesReport() {
    return this.loaders.salesReport.load('sales');
  }

  get(id: string) {
    return this.loaders.ids.load(id);
  }

  getPayment(id: string) {
    return this.loaders.payment.load(id);
  }

  getItems(id: string) {
    return this.loaders.items.load(id);
  }

  getPayments(id: string) {
    return this.loaders.payments.load(id);
  }

  async getSale(id: string) {
    const sale = await this.loaders.ids.load(id);
    return {
      sale,
      ...(await this.loaders.info.load(sale.id)),
    };
  }

  async getSales({ cursor = 0, query }) {
    const objects = this.db
      .prepare(`SELECT * FROM sales WHERE state <> @state;`)
      .all({
        // offset: cursor,
        // limit: LIMIT,
        state: TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
      })
      .map(Sale.fromDatabase);

    const length = await this.loaders.length.load('sales');

    const sales = await Promise.all(
      objects.map(async sale => ({
        sale,
        ...(await this.loaders.info.load(sale.id)),
      })),
    );

    return {
      sales: sort(sales, [query.orderBy], [query.order]),
      cursor: cursor + sales.length,
      prevCursor: cursor,
      length,
    };
  }

  async addSale(
    { client, dateCreated, items, isFullyPaid },
    { Now, Events, Products, Clients },
  ) {
    this.loaders.length.clear('sales');
    this.loaders.salesReport.clear('sales');

    const now = Now();

    const id = uuid();

    const refNo = this.getNextRefNo();

    this.db
      .prepare(
        `INSERT INTO sales (id, refNo, clientId, dateCreated, date, lastModified) VALUES (@id, @refNo, @client, @dateCreated, @date, @lastModified);`,
      )
      .run({
        refNo,
        id,
        client,
        dateCreated: +dateCreated,
        date: now,
        lastModified: now,
      });

    Clients.connector.loaders.balance.clear(client);

    // Add items in series
    await items.reduce((_promise, { productId, qty, unitPrice }) => {
      return _promise.then(() => {
        return Products.newItem({
          type: Sale.TYPE,
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
      //       type: Sale.TYPE,
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
          type: Sale.TYPE,
          foreignId: id,
          amount: items.reduce(
            (sum, { qty, unitPrice }) => sum + qty * unitPrice,
            0,
          ),
          dateCreated: +dateCreated,
          date: now,
        });
    }

    const newSale = await Events.create({
      ns: Event.NS_SALES,
      type: Event.TYPE_NEW_SALE,
      saleId: id,
      metadata: JSON.stringify({}),
      timestamp: now,
    });

    return { id, events: [newSale] };
  }

  async void(id, { Now, Events, Clients }) {
    this.loaders.salesReport.clear('sales');

    Clients.connector.loaders.balance.clearAll();

    this.loaders.ids.clear(id);
    this.loaders.info.clear(id);

    this.db
      .prepare(
        `UPDATE sales SET state = @state, lastModified = @lastModified WHERE id = @id;`,
      )
      .run({
        state: TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
        lastModified: Now(),
        id,
      });

    const event = await Events.create({
      ns: Event.NS_SALES,
      type: Event.TYPE_VOID_SALE,
      saleId: id,
      metadata: JSON.stringify({}),
      timestamp: Now(),
    });

    return { id, events: [event] };
  }

  async pay(id, { amount, dateCreated }, { Now, Events, Clients }) {
    this.loaders.salesReport.clear('sales');

    this.loaders.ids.clear(id);
    this.loaders.info.clear(id);
    this.loaders.payments.clear(id);

    Clients.connector.loaders.balance.clearAll();

    const paymentId = uuid();

    this.db
      .prepare(
        `INSERT INTO payments (id, type, foreignId, amount, dateCreated, date) VALUES (@id, @type, @foreignId, @amount, @dateCreated, @date);`,
      )
      .run({
        id: paymentId,
        type: Sale.TYPE,
        foreignId: id,
        amount,
        dateCreated: +dateCreated,
        date: Now(),
      });

    this.db
      .prepare(`UPDATE sales SET lastModified = @lastModified WHERE id = @id;`)
      .run({
        id,
        lastModified: Now(),
      });

    const event = await Events.create({
      ns: Event.NS_SALES,
      type: Event.TYPE_SALE_PAYMENT,
      saleId: id,
      paymentId,
      metadata: JSON.stringify({}),
      timestamp: Now(),
    });

    return { id, paymentId, events: [event] };
  }

  async delPay(id, { Now, Events, Clients }) {
    this.loaders.salesReport.clear('sales');

    const { foreignId } = this.db
      .prepare(`SELECT * from payments WHERE id = @id;`)
      .get({ id });

    this.loaders.ids.clear(foreignId);
    this.loaders.info.clear(foreignId);
    this.loaders.payments.clear(foreignId);
    this.loaders.payment.clear(id);

    Clients.connector.loaders.balance.clearAll();

    // Cancel payment
    this.db.prepare(`UPDATE payments SET state = @state WHERE id = @id;`).run({
      id,
      state: TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
    });

    // touch sale
    this.db
      .prepare(`UPDATE sales SET lastModified = @lastModified WHERE id = @id;`)
      .run({ id: foreignId, lastModified: Now() });

    const event = await Events.create({
      ns: Event.NS_SALES,
      type: Event.TYPE_VOID_SALE_PAYMENT,
      expenseId: foreignId,
      paymentId: id,
      metadata: JSON.stringify({}),
      timestamp: Now(),
    });

    return { id: foreignId, paymentId: id, events: [event] };
  }

  query(q: ?string) {
    return this.loaders.q.load(q);
  }
}
