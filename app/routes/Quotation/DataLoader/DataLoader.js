import { graphql } from 'react-apollo';

import BusinessQuery from './business.query.graphql';

import QuotationQuery from './getQuotation.query.graphql';

import AcceptQuotationMutation from './acceptQuotation.mutation.graphql';
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

const acceptQuotation = graphql(AcceptQuotationMutation, {
  props({ mutate }) {
    return {
      acceptQuotation: id =>
        mutate({
          refetchQueries: ['Quotation'],
          variables: { id },
          updateQueries: {
            Quotations(prev, { mutationResult }) {
              if (mutationResult.data.acceptQuotation.error) {
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
  acceptQuotation,
  voidQuotation,
};
