import { graphql } from 'react-apollo';

import ExpensesQuery from './getSupplierExpenses.query.graphql';

import SupplierQuery from './getSupplier.query.graphql';

const expenses = graphql(ExpensesQuery, {
  options: ownProps => ({
    variables: {
      id: ownProps.id,
      query: {
        order: 'desc',
        orderBy: 'expense.dateCreated',
      },
    },
  }),
});

const supplier = graphql(SupplierQuery, {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
});

export default { supplier, expenses };
