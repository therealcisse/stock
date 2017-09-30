import { graphql } from 'react-apollo';

import ExpenseQuery from './getExpense.query.graphql';

const expense = graphql(ExpenseQuery, {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
});

export default { expense };
