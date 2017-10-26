import { graphql } from 'react-apollo';

import ExpenseQuery from './getExpense.query.graphql';

import PayExpenseMutation from './payExpense.mutation.graphql';
import DelExpensePaymentMutation from './delExpensePayment.mutation.graphql';
import VoidExpenseMutation from './voidExpense.mutation.graphql';

const expense = graphql(ExpenseQuery, {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
});

const payExpense = graphql(PayExpenseMutation, {
  props({ mutate }) {
    return {
      payExpense: (id, payload) =>
        mutate({
          refetchQueries: ['Expense'],
          variables: { id, payload },
          updateQueries: {},
        }),
    };
  },
});

const delExpensePayment = graphql(DelExpensePaymentMutation, {
  props({ mutate }) {
    return {
      delExpensePayment: id =>
        mutate({
          refetchQueries: ['Expense'],
          variables: { id },
          updateQueries: {},
        }),
    };
  },
});

const voidExpense = graphql(VoidExpenseMutation, {
  props({ mutate }) {
    return {
      voidExpense: id =>
        mutate({
          refetchQueries: ['Result', 'ExpensesReport'],
          variables: { id },
          updateQueries: {
            Expenses(prev, { mutationResult }) {
              if (mutationResult.data.voidExpense.error) {
                return prev;
              }

              return {
                expenses: {
                  ...prev.expenses,
                  expenses: prev.expenses.expenses.filter(
                    ({ expense }) => expense.id !== id,
                  ),
                },
              };
            },
          },
        }),
    };
  },
});

export default { expense, payExpense, delExpensePayment, voidExpense };
