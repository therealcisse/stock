import graphqlResolvers from 'data/graphqlResolvers';

import objectAssign from 'object-assign';

import invariant from 'invariant';

export const schema = [
  `

  enum EventNS {
    SALES
    EXPENSES
    PRODUCTS
    CLIENTS
    SUPPLIERS
  }

  enum EventType {
    NEW_PRODUCT
    NEW_CLIENT
    NEW_SUPPLIER
    NEW_SALE
    NEW_EXPENSE

    CLIENT_UPDATED
    SUPPLIER_UPDATED
    PRODUCT_UPDATED

    EXPENSE_PAYMENT
    SALE_PAYMENT

    VOID_SALE
    VOID_EXPENSE

    VOID_EXPENSE_PAYMENT
    VOID_SALE_PAYMENT
  }

  # Queries

  input TimelineQuery {
    ns: EventNS
    types: [EventType!]
    id: ID
  }

  type TimelineResponse {
    events: [Event!]!
    prevCursor: Date
    cursor: Date
  }

  # ------------------------------------
  # Event type
  # ------------------------------------
  type Event {
    id: ID!

    timestamp: Date!

    ns: EventNS!

    payment: Payment

    sale: Sale

    expense: Expense

    product: Product

    client: Client

    supplier: Supplier

    type: EventType!
    metadata: JSON!
  }

  extend type Mutation {
  }

  extend type Query {
    # Events
    timeline(cursor: Date, query: TimelineQuery!): TimelineResponse!

  }

`,
];

export const resolvers = {
  Event: objectAssign(
    {},
    {
      metadata: event => (event.metadata ? JSON.parse(event.metadata) : {}),
      sale: (event, {}, context) =>
        event.saleId ? context.Sales.get(event.saleId) : null,
      expense: (event, {}, context) =>
        event.expenseId ? context.Expenses.get(event.expenseId) : null,
      payment: (event, {}, context) =>
        event.paymentId ? context.Sales.getPayment(event.itemId) : null,
      product: (event, {}, context) =>
        event.productId ? context.Products.get(event.productId) : null,
      client: (event, {}, context) =>
        event.clientId ? context.Clients.get(event.clientId) : null,
      supplier: (event, {}, context) =>
        event.supplierId ? context.Suppliers.get(event.supplierId) : null,
    },
    graphqlResolvers(['id', 'ns', 'type', 'timestamp']),
  ),

  Mutation: {},

  Query: {
    timeline(obj, { cursor, query }, context) {
      return context.Events.getTimeline({ cursor, query }, context);
    },
  },
};
