import Store from 'Store';

import { graphql } from 'react-apollo';

import ExpensesQuery from './getExpenses.query.graphql';

import AddExpenseMutation from './addExpense.mutation.graphql';

const expenses = graphql(ExpensesQuery, {
  options: () => ({
    variables: {
      cursor: 0,
      query: {
        order: Store.get('expenses.order', 'desc'),
        orderBy: Store.get('expenses.orderBy', 'expense.dateCreated'),
      },
    },
  }),
});

const addExpense = graphql(AddExpenseMutation, {
  props({ mutate }) {
    return {
      addExpense: payload =>
        mutate({
          refetchQueries: [],
          variables: { payload },
          updateQueries: {
            Expenses(prev, { mutationResult }) {
              if (mutationResult.data.addExpense.error) {
                return prev;
              }

              const newInfo = mutationResult.data.addExpense.info;

              return {
                ...prev,
                expenses: {
                  ...prev.expenses,
                  length: prev.expenses.length,
                  cursor: prev.expenses.expenses.length,
                  prevCursor: prev.expenses.expenses.length,
                  expenses: [newInfo, ...prev.expenses.expenses],
                },
              };
            },
          },
        }),
    };
  },
});

export default { expenses, addExpense };
