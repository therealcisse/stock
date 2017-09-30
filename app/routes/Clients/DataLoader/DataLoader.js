import { graphql } from 'react-apollo';

import AllClientsQuery from './getAllClients.query.graphql';

import AddClientMutation from './addClient.mutation.graphql';

const clients = graphql(AllClientsQuery, {
  options: () => ({
    variables: {
      query: {
        order: 'desc',
        orderBy: 'balanceDue',
      },
    },
  }),
});

const addClient = graphql(AddClientMutation, {
  props({ mutate }) {
    return {
      addClient: (id, payload) =>
        mutate({
          refetchQueries: [],
          variables: { id, payload },
          updateQueries: {
            AllClients(prev, { mutationResult }) {
              if (mutationResult.data.addClient.error) {
                return prev;
              }

              const newInfo = mutationResult.data.addClient.info;

              if (id) {
                return {
                  getAllClients: [
                    newInfo,
                    ...prev.getAllClients.filter(n => n.client.id !== id),
                  ],
                };
              }

              return {
                getAllClients: [newInfo, ...prev.getAllClients],
              };
            },
          },
        }),
    };
  },
});

export default { clients, addClient };
