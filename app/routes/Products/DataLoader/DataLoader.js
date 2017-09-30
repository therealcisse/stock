import { graphql } from 'react-apollo';

import AllProductsQuery from './getAllProducts.query.graphql';

import AddProductMutation from './addProduct.mutation.graphql';

const products = graphql(AllProductsQuery, {
  options: () => ({
    variables: {
      query: {
        order: 'desc',
        orderBy: 'stock',
      },
    },
  }),
});

const addProduct = graphql(AddProductMutation, {
  props({ mutate }) {
    return {
      addProduct: (id, payload) =>
        mutate({
          refetchQueries: [],
          variables: { id, payload },
          updateQueries: {
            AllProducts(prev, { mutationResult }) {
              if (mutationResult.data.addProduct.error) {
                return prev;
              }

              const newInfo = mutationResult.data.addProduct.info;

              if (id) {
                return {
                  getAllProducts: [
                    newInfo,
                    ...prev.getAllProducts.filter(n => n.product.id !== id),
                  ],
                };
              }

              return {
                getAllProducts: [newInfo, ...prev.getAllProducts],
              };
            },
          },
        }),
    };
  },
});

export default { products, addProduct };
