import Store from 'Store';

import { graphql } from 'react-apollo';

import ProductQuery from './getProduct.query.graphql';

const product = graphql(ProductQuery, {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
});

export default {
  product,
};
