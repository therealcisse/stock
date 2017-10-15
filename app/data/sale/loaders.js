import DataLoader from 'dataloader';

import { Sale, Item, Payment, Client, TransactionStatus } from 'data/types';

import { Money } from 'data/utils';

import moment from 'moment';

export default function({ db }) {
  return {
    ids: new DataLoader(async function(ids) {
      const objects = db
        .prepare(
          `SELECT * FROM sales WHERE id IN (${ids.map(() => '?').join(', ')});`,
        )
        .all(ids)
        .map(Sale.fromDatabase);

      return ids.map(id => {
        const index = objects.findIndex(object => object.id === id);
        return index !== -1 ? objects[index] : new Error(`Sale ${id} not found`);
      });
    }, {}),

    q: new DataLoader(
      async function(qs) {
        return qs.map((q, index) => {
          return db
            .prepare(
              `SELECT *
               FROM sales
               WHERE clientId IN (
                 SELECT id FROM people_index WHERE type = @personType AND people_index MATCH @match
                 ) OR id IN (
                 SELECT foreignId FROM items WHERE type = @type AND productId IN (
                   SELECT id FROM products_index WHERE products_index MATCH @match
                 )
               ) OR id IN (SELECT id FROM sales_index WHERE sales_index MATCH @match) ORDER BY lastModified LIMIT 5;`,
            )
            .all({
              personType: Client.TYPE,
              type: Sale.TYPE,
              match: q
                .trim()
                .split(/\s+/g)
                .map(s => s + '*')
                .join(' OR '),
            })
            .map(Sale.fromDatabase);
        });
      },
      { cache: false },
    ),

    salesReport: new DataLoader(
      async function(ids) {
        const LAST_YEAR = +moment()
          .startOf('day')
          .add(-365, 'days');

        const LAST_MONTH = +moment()
          .startOf('day')
          .add(-30, 'days');

        // Sales
        const allSales = db
          .prepare(
            `
          SELECT
            s.id AS saleId,
            s.dateCreated AS dateCreated,
            SUM(i.qty * i.unitPrice) AS total
          FROM items i LEFT JOIN sales s on (s.id = i.foreignId)
          WHERE s.state <> ? AND i.type = ?
          GROUP BY s.id;`,
          )
          .all([
            TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
            Sale.TYPE,
          ]);

        // Payments
        const allPayments = db
          .prepare(
            `
          SELECT
            s.id AS saleId,
            p.dateCreated AS dateCreated,
            SUM(p.amount) as total
          FROM payments p LEFT JOIN sales s ON (s.id = p.foreignId)
          WHERE s.state <> ? AND p.state <> ? AND p.type = ?
          GROUP BY s.id;`,
          )
          .all([
            TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
            TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
            Sale.TYPE,
          ]);

        function isPaymentFullyPaid(payment) {
          const index = allSales.findIndex(
            sale => payment.saleId === sale.saleId,
          );

          if (index !== -1) {
            return allSales[index].total === payment.total;
          }

          return false;
        }

        function isSaleFullyPaid(sale) {
          const index = allPayments.findIndex(
            payment => payment.saleId === sale.saleId,
          );

          if (index !== -1) {
            return allPayments[index].total === sale.total;
          }

          return false;
        }

        const payments = allPayments.reduce(
          (sum, { saleId, dateCreated, total }) => ({
            paidCount:
              dateCreated > LAST_MONTH && isPaymentFullyPaid({ saleId, total })
                ? sum.paidCount + 1
                : sum.paidCount,
            total: sum.total + Money.fromDatabase(total),
          }),
          { paidCount: 0, total: 0 },
        );

        const sales = allSales.reduce(
          (sum, { saleId, dateCreated, total }) =>
            dateCreated > LAST_YEAR
              ? {
                  openCount: !isSaleFullyPaid({ saleId, total })
                    ? sum.openCount + 1
                    : sum.openCount,
                  total: sum.total + Money.fromDatabase(total),
                }
              : sum,
          { openCount: 0, total: 0 },
        );

        return ids.map(() => ({
          sales,
          payments,
        }));
      },
      { cacheKeyFn: s => s + '-' + moment().format('YYYY/MM/DD') },
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
        .all([Sale.TYPE, ...ids])
        .map(Item.fromDatabase);

      return ids.map(id => objects.filter(object => object.foreignId === id));
    }, {}),

    payments: new DataLoader(async function(ids) {
      const objects = db
        .prepare(
          `SELECT * FROM payments WHERE state <> ? AND type = ? AND foreignId IN (${ids
            .map(() => '?')
            .join(', ')});`,
        )
        .all([
          TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
          Sale.TYPE,
          ...ids,
        ])
        .map(Payment.fromDatabase);

      return ids.map(id => objects.filter(object => object.foreignId === id));
    }, {}),

    length: new DataLoader(async function(ids) {
      const { length } = db
        .prepare(`SELECT COUNT(*) AS length FROM sales WHERE state <> @state;`)
        .get({
          state: TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
        });

      return ids.map(() => length);
    }, {}),

    info: new DataLoader(async function(ids) {
      // Sales
      const sales = db
        .prepare(
          `
          SELECT
            s.id AS saleId,
            SUM(i.qty * i.unitPrice) AS total
          FROM items i LEFT JOIN sales s on (s.id = i.foreignId)
          WHERE type = ? AND s.id IN (${ids.map(() => '?').join(', ')})
          GROUP BY s.id;`,
        )
        .all([Sale.TYPE, ...ids]);

      // Payments
      const payments = db
        .prepare(
          `
          SELECT
            s.id AS saleId,
            SUM(p.amount) as totalPaid
          FROM payments p LEFT JOIN sales s ON (s.id = p.foreignId)
          WHERE p.state <> ? AND type = ? AND s.id IN (${ids
            .map(() => '?')
            .join(', ')})
          GROUP BY s.id;`,
        )
        .all([
          TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
          Sale.TYPE,
          ...ids,
        ]);

      return ids.map(id => {
        const index = sales.findIndex(sale => sale.saleId === id);

        if (index === -1) {
          return new Error(`Sale info '${id}' not found.`);
        }

        const total = sales[index].total;

        const paid = payments.reduce(
          (sum, { saleId, totalPaid }) =>
            saleId === id ? sum + Money.fromDatabase(totalPaid) : sum,
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
