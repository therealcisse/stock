import graphqlResolvers from 'data/graphqlResolvers';

import objectAssign from 'object-assign';

import invariant from 'invariant';

import isEmpty from 'isEmpty';

import { TransactionStatus, Sale } from 'data/types';

export const schema = [
  `

  type SalesLast365 {
    total: Float!
    openCount: Int!
  }

  type PaymentsLast30 {
    total: Float!
    paidCount: Int!
  }

  type SalesReport {
    sales: SalesLast365
    payments: PaymentsLast30
  }

  input GetSalesQuery {
    order: Order!
    orderBy: String!
  }

  type SaleInfo {
    sale: Sale!
    paid: Float!
    total: Float!
    balanceDue: Float!
    isFullyPaid: Boolean!
  }

  type Sale {
    id: ID!
    refNo: Int!
    client: Client!

    status: TransactionStatus

    dateCreated: Date!

    items: [Item!]!
    payments: [Payment!]!

    date: Date!
    lastModified: Date!
  }

  type SalesQueryResponse {
    sales: [SaleInfo!]!
    cursor: Int
    prevCursor: Int
    length: Int!
  }

  input SaleItemInput {
    productId: ID!
    qty: Int!
    unitPrice: Int!
  }

  input AddSalePayload {
    dateCreated: Date!
    client: ID!
    items: [SaleItemInput!]!
    isFullyPaid: Boolean!
  }

  type SaleMutationResponse {
    info: SaleInfo
    events: [Event!]!
    error: Error
  }

  extend type Mutation {
    # Sales
    addSale(payload: AddSalePayload!): SaleMutationResponse!
    voidSale(id: ID!): SaleMutationResponse!
    paySale(id: ID!, payload: AddPaymentPayload!): AddPaymentResponse!
    delSalePayment(id: ID!): AddPaymentResponse!

  }

  extend type Query {
    # Sales
    sales(cursor: Int, query: GetSalesQuery!): SalesQueryResponse!
    getSalesReport: SalesReport!
    getSale(id: ID!): SaleInfo!
    getNextRefNo: Int!

    searchSales(q: String): [Sale!]!
  }

`,
];

export const resolvers = {
  SaleMutationResponse: objectAssign(
    {},
    graphqlResolvers(['info', 'events', 'error']),
  ),

  Sale: objectAssign(
    {},
    {
      payments: (sale, {}, context) => context.Sales.getPayments(sale.id),
      items: (sale, {}, context) => context.Sales.getItems(sale.id),
      client: (sale, {}, context) => context.Clients.get(sale.clientId),
      status: sale => TransactionStatus.fromDatabase(sale.state),
    },
    graphqlResolvers(['id', 'refNo', 'date', 'lastModified']),
  ),

  Mutation: {
    async addSale(_, { payload }, context) {
      if (!context.user) {
        throw new Error('Login required.');
      }

      // TODO: validate payload

      try {
        const info = await context.Sales.addSale(payload, context);

        const [sale, events] = await Promise.all([
          context.Sales.getSale(info.id),
          context.Events.get(info.events),
        ]);

        return {
          info: sale,
          events,
        };
      } catch (e) {
        return { error: { code: e.code || null } };
      }
    },
    async paySale(_, { id, payload }, context) {
      if (!context.user) {
        throw new Error('Login required.');
      }

      // TODO: validate payload

      try {
        const info = await context.Sales.pay(id, payload, context);

        const [foreign, payment, events] = await Promise.all([
          context.Sales.getSale(info.id),
          context.Sales.getPayment(info.paymentId),
          context.Events.get(info.events),
        ]);

        return {
          foreign,
          payment,
          events,
        };
      } catch (e) {
        return { error: { code: e.code || null } };
      }
    },
    async delSalePayment(_, { id }, context) {
      if (!context.user) {
        throw new Error('Login required.');
      }

      try {
        const info = await context.Sales.delPay(id, context);

        const [foreign, payment, events] = await Promise.all([
          context.Sales.getSale(info.id),
          context.Sales.getPayment(info.paymentId),
          context.Events.get(info.events),
        ]);

        return {
          foreign,
          payment,
          events,
        };
      } catch (e) {
        return { error: { code: e.code || null } };
      }
    },
    async voidSale(_, { id }, context) {
      if (!context.user) {
        throw new Error('Login required.');
      }

      try {
        const info = await context.Sales.void(id, context);

        const [sale, events] = await Promise.all([
          context.Sales.getSale(info.id),
          context.Events.get(info.events),
        ]);

        return {
          info: sale,
          events,
        };
      } catch (e) {
        return { error: { code: e.code || null } };
      }
    },
  },

  Query: {
    sales: (_, { cursor, query }, context) => {
      return context.Sales.getSales({ cursor, query }, context);
    },
    getSalesReport: (_, {}, context) => {
      return context.Sales.getSalesReport();
    },
    getSale: (_, { id }, context) => {
      return context.Sales.getSale(id);
    },
    getNextRefNo: (_, {}, context) => {
      return context.Sales.getNextRefNo();
    },
    searchSales: (_, { q }, context) => {
      if (isEmpty(q)) {
        return [];
      }

      return context.Sales.query(q);
    },
  },
};
