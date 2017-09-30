import { graphql } from 'react-apollo';

import SaleQuery from './getSale.query.graphql';

const sale = graphql(SaleQuery, {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
});

export default { sale };
