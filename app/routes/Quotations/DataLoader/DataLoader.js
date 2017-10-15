import Store from 'Store';

import { graphql } from 'react-apollo';

import QuotationsQuery from './getQuotations.query.graphql';

import NextRefNoQuery from './getQuotationsNextRefNo.query.graphql';

import AddQuotationMutation from './addQuotation.mutation.graphql';

const quotations = graphql(QuotationsQuery, {
  options: () => ({
    variables: {
      cursor: 0,
      query: {
        order: Store.get('quotations.order', 'desc'),
        orderBy: Store.get('quotations.orderBy', 'total'),
      },
    },
  }),
});

const nextRefNo = graphql(NextRefNoQuery, {
  options: () => ({
    cachePolicy: 'network-only',
  }),
});

const addQuotation = graphql(AddQuotationMutation, {
  props({ mutate }) {
    return {
      addQuotation: payload =>
        mutate({
          refetchQueries: [],
          variables: { payload },
          updateQueries: {
            Quotations(prev, { mutationResult }) {
              if (mutationResult.data.addQuotation.error) {
                return prev;
              }

              const newInfo = mutationResult.data.addQuotation.info;

              return {
                ...prev,
                quotations: {
                  ...prev.quotations,
                  length: prev.quotations.quotations.length,
                  cursor: prev.quotations.quotations.length,
                  prevCursor: prev.quotations.quotations.length,
                  quotations: [newInfo, ...prev.quotations.quotations],
                },
              };
            },
          },
        }),
    };
  },
});

export default { nextRefNo, quotations, addQuotation };
