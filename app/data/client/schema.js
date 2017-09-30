import graphqlResolvers from 'data/graphqlResolvers';

import objectAssign from 'object-assign';

export const schema = [
  `

  input GetClientsQuery {
    order: Order!
    orderBy: String!
  }

  type ClientWithInfo {
    client: Client!
    openCount: Int!
    balanceDue: Float!
    totalPaid: Float!
  }

  type Client {
    id: ID!
    displayName: String!
    tel: String
    email: String
    address: String
    taxId: String

    date: Date!
    lastModified: Date!
  }

  input AddClientPayload {
    displayName: String!
    tel: String
    email: String
    address: String
    taxId: String
  }

  type AddClientResponse {
    info: ClientWithInfo
    events: [Event!]!
    error: Error
  }

  extend type Mutation {
    # Client
    addClient(id: ID!, payload: AddClientPayload!): AddClientResponse!
  }

  extend type Query {
    # Client
    getAllClients(query: GetClientsQuery!): [ClientWithInfo!]!
    getClient(id: ID!): ClientWithInfo!
    getClientSales(id: ID!, query: GetSalesQuery!): SalesQueryResponse!
    getClientExpenses(id: ID!, query: GetExpensesQuery!): ExpensesQueryResponse!

  }

`,
];

export const resolvers = {
  AddClientResponse: objectAssign(
    {},
    graphqlResolvers(['info', 'events', 'error']),
  ),

  Client: objectAssign(
    {},
    graphqlResolvers([
      'id',
      'displayName',

      'tel',
      'email',
      'address',
      'taxId',

      'date',
      'lastModified',
    ]),
  ),

  Mutation: {
    async addClient(_, { id, payload }, context) {
      if (!context.user) {
        throw new Error('Login required.');
      }

      // TODO: validate payload

      try {
        const transaction = await context.Clients.addClient(
          id,
          payload,
          context,
        );

        const [info, events] = await Promise.all([
          context.Clients.getClient(transaction.id),
          context.Events.get(transaction.events),
        ]);

        return {
          info,
          events,
        };
      } catch (e) {
        return { error: { code: e.code || null } };
      }
    },
  },

  Query: {
    getAllClients(_, { query }, context) {
      return context.Clients.getAllClients(query);
    },
    getClient(_, { id }, context) {
      return context.Clients.getClient(id);
    },
    getClientSales(_, { id, query }, context) {
      return context.Clients.getClientSales(id, query, context);
    },
    getClientExpenses(_, { id, query }, context) {
      return context.Clients.getClientExpense(id, query, context);
    },
  },
};
