import Store from 'Store';

import { graphql } from 'react-apollo';

import SalesQuery from './getSales.query.graphql';

import NextRefNoQuery from './getNextRefNo.query.graphql';

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

const nextRefNo = graphql(NextRefNoQuery, {
  options: () => ({
    cachePolicy: 'network-only',
  }),
});

const addSale = graphql(AddSaleMutation, {
  props({ mutate }) {
    return {
      addSale: payload =>
        mutate({
          refetchQueries: ['SalesReport', 'Result'],
          variables: { payload },
          updateQueries: {
            Sales(prev, { mutationResult }) {
              if (mutationResult.data.addSale.error) {
                return prev;
              }

              const newInfo = mutationResult.data.addSale.info;

              return {
                ...prev,
                sales: {
                  ...prev.sales,
                  length: prev.sales.sales.length,
                  cursor: prev.sales.sales.length,
                  prevCursor: prev.sales.sales.length,
                  sales: [newInfo, ...prev.sales.sales],
                },
              };
            },
          },
        }),
    };
  },
});

export default { salesReport, nextRefNo, sales, addSale };
