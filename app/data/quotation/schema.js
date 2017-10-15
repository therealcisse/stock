import graphqlResolvers from 'data/graphqlResolvers';

import objectAssign from 'object-assign';

import invariant from 'invariant';

import isEmpty from 'isEmpty';

import { TransactionStatus, Quotation } from 'data/types';

export const schema = [
  `

  input GetQuotationsQuery {
    order: Order!
    orderBy: String!
  }

  type QuotationInfo {
    quotation: Quotation!
    total: Float!
  }

  type Quotation {
    id: ID!
    refNo: Int!
    client: Client!

    status: TransactionStatus

    dateCreated: Date!

    items: [Item!]!

    sale: Sale

    date: Date!
    lastModified: Date!
  }

  type QuotationsQueryResponse {
    quotations: [QuotationInfo!]!
    cursor: Int
    prevCursor: Int
    length: Int!
  }

  input QuotationItemInput {
    productId: ID!
    qty: Int!
    unitPrice: Int!
  }

  input AddQuotationPayload {
    dateCreated: Date!
    client: ID!
    items: [QuotationItemInput!]!
  }

  type QuotationMutationResponse {
    info: QuotationInfo
    events: [Event!]!
    error: Error
  }

  extend type Mutation {
    # Quotations
    addQuotation(payload: AddQuotationPayload!): QuotationMutationResponse!
    voidQuotation(id: ID!): QuotationMutationResponse!
    approveQuotation(id: ID!): QuotationMutationResponse!

  }

  extend type Query {
    # Quotations
    quotations(cursor: Int, query: GetQuotationsQuery!): QuotationsQueryResponse!
    getQuotation(id: ID!): QuotationInfo!
    getQuotationsNextRefNo: Int!

    searchQuotations(q: String): [Quotation!]!
  }

`,
];

export const resolvers = {
  QuotationMutationResponse: objectAssign(
    {},
    graphqlResolvers(['info', 'events', 'error']),
  ),

  Quotation: objectAssign(
    {},
    {
      items: (quotation, {}, context) =>
        context.Quotations.getItems(quotation.id),
      client: (quotation, {}, context) =>
        context.Clients.get(quotation.clientId),
      sale: (quotation, {}, context) =>
        quotation.saleId ? context.Sales.get(quotation.saleId) : null,
      status: quotation => TransactionStatus.fromDatabase(quotation.state),
    },
    graphqlResolvers(['id', 'refNo', 'date', 'lastModified']),
  ),

  Mutation: {
    async addQuotation(_, { payload }, context) {
      if (!context.user) {
        throw new Error('Login required.');
      }

      // TODO: validate payload

      try {
        const info = await context.Quotations.addQuotation(payload, context);

        const [quotation, events] = await Promise.all([
          context.Quotations.getQuotation(info.id),
          context.Events.get(info.events),
        ]);

        return {
          info: quotation,
          events,
        };
      } catch (e) {
        return { error: { code: e.code || null } };
      }
    },
    async approveQuotation(_, { id }, context) {
      if (!context.user) {
        throw new Error('Login required.');
      }

      // TODO: validate payload

      try {
        const info = await context.Quotations.approve(id, context);

        const [quotation, events] = await Promise.all([
          context.Quotations.getQuotation(info.id),
          context.Events.get(info.events),
        ]);

        return {
          info: quotation,
          events,
        };
      } catch (e) {
        return { error: { code: e.code || null } };
      }
    },
    async voidQuotation(_, { id }, context) {
      if (!context.user) {
        throw new Error('Login required.');
      }

      try {
        const info = await context.Quotations.void(id, context);

        const [quotation, events] = await Promise.all([
          context.Quotations.getQuotation(info.id),
          context.Events.get(info.events),
        ]);

        return {
          info: quotation,
          events,
        };
      } catch (e) {
        return { error: { code: e.code || null } };
      }
    },
  },

  Query: {
    quotations: (_, { cursor, query }, context) => {
      return context.Quotations.getQuotations({ cursor, query }, context);
    },
    getQuotation: (_, { id }, context) => {
      return context.Quotations.getQuotation(id);
    },
    getQuotationsNextRefNo: (_, {}, context) => {
      return context.Quotations.getNextRefNo();
    },
    searchQuotations: (_, { q }, context) => {
      if (isEmpty(q)) {
        return [];
      }

      return context.Quotations.query(q);
    },
  },
};
