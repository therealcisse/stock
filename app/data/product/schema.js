import graphqlResolvers from 'data/graphqlResolvers';

import objectAssign from 'object-assign';

import invariant from 'invariant';

export const schema = [
  `

  input GetProductsQuery {
    order: Order!
    orderBy: String!
  }

  type ProductWithStock {
    product: Product!
    stock: Int!
  }

  type Product {
    id: ID!
    displayName: String!
    unitPrice: Int

    ref: String

    date: Date!
    lastModified: Date!
  }


  input AddProductPayload {
    displayName: String!
    unitPrice: Int
    ref: String
  }

  type AddProductResponse {
    info: ProductWithStock
    events: [Event!]!
    error: Error
  }

  extend type Mutation {
    # Product
    addProduct(id: ID!, payload: AddProductPayload!): AddProductResponse!

  }

  extend type Query {
    # Product
    getAllProducts(query: GetProductsQuery!): [ProductWithStock!]!

  }

`,
];

export const resolvers = {
  AddProductResponse: objectAssign(
    {},
    graphqlResolvers(['info', 'events', 'error']),
  ),

  Product: objectAssign(
    {},
    {
      unitPrice: (obj, {}, context) =>
        obj.unitPrice ? context.Money.fromDatabase(obj.unitPrice) : null,
    },
    graphqlResolvers(['id', 'displayName', 'ref', 'date', 'lastModified']),
  ),

  Mutation: {
    async addProduct(_, { id, payload }, context) {
      if (!context.user) {
        throw new Error('Login required.');
      }

      // TODO: Validate payload

      try {
        const transaction = await context.Products.addProduct(id, payload, context);

        const [product, stock, events] = await Promise.all([
          context.Products.get(transaction.id),
          context.Products.getStock(transaction.id),
          context.Events.get(transaction.events),
        ]);

        return { info: { product, stock }, events };
      } catch (e) {
        return { error: { code: e.code || null } };
      }
    },
  },

  Query: {
    getAllProducts(_, { query }, context) {
      return context.Products.getAllProducts(query);
    },
  },
};
