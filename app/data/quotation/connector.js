// @flow

import Loaders from './loaders';

import asTransaction from 'data/asTransaction';

import { Quotation, Event, TransactionStatus } from 'data/types';

import uuid from 'uuid';

import sort from 'lodash.orderby';

const LIMIT = 15;

export class QuotationConnector {
  db: any;
  loaders: any;

  constructor({ db }) {
    this.db = db;
    this.loaders = Loaders({ db });

    this.addQuotation = asTransaction(this.addQuotation.bind(this));
    this.void = asTransaction(this.void.bind(this));
    this.approve = asTransaction(this.approve.bind(this));
  }

  getNextRefNo() {
    const { maxRefNo } = this.db
      .prepare(`SELECT MAX(refNo) AS maxRefNo FROM quotations;`)
      .get();

    return maxRefNo ? maxRefNo + 1 : 1;
  }

  get(id: string) {
    return this.loaders.ids.load(id);
  }

  getItems(id: string) {
    return this.loaders.items.load(id);
  }

  async getQuotation(id: string) {
    const quotation = await this.loaders.ids.load(id);
    return {
      quotation,
      total: quotation.items.reduce(
        (sum, { qty, unitPrice }) => sum + qty * unitPrice,
        0,
      ),
    };
  }

  async getQuotations({ cursor = 0, query }) {
    const objects = this.db
      .prepare(
        `SELECT * FROM quotations WHERE state <> @cancelled AND state <> @approved;`,
      )
      .all({
        // offset: cursor,
        // limit: LIMIT,
        cancelled: TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
        approved: TransactionStatus.toDatabase(TransactionStatus.APPROVED),
      })
      .map(Quotation.fromDatabase);

    const length = await this.loaders.length.load('quotations');

    const quotations = await Promise.all(
      objects.map(quotation => ({
        quotation,
        total: quotation.items.reduce(
          (sum, { qty, unitPrice }) => sum + qty * unitPrice,
          0,
        ),
      })),
    );

    return {
      quotations: sort(quotations, [query.orderBy], [query.order]),
      cursor: cursor + quotations.length,
      prevCursor: cursor,
      length,
    };
  }

  async addQuotation({ client, dateCreated, items }, { Now, Events, Products }) {
    this.loaders.length.clear('quotations');

    const now = Now();

    const id = uuid();

    const refNo = this.getNextRefNo();

    this.db
      .prepare(
        `INSERT INTO quotations (id, refNo, clientId, dateCreated, date, lastModified) VALUES (@id, @refNo, @client, @dateCreated, @date, @lastModified);`,
      )
      .run({
        refNo,
        id,
        client,
        dateCreated: +dateCreated,
        date: now,
        lastModified: now,
      });

    // Add items in series
    await items.reduce((_promise, { productId, qty, unitPrice }) => {
      return _promise.then(() => {
        return Products.newItem({
          type: Quotation.TYPE,
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
      //       type: Quotation.TYPE,
      //       foreignId: id,
      //       productId,
      //       qty,
      //       unitPrice,
      //       dateCreated: +dateCreated,
      //       date: now,
      //     });
      // });
    }, Promise.resolve());

    const newQuotation = await Events.create({
      ns: Event.NS_QUOTATIONS,
      type: Event.TYPE_NEW_QUOTATION,
      quotationId: id,
      metadata: JSON.stringify({}),
      timestamp: now,
    });

    return { id, events: [newQuotation] };
  }

  async void(id, { Now, Events }) {
    this.loaders.ids.clear(id);

    this.db
      .prepare(
        `UPDATE quotations SET state = @state, lastModified = @lastModified WHERE id = @id;`,
      )
      .run({
        state: TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
        lastModified: Now(),
        id,
      });

    const event = await Events.create({
      ns: Event.NS_QUOTATIONS,
      type: Event.TYPE_VOID_QUOTATION,
      quotationId: id,
      metadata: JSON.stringify({}),
      timestamp: Now(),
    });

    return { id, events: [event] };
  }

  async approve(id, { amount, dateCreated }, { Now, Events }) {
    this.loaders.ids.clear(id);

    this.db
      .prepare(
        `UPDATE quotations SET state = @state, lastModified = @lastModified WHERE id = @id;`,
      )
      .run({
        state: TransactionStatus.toDatabase(TransactionStatus.APPROVED),
        lastModified: Now(),
        id,
      });

    const event = await Events.create({
      ns: Event.NS_QUOTATIONS,
      type: Event.TYPE_APPROVE_QUOTATION,
      quotationId: id,
      metadata: JSON.stringify({}),
      timestamp: Now(),
    });

    return { id, events: [event] };
  }

  query(q: ?string) {
    return this.loaders.q.load(q);
  }
}
