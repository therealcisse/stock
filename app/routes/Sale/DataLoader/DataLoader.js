import { graphql } from 'react-apollo';

import BusinessQuery from './business.query.graphql';

import SaleQuery from './getSale.query.graphql';

import PaySaleMutation from './paySale.mutation.graphql';
import DelSalePaymentMutation from './delSalePayment.mutation.graphql';
import VoidSaleMutation from './voidSale.mutation.graphql';

const business = graphql(BusinessQuery, {
  props({ data }) {
    return {
      business: data.business || {},
    };
  },
});

const sale = graphql(SaleQuery, {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
});

const paySale = graphql(PaySaleMutation, {
  props({ mutate }) {
    return {
      paySale: (id, payload) =>
        mutate({
          refetchQueries: ['Sale'],
          variables: { id, payload },
          updateQueries: {},
        }),
    };
  },
});

const delSalePayment = graphql(DelSalePaymentMutation, {
  props({ mutate }) {
    return {
      delSalePayment: id =>
        mutate({
          refetchQueries: ['Sale'],
          variables: { id },
          updateQueries: {},
        }),
    };
  },
});

const voidSale = graphql(VoidSaleMutation, {
  props({ mutate }) {
    return {
      voidSale: id =>
        mutate({
          refetchQueries: [],
          variables: { id },
          updateQueries: {
            Sales(prev, { mutationResult }) {
              if (mutationResult.data.voidSale.error) {
                return prev;
              }

              return {
                sales: {
                  ...prev.sales,
                  sales: prev.sales.sales.filter(({ sale }) => sale.id !== id),
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
  sale,
  paySale,
  delSalePayment,
  voidSale,
};
