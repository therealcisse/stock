import Store from 'Store';

import { graphql } from 'react-apollo';

import SalesQuery from './getSales.query.graphql';

import SalesReportQuery from './getSalesReport.query.graphql';

import AddSaleMutation from './addSale.mutation.graphql';

const salesReport = graphql(SalesReportQuery);

const sales = graphql(SalesQuery, {
  options: () => ({
    variables: {
      cursor: 0,
      query: {
        order: Store.get('sales.order', 'desc'),
        orderBy: Store.get('sales.orderBy', 'balanceDue'),
      },
    },
  }),
});

const addSale = graphql(AddSaleMutation, {
  props({ mutate }) {
    return {
      addSale: payload =>
        mutate({
          refetchQueries: [],
          variables: { payload },
          updateQueries: {
            sales(prev, { mutationResult }) {
              if (mutationResult.data.addSale.error) {
                return prev;
              }

              const newInfo = mutationResult.data.addSale.info;

              return {
                sales: [newInfo, ...prev.sales],
              };
            },
          },
        }),
    };
  },
});

export default { salesReport, sales, addSale };
