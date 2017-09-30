import DataLoader from 'dataloader';

import { Supplier, Expense, TransactionStatus } from 'data/types';

import { Money } from 'data/utils';

export default function({ db }) {
  return {
    ids: new DataLoader(async function(ids) {
      const objects = db
        .prepare(
          `SELECT * FROM people WHERE id IN (${ids.map(() => '?').join(', ')});`,
        )
        .all(ids)
        .map(Supplier.fromDatabase);

      return ids.map(id => {
        const index = objects.findIndex(object => object.id === id);
        return index !== -1
          ? objects[index]
          : new Error(`Supplier ${id} not found`);
      });
    }, {}),

    balance: new DataLoader(async function(ids) {
      // Expense from beneficiarys (not cancelled)
      const expenses = db
        .prepare(
          `
          SELECT
            s.id AS expenseId,
            s.beneficiaryId AS beneficiaryId,
            SUM(i.qty * i.unitPrice) AS totalOwed
          FROM items i LEFT JOIN expenses s on (s.id = i.foreignId)
          WHERE s.state <> ? AND type = ? AND s.beneficiaryId IN (${ids
            .map(() => '?')
            .join(', ')})
          GROUP BY beneficiaryId;`,
        )
        .all([
          TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
          Expense.TYPE,
          ...ids,
        ]);

      // Payments from beneficiarys (not voided)
      const payments = db
        .prepare(
          `
          SELECT
            s.id AS expenseId,
            s.beneficiaryId AS beneficiaryId,
            SUM(p.amount) as totalPaid
          FROM payments p LEFT JOIN expenses s ON (s.id = p.foreignId)
          WHERE s.state <> ? AND p.state <> ? AND type = ? AND s.beneficiaryId IN (${ids
            .map(() => '?')
            .join(', ')})
          GROUP BY beneficiaryId;`,
        )
        .all([
          TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
          TransactionStatus.toDatabase(TransactionStatus.CANCELLED),
          Expense.TYPE,
          ...ids,
        ]);

      function isFullyPaid(expense) {
        const index = payments.findIndex(
          payment => payment.expenseId === expense.expenseId,
        );

        if (index !== -1) {
          return payments[index].totalPaid >= expense.totalOwed;
        }

        return false;
      }

      return ids.map(id => {
        const totalPaid = payments.reduce(
          (sum, { beneficiaryId, totalPaid }) =>
            beneficiaryId === id ? sum + Money.fromDatabase(totalPaid) : sum,
          0,
        );
        const totalOwed = expenses.reduce(
          (sum, { beneficiaryId, totalOwed }) =>
            beneficiaryId === id ? sum + Money.fromDatabase(totalOwed) : sum,
          0,
        );
        return {
          balanceDue: totalOwed - totalPaid,
          totalPaid,
        };
      });
    }, {}),
  };
}
