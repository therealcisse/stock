import DataLoader from 'dataloader';

import { Product, Sale, Expense } from 'data/types';

export default function({ db }) {
  return {
    ids: new DataLoader(async function(ids) {
      const objects = db
        .prepare(
          `SELECT * FROM products WHERE id IN (${ids
            .map(() => '?')
            .join(', ')});`,
        )
        .all(ids)
        .map(Product.fromDatabase);

      return ids.map(id => {
        const index = objects.findIndex(object => object.id === id);
        return index !== -1
          ? objects[index]
          : new Error(`Product ${id} not found`);
      });
    }, {}),

    q: new DataLoader(
      async function(qs) {
        return qs.map((q, index) => {
          return db
            .prepare(
              `SELECT *
                 FROM products
                 WHERE id IN (
                   SELECT id FROM products_index WHERE products_index MATCH @match LIMIT 5
                 );`,
            )
            .all({
              match: q
                .trim()
                .split(/\s+/g)
                .map(s => s + '*')
                .join(' OR '),
            })
            .map(Product.fromDatabase);
        });
      },
      { cache: false },
    ),

    stock: new DataLoader(async function(ids) {
      // Get all qty of sale items
      const sales = db
        .prepare(
          `SELECT productId, SUM(qty) AS qty FROM items WHERE type = ? AND productId IN (${ids
            .map(() => '?')
            .join(', ')})
          GROUP BY productId;`,
        )
        .all([Sale.TYPE, ...ids]);

      // Get all qty of expense items
      const expenses = db
        .prepare(
          `SELECT productId, SUM(qty) AS qty FROM items WHERE type = ? AND productId IN (${ids
            .map(() => '?')
            .join(', ')})
          GROUP BY productId;`,
        )
        .all([Expense.TYPE, ...ids]);

      return ids.map(id => {
        const saleQty = sales.reduce(
          (sum, { productId, qty }) => (id === productId ? sum + qty : sum),
          0,
        );

        const expenseQty = expenses.reduce(
          (sum, { productId, qty }) => (id === productId ? sum + qty : sum),
          0,
        );

        return expenseQty - saleQty;
      });
    }, {}),
  };
}
