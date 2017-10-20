// @flow

import DataLoader from 'dataloader';

import Loaders from './loaders';

import invariant from 'invariant';

import uuid from 'uuid';

import { Event } from 'data/types';

type EventMeta = {
  ns: string,
  type: string,
  timestamp: number,
  metadata: string,
} & (
  | { clientId: string }
  | { supplierId: string }
  | { productId: string }
  | { saleId: string }
  | { quotationId: string }
  | { expenseId: string }
  | { paymentId: string, saleId: string });

const LIMIT_PER_PAGE = 15;

export class EventConnector {
  db: any;
  loaders: any;

  constructor({ db }) {
    this.db = db;
    this.loaders = Loaders({ db });
  }

  get(idOrIds: string | Array<string>) {
    return Array.isArray(idOrIds)
      ? this.loaders.ids.loadMany(idOrIds)
      : this.loaders.ids.load(idOrIds);
  }

  getTimeline({ cursor = null, query }, { user }) {
    if (!user) {
      return { cursor, prevCursor: cursor, events: [] };
    }

    const { ns, types, id } = query;

    const args = [];

    let QUERY = 'SELECT * FROM events';

    const conditions = [];

    if (cursor) {
      conditions.push('timestamp < ?');
      args.push(+cursor);
    }

    if (ns) {
      conditions.push(`ns = ?`);
      args.push(ns);
    }

    if (types) {
      if (types.length === 1) {
        conditions.push(`type = ?`);
      } else {
        conditions.push(`type IN (${types.map(() => '?').join(', ')})`);
      }
      args.push(...types);
    }

    if (id) {
      invariant(ns, 'You must provide `ns` if you provide `id`');
      switch (ns) {
        case Event.NS_PRODUCTS: {
          conditions.push(`productId = ?`);
          args.push(id);
          break;
        }
        case Event.NS_CLIENTS: {
          conditions.push(`clientId = ?`);
          args.push(id);
          break;
        }
        case Event.NS_SUPPLIERS: {
          conditions.push(`supplierId = ?`);
          args.push(id);
          break;
        }
        case Event.NS_SALES: {
          conditions.push(`saleId = ?`);
          args.push(id);
          break;
        }
        case Event.NS_EXPENSES: {
          conditions.push(`expenseId = ?`);
          args.push(id);
          break;
        }
        default:
      }
    }

    if (conditions.length) {
      QUERY += ' WHERE ';
      QUERY += conditions.join(' AND ');
    }

    QUERY += ' ORDER BY timestamp DESC';

    QUERY += ' LIMIT ?';
    args.push(LIMIT_PER_PAGE);

    const events = this.db
      .prepare(QUERY + ';')
      .all(...args)
      .map(Event.fromDatabase);

    return {
      cursor: events.length
        ? new Date(events[events.length - 1].timestamp)
        : cursor,
      prevCursor: cursor,
      events,
    };
  }

  create(meta: EventMeta) {
    invariant(
      this.db.inTransaction,
      'Event.create must be executed in a transaction',
    );

    const id = uuid();

    const { ns, type, timestamp, metadata, ...foreignKeys } = meta;

    this.db
      .prepare(
        `INSERT INTO events (id, ns, type, timestamp, metadata, ${Object.keys(
          foreignKeys,
        ).join(
          ', ',
        )}) VALUES (@id, @ns, @type, @timestamp, @metadata, ${Object.keys(
          foreignKeys,
        )
          .map(key => '@' + key)
          .join(', ')});`,
      )
      .run({
        id,
        ns,
        type,
        timestamp,
        metadata,
        ...foreignKeys,
      });

    return id;
  }
}
