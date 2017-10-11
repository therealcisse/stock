import DataLoader from 'dataloader';

import { Expense, Item, Payment, Supplier, TransactionStatus } from 'data/types';

import { Money } from 'data/utils';

export default function({ db }) {
  return {
    ids: new DataLoader(async function(ids) {
      const objects = db
        .prepare(
          `SELECT * FROM expenses WHERE id IN (${ids
            .map(() => '?')
            .join(', ')});`,
        )
        .all(ids)
        .map(Expense.fromDatabase);

      return ids.map(id => {
        const index = objects.findIndex(object => object.id === id);
        return index !== -1
          ? objects[index]
          : new Error(`Expense ${id} not found`);
      });
    }, {}),

    q: new DataLoader(
      async function(qs) {
        return qs.map((q, index) => {
          return db
            .prepare(
              `SELECT *
               FROM expenses
               WHERE beneficiaryId IN (
                 SELECT id FROM people_index WHERE type = @personType AND people_index MATCH @match
                 ) OR id IN (
                 SELECT foreignId FROM items WHERE type = @type AND productId IN (
                   SELECT id FROM products_index WHERE products_index MATCH @match
                 )
               ) OR id IN (SELECT id FROM expenses_index WHERE expenses_index MATCH @match) ORDER BY lastModified LIMIT 5;`,
            )
            .all({
              personType: Supplier.TYPE,
              type: Expense.TYPE,
              match: q
                .trim()
                .split(/\s+/g)
                .map(s => s + '*')
                .join(' OR '),
            })
            .map(Expense.fromDatabase);
        });
      },
      { cache: false },
    ),

    payment: new DataLoader(async function(ids) {
      const objects = db
        .prepare(
          `SELECT * FROM payments WHERE id IN (${ids
            .map(() => '?')
            .join(', ')});`,
        )
        .all(ids)
        .map(Payment.fromDatabase);

      return ids.map(id => {
        const index = objects.findIndex(object => object.id === id);
        return index !== -1
          ? objects[index]
          : new Error(`Payment ${id} not found`);
      });
    }, {}),

    items: new DataLoader(async function(ids) {
      const objects = db
        .prepare(
          `SELECT * FROM items WHERE type = ? AND foreignId IN (${ids
            .map(() => '?')
            .join(', ')});`,
        )
        .all([Expense.TYPE, ...ids])
        .map(Item.fromDatabase);

      return ids.map(id => objects.filter(object => object.foreignId === id));
    }, {}),

    payments: new DataLoader(async function(ids) {
      const objects = db
        .prepare(
          `SELECT * FROM payments WHERE type = ? AND state <> ? AND foreignId IN (${ids
            .map(() => '?')
            .join(', ')});`,
        )
        .all([
          Expense.TYPE,
          TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
          ...ids,
        ])
        .map(Payment.fromDatabase);

      return ids.map(id => objects.filter(object => object.foreignId === id));
    }, {}),

    length: new DataLoader(async function(ids) {
      const { length } = db
        .prepare(`SELECT COUNT(*) as length FROM expenses;`)
        .get();

      return ids.map(() => length);
    }, {}),

    info: new DataLoader(async function(ids) {
      // Expenses
      const expenses = db
        .prepare(
          `
          SELECT
            s.id AS expenseId,
            SUM(i.qty * i.unitPrice) AS total
          FROM items i LEFT JOIN expenses s on (s.id = i.foreignId)
          WHERE type = ? AND s.id IN (${ids.map(() => '?').join(', ')})
          GROUP BY expenseId;`,
        )
        .all([Expense.TYPE, ...ids]);

      // Payments
      const payments = db
        .prepare(
          `
          SELECT
            s.id AS expenseId,
            SUM(p.amount) as totalPaid
          FROM payments p LEFT JOIN expenses s ON (s.id = p.foreignId)
          WHERE p.state <> ? AND type = ? AND s.id IN (${ids
            .map(() => '?')
            .join(', ')})
          GROUP BY expenseId;`,
        )
        .all([
          TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
          Expense.TYPE,
          ...ids,
        ]);

      return ids.map(id => {
        const index = expenses.findIndex(expense => expense.expenseId === id);

        if (index === -1) {
          return new Error(`Expense info '${id}' not found.`);
        }

        const total = expenses[index].total;

        const paid = payments.reduce(
          (sum, { expenseId, totalPaid }) =>
            expenseId === id ? sum + Money.fromDatabase(totalPaid) : sum,
          0,
        );

        const balanceDue = total - paid;

        return {
          balanceDue,
          paid,
          total,
          isFullyPaid: balanceDue === 0,
        };
      });
    }, {}),
  };
}
