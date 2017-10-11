import Loader from './loaders';

import { Client, Event, TransactionStatus, Sale, Expense } from 'data/types';

import asTransaction from 'data/asTransaction';

import uuid from 'uuid';

import sort from 'lodash.orderby';

export class ClientConnector {
  constructor({ db }) {
    this.db = db;
    this.loaders = Loader({ db });

    this.addClient = asTransaction(this.addClient.bind(this));
  }
  get(id) {
    return this.loaders.ids.load(id);
  }
  async getAllClients({ order, orderBy }) {
    const objects = this.db
      .prepare(`SELECT * FROM people WHERE type = @type;`)
      .all({
        type: Client.TYPE,
      })
      .map(Client.fromDatabase);

    const clients = await Promise.all(
      objects.map(async client => ({
        client,
        ...(await this.loaders.balance.load(client.id)),
      })),
    );

    return sort(clients, [orderBy], [order]);
  }
  async getClient(id) {
    const client = await this.loaders.ids.load(id);

    return {
      client,
      ...(await this.loaders.balance.load(id)),
    };
  }

  async getClientExpense(id, query, { Sales }) {
    const objects = this.db
      .prepare(
        `SELECT * FROM expenses WHERE state <> @state AND beneficiaryId = @beneficiaryId;`,
      )
      .all({
        state: TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
        beneficiaryId: id,
      })
      .map(Expense.fromDatabase);

    const length = 0; // await this.loaders.length.load('sales');

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

  async getClientSales(id, query, { Sales }) {
    const objects = this.db
      .prepare(
        `SELECT * FROM sales WHERE state <> @state AND clientId = @clientId;`,
      )
      .all({
        state: TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
        clientId: id,
      })
      .map(Sale.fromDatabase);

    const length = 0; // await this.loaders.length.load('sales');

    const sales = await Promise.all(
      objects.map(async sale => ({
        sale,
        ...(await Sales.connector.loaders.info.load(sale.id)),
      })),
    );

    return {
      sales: sort(sales, [query.orderBy], [query.order]),
      cursor: 0,
      prevCursor: 0,
      length,
    };
  }

  async addClient(
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
        ns: Event.NS_CLIENTS,
        type: Event.TYPE_CLIENT_UPDATED,
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
          type: Client.TYPE,
          displayName,
          tel,
          email,
          address,
          taxId,
          date: Now(),
          lastModified: Now(),
        });

      const newClient = await Events.create({
        ns: Event.NS_CLIENTS,
        type: Event.TYPE_NEW_CLIENT,
        clientId: newId,
        metadata: JSON.stringify({}),
        timestamp: Now(),
      });

      return { id: newId, events: [newClient] };
    }
  }

  query(q: ?string) {
    return this.loaders.q.load(q);
  }
}
