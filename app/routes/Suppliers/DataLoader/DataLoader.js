import { graphql } from 'react-apollo';

import AllSuppliersQuery from './getAllSuppliers.query.graphql';

import AddSupplierMutation from './addSupplier.mutation.graphql';

const suppliers = graphql(AllSuppliersQuery, {
  options: () => ({
    variables: {
      query: {
        order: 'desc',
        orderBy: 'balanceDue',
      },
    },
  }),
});

const addSupplier = graphql(AddSupplierMutation, {
  props({ mutate }) {
    return {
      addSupplier: (id, payload) =>
        mutate({
          refetchQueries: [],
          variables: { id, payload },
          updateQueries: {
            AllSuppliers(prev, { mutationResult }) {
              if (mutationResult.data.addSupplier.error) {
                return prev;
              }

              const newInfo = mutationResult.data.addSupplier.info;

              if (id) {
                return {
                  getAllSuppliers: [
                    newInfo,
                    ...prev.getAllSuppliers.filter(n => n.supplier.id !== id),
                  ],
                };
              }

              return {
                getAllSuppliers: [newInfo, ...prev.getAllSuppliers],
              };
            },
          },
        }),
    };
  },
});

export default { suppliers, addSupplier };
