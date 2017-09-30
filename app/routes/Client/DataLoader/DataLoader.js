import { graphql } from 'react-apollo';

import SalesQuery from './getClientSales.query.graphql';

import ExpensesQuery from './getClientExpenses.query.graphql';

import ClientQuery from './getClient.query.graphql';

const expenses = graphql(ExpensesQuery, {
  options: (ownProps) => ({
    variables: {
      id: ownProps.id,
      query: {
        order: 'desc',
        orderBy: 'expense.dateCreated',
      },
    },
  }),
});

const sales = graphql(SalesQuery, {
  options: (ownProps) => ({
    variables: {
      id: ownProps.id,
      query: {
        order: 'desc',
        orderBy: 'sale.dateCreated',
      },
    },
  }),
});

const client = graphql(ClientQuery, {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
});

export default { client, sales, expenses };
