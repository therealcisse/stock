import { graphql } from 'react-apollo';

import BusinessQuery from './business.query.graphql';

import QuotationQuery from './getQuotation.query.graphql';

import ApproveQuotationMutation from './approveQuotation.mutation.graphql';
import VoidQuotationMutation from './voidQuotation.mutation.graphql';

const business = graphql(BusinessQuery, {
  props({ data }) {
    return {
      business: data.business || {},
    };
  },
});

const quotation = graphql(QuotationQuery, {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
});

const approveQuotation = graphql(ApproveQuotationMutation, {
  props({ mutate }) {
    return {
      approveQuotation: id =>
        mutate({
          refetchQueries: ['Quotation'],
          variables: { id },
          updateQueries: {},
        }),
    };
  },
});

const voidQuotation = graphql(VoidQuotationMutation, {
  props({ mutate }) {
    return {
      voidQuotation: id =>
        mutate({
          refetchQueries: ['Quotation'],
          variables: { id },
          updateQueries: {
            Quotations(prev, { mutationResult }) {
              if (mutationResult.data.voidQuotation.error) {
                return prev;
              }

              return {
                quotations: {
                  ...prev.quotations,
                  quotations: prev.quotations.quotations.filter(
                    ({ quotation }) => quotation.id !== id,
                  ),
                },
              };
            },
          },
        }),
    };
  },
});

export default {
  business,
  quotation,
  approveQuotation,
  voidQuotation,
};
