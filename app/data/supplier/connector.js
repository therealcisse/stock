import Loader from './loaders';

import { Supplier, Event, TransactionStatus, Expense } from 'data/types';

import asTransaction from 'data/asTransaction';

import uuid from 'uuid';

import sort from 'lodash.orderby';

export class SupplierConnector {
  constructor({ db }) {
    this.db = db;
    this.loaders = Loader({ db });

    this.addSupplier = asTransaction(this.addSupplier.bind(this));
  }
  get(id) {
    return this.loaders.ids.load(id);
  }

  async getSupplierExpenses(id, query, { Expenses }) {
   const objects = this.db
      .prepare(`SELECT * FROM expenses WHERE state <> @state AND beneficiaryId = @beneficiaryId;`)
      .all({
        state: TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
        beneficiaryId: id,
      })
      .map(Expense.fromDatabase);

    const length = 0; // await this.loaders.length.load('expenses');

    const expenses = await Promise.all(
      objects.map(async expense => ({
        expense,
        ...(await Expenses.connector.loaders.info.load(expense.id)),
      })),
    );

    return {
      expenses: sort(expenses, [query.orderBy], [query.order]),
      cursor: 0,
      prevCursor: 0,
      length,
    };
  }

  async getSupplier(id) {
    const supplier = await this.loaders.ids.load(id);

    return {
      supplier,
      ...(await this.loaders.balance.load(supplier.id)),
    };
  }

  async getAllSuppliers({ order, orderBy }) {
    const objects = this.db
      .prepare(`SELECT * FROM people WHERE type = @type;`)
      .all({
        type: Supplier.TYPE,
      })
      .map(Supplier.fromDatabase);

    const suppliers = await Promise.all(
      objects.map(async supplier => ({
        supplier,
        ...(await this.loaders.balance.load(supplier.id)),
      })),
    );

    return sort(suppliers, [orderBy], [order]);
  }

  async addSupplier(
    id,
    { displayName, tel, email, address, taxId },
    { Events, Now },
  ) {
    if (id) {
      this.loaders.ids.clear(id);

      this.db
        .prepare(
          `UPDATE people set displayName = @displayName, tel = @tel, email = @email, address = @address, taxId = @taxId, lastModified = @lastModified WHERE id = @id;`,
        )
        .run({
          displayName,
          tel,
          email,
          address,
          taxId,
          lastModified: Now(),
          id,
        });

      const event = await Events.create({
        ns: Event.NS_SUPPLIERS,
        type: Event.TYPE_SUPPLIER_UPDATED,
        clientId: id,
        metadata: JSON.stringify({}),
        timestamp: Now(),
      });

      return { id, events: [event] };
    } else {
      const newId = uuid();

      this.db
        .prepare(
          `INSERT INTO people (id, type, displayName, tel, email, address, taxId, date, lastModified) VALUES (@id, @type, @displayName, @tel, @email, @address, @taxId, @date, @lastModified);`,
        )
        .run({
          id: newId,
          type: Supplier.TYPE,
          displayName,
          tel,
          email,
          address,
          taxId,
          date: Now(),
          lastModified: Now(),
        });

      const newSupplier = await Events.create({
        ns: Event.NS_SUPPLIERS,
        type: Event.TYPE_NEW_SUPPLIER,
        supplierId: newId,
        metadata: JSON.stringify({}),
        timestamp: Now(),
      });

      return { id: newId, events: [newSupplier] };
    }
  }
}
