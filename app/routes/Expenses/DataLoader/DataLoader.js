import { graphql } from 'react-apollo';

import ExpensesQuery from './getExpenses.query.graphql';

import AddExpenseMutation from './addExpense.mutation.graphql';

const expenses = graphql(ExpensesQuery, {
  options: () => ({
    variables: {
      cursor: 0,
      query: {
        order: 'desc',
        orderBy: 'expense.dateCreated',
      },
    },
  }),
});

const addExpense = graphql(AddExpenseMutation, {
  props({ mutate }) {
    return {
      addExpense: (payload) =>
        mutate({
          refetchQueries: [],
          variables: { payload },
          updateQueries: {
            expenses(prev, { mutationResult }) {
              if (mutationResult.data.addExpense.error) {
                return prev;
              }

              const newInfo = mutationResult.data.addExpense.info;

              return {
                expenses: [newInfo, ...prev.expenses],
              };
            },
          },
        }),
    };
  },
});

export default { expenses, addExpense };
