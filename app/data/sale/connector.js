// @flow

import Loaders from './loaders';

import asTransaction from 'data/asTransaction';

import { Sale, Event, TransactionStatus } from 'data/types';

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

    this.db
      .prepare(
        `INSERT INTO sales (id, clientId, dateCreated, date, lastModified) VALUES (@id, @client, @dateCreated, @date, @lastModified);`,
      )
      .run({
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

  async pay({ id, amount, dateCreated }, { Now, Events, Clients }) {
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
      ns: Event.NS_PAYMENTS,
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

    const { foreignId } = db
      .prepare(`SELECT * from payments WHERE id = @id;`)
      .get({ id });

    this.loaders.ids.clear(foreignId);
    this.loaders.info.clear(id);
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
      ns: Event.NS_PAYMENTS,
      type: Event.TYPE_VOID_SALE_PAYMENT,
      expenseId: foreignId,
      paymentId: id,
      metadata: JSON.stringify({}),
      timestamp: Now(),
    });

    return { id: foreignId, paymentId: id, events: [event] };
  }
}
