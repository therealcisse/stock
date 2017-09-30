import DataLoader from 'dataloader';

import { Client, Sale, TransactionStatus } from 'data/types';

import { Money } from 'data/utils';

export default function({ db }) {
  return {
    ids: new DataLoader(async function(ids) {
      const objects = db
        .prepare(
          `SELECT * FROM people WHERE id IN (${ids.map(() => '?').join(', ')});`,
        )
        .all(ids)
        .map(Client.fromDatabase);

      return ids.map(id => {
        const index = objects.findIndex(object => object.id === id);
        return index !== -1
          ? objects[index]
          : new Error(`Client ${id} not found`);
      });
    }, {}),

    balance: new DataLoader(async function(ids) {
      // Sales to client (not cancelled)
      const sales = db
        .prepare(
          `
          SELECT
            s.id AS saleId,
            s.clientId AS clientId,
            SUM(i.qty * i.unitPrice) AS totalOwed
          FROM items i LEFT JOIN sales s on (s.id = i.foreignId)
          WHERE s.state <> ? AND type = ? AND s.clientId IN (${ids
            .map(() => '?')
            .join(', ')})
          GROUP BY clientId;`,
        )
        .all([
          TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
          Sale.TYPE,
          ...ids,
        ]);

      // Payments from client (not voided)
      const payments = db
        .prepare(
          `
          SELECT
            s.id AS saleId,
            s.clientId AS clientId,
            SUM(p.amount) as totalPaid
          FROM payments p LEFT JOIN sales s ON (s.id = p.foreignId)
          WHERE s.state <> ? AND p.state <> ? AND type = ? AND s.clientId IN (${ids
            .map(() => '?')
            .join(', ')})
          GROUP BY clientId;`,
        )
        .all([
          TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
          TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
          Sale.TYPE,
          ...ids,
        ]);

      function isFullyPaid(sale) {
        const index = payments.findIndex(
          payment => payment.saleId === sale.saleId,
        );

        if (index !== -1) {
          return payments[index].totalPaid === sale.totalOwed;
        }

        return false;
      }

      return ids.map(id => {
        const clientSales = sales.filter(sale => sale.clientId === id);
        const totalPaid = payments.reduce(
          (sum, { clientId, totalPaid }) =>
            clientId === id ? sum + Money.fromDatabase(totalPaid) : sum,
          0,
        );
        const totalOwed = clientSales.reduce(
          (sum, { totalOwed }) => sum + Money.fromDatabase(totalOwed),
          0,
        );
        return {
          openCount: clientSales.filter(sale => !isFullyPaid(sale)).length,
          balanceDue: totalOwed - totalPaid,
          totalPaid,
        };
      });
    }, {}),
  };
}
