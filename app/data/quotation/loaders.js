import DataLoader from 'dataloader';

import { Quotation, Item, Client, TransactionStatus } from 'data/types';

import { Money } from 'data/utils';

import moment from 'moment';

export default function({ db }) {
  return {
    ids: new DataLoader(async function(ids) {
      const objects = db
        .prepare(
          `SELECT * FROM quotations WHERE id IN (${ids
            .map(() => '?')
            .join(', ')});`,
        )
        .all(ids)
        .map(Quotation.fromDatabase);

      return ids.map(id => {
        const index = objects.findIndex(object => object.id === id);
        return index !== -1
          ? objects[index]
          : new Error(`Quotation ${id} not found`);
      });
    }, {}),

    q: new DataLoader(
      async function(qs) {
        return qs.map((q, index) => {
          return db
            .prepare(
              `SELECT *
               FROM quotations
               WHERE clientId IN (
                 SELECT id FROM people_index WHERE type = @personType AND people_index MATCH @match
                 ) OR id IN (
                 SELECT foreignId FROM items WHERE type = @type AND productId IN (
                   SELECT id FROM products_index WHERE products_index MATCH @match
                 )
               ) OR id IN (SELECT id FROM quotations_index WHERE quotations_index MATCH @match) ORDER BY lastModified LIMIT 5;`,
            )
            .all({
              personType: Client.TYPE,
              type: Quotation.TYPE,
              match: q
                .trim()
                .split(/\s+/g)
                .map(s => s + '*')
                .join(' OR '),
            })
            .map(Quotation.fromDatabase);
        });
      },
      { cache: false },
    ),

    items: new DataLoader(async function(ids) {
      const objects = db
        .prepare(
          `SELECT * FROM items WHERE type = ? AND foreignId IN (${ids
            .map(() => '?')
            .join(', ')});`,
        )
        .all([Quotation.TYPE, ...ids])
        .map(Item.fromDatabase);

      return ids.map(id => objects.filter(object => object.foreignId === id));
    }, {}),

    length: new DataLoader(async function(ids) {
      const { length } = db
        .prepare(
          `SELECT COUNT(*) AS length FROM quotations WHERE state <> @state;`,
        )
        .get({
          state: TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
        });

      return ids.map(() => length);
    }, {}),
  };
}
