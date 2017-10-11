import graphqlResolvers from 'data/graphqlResolvers';

import objectAssign from 'object-assign';

import isEmpty from 'isEmpty';

export const schema = [
  `
  input GetSuppliersQuery {
    order: Order!
    orderBy: String!
  }

  type SupplierInfo {
    supplier: Supplier!
    balanceDue: Float!
    totalPaid: Float!
  }

  type Supplier {
    id: ID!
    displayName: String!
    tel: String
    email: String
    address: String
    taxId: String

    date: Date!
    lastModified: Date!
  }

  input AddSupplierPayload {
    displayName: String!
    tel: String
    email: String
    address: String
    taxId: String
  }

  type AddSupplierResponse {
    info: SupplierInfo
    events: [Event!]!
    error: Error
  }

  extend type Mutation {
    # Supplier
    addSupplier(id: ID!, payload: AddSupplierPayload!): AddSupplierResponse!

  }

  extend type Query {
    # Supplier
    getAllSuppliers(query: GetSuppliersQuery!): [SupplierInfo!]!
    getSupplier(id: ID!): SupplierInfo!
    getSupplierExpenses(id: ID!, query: GetExpensesQuery!): ExpensesQueryResponse!

    searchSuppliers(q: String): [Supplier!]!
  }

`,
];

export const resolvers = {
  AddSupplierResponse: objectAssign(
    {},
    graphqlResolvers(['info', 'events', 'error']),
  ),

  Supplier: objectAssign(
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
    async addSupplier(_, { id, payload }, context) {
      if (!context.user) {
        throw new Error('Login required.');
      }

      // TODO: validate payload

      try {
        const transaction = await context.Suppliers.addSupplier(
          id,
          payload,
          context,
        );

        const [info, events] = await Promise.all([
          context.Suppliers.getSupplier(transaction.id),
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
    getAllSuppliers(_, { query }, context) {
      return context.Suppliers.getAllSuppliers(query);
    },
    getSupplier(_, { id }, context) {
      return context.Suppliers.getSupplier(id);
    },
    getSupplierExpenses(_, { id, query }, context) {
      return context.Suppliers.getSupplierExpenses(id, query, context);
    },
    searchSuppliers(_, { q }, context) {
      if (isEmpty(q)) {
        return [];
      }

      return context.Suppliers.query(q);
    },
  },
};
