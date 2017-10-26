import graphqlResolvers from 'data/graphqlResolvers';

import objectAssign from 'object-assign';

import invariant from 'invariant';

import isEmpty from 'isEmpty';

import { TransactionStatus, Expense, Client, Supplier } from 'data/types';

export const schema = [
  `

  input GetExpensesQuery {
    order: Order!
    orderBy: String!
  }

  type ExpenseInfo {
    expense: Expense!
    paid: Float!
    total: Float!
    balanceDue: Float!
    isFullyPaid: Boolean!
  }

  union Beneficiary = Client | Supplier

  type Expense {
    id: ID!

    refNo: String

    beneficiary: Beneficiary!

    status: TransactionStatus

    dateCreated: Date!

    items: [Item!]!
    payments: [Payment!]!

    date: Date!
    lastModified: Date!
  }

  type ExpensesQueryResponse {
    expenses: [ExpenseInfo!]!
    cursor: Int
    prevCursor: Int
    length: Int!
  }

  input ExpenseItemInput {
    productId: ID!
    qty: Int!
    unitPrice: Int!
  }

  input AddExpensePayload {
    refNo: String
    dateCreated: Date!
    beneficiary: ID!
    items: [ExpenseItemInput!]!
    isFullyPaid: Boolean!
  }

  type ExpenseMutationResponse {
    info: ExpenseInfo
    events: [Event!]!
    error: Error
  }

  type ExpensesReport {
    total: Float!
    data: [JSON!]!
  }

  extend type Mutation {
    # Expenses
    addExpense(payload: AddExpensePayload!): ExpenseMutationResponse!
    voidExpense(id: ID!): ExpenseMutationResponse!
    payExpense(id: ID!, payload: AddPaymentPayload!): AddPaymentResponse!
    delExpensePayment(id: ID!): AddPaymentResponse!
  }

  extend type Query {
    # Expenses
    expenses(cursor: Int, query: GetExpensesQuery!): ExpensesQueryResponse!
    getExpense(id: ID!): ExpenseInfo!

    searchExpenses(q: String): [Expense!]!

    getExpensesReport(from: Date!, to: Date): ExpensesReport!
  }
`,
];

export const resolvers = {
  Beneficiary: {
    __resolveType(data, context, info) {
      if (data.type === Client.TYPE) {
        return info.schema.getType('Client');
      }
      if (data.type === Supplier.TYPE) {
        return info.schema.getType('Supplier');
      }
      return null;
    },
  },

  ExpenseMutationResponse: objectAssign(
    {},
    graphqlResolvers(['info', 'events', 'error']),
  ),

  Expense: objectAssign(
    {},
    {
      payments: (expense, {}, context) =>
        context.Expenses.getPayments(expense.id),
      items: (expense, {}, context) => context.Expenses.getItems(expense.id),
      beneficiary: (expense, {}, context) =>
        Promise.all([
          context.Suppliers.get(expense.beneficiaryId),
          context.Clients.get(expense.beneficiaryId),
        ]).then(([supplier, client]) => supplier || client),
      status: expense => TransactionStatus.fromDatabase(expense.state),
    },
    graphqlResolvers(['id', 'refNo', 'date', 'lastModified']),
  ),

  Mutation: {
    async addExpense(_, { payload }, context) {
      if (!context.user) {
        throw new Error('Login required.');
      }

      // TODO: validate payload

      try {
        const info = await context.Expenses.addExpense(payload, context);

        const [expense, events] = await Promise.all([
          context.Expenses.getExpense(info.id),
          context.Events.get(info.events),
        ]);

        return {
          info: expense,
          events,
        };
      } catch (e) {
        return { error: { code: e.code || null } };
      }
    },
    async payExpense(_, { id, payload }, context) {
      // TODO: validate user

      // TODO: validate payload

      try {
        const info = await context.Expenses.pay(id, payload, context);

        const [foreign, payment, events] = await Promise.all([
          context.Expenses.getExpense(info.id),
          context.Expenses.getPayment(info.paymentId),
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
    async delExpensePayment(_, { id }, context) {
      // TODO: validate user

      try {
        const info = await context.Expenses.delPay(id, context);

        const [foreign, payment, events] = await Promise.all([
          context.Expenses.getExpense(info.id),
          context.Expenses.getPayment(info.paymentId),
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
    async voidExpense(_, { id }, context) {
      // TODO: validate user

      try {
        const info = await context.Expenses.void(id, context);

        const [expense, events] = await Promise.all([
          context.Expenses.getExpense(info.id),
          context.Events.get(info.events),
        ]);

        return {
          info: expense,
          events,
        };
      } catch (e) {
        return { error: { code: e.code || null } };
      }
    },
  },

  Query: {
    expenses(_, { cursor, query }, context) {
      if (!context.user) {
        return {
          expenses: [],
          cursor: 0,
          prevCursor: null,
          length: 0,
        };
      }

      return context.Expenses.getExpenses({ cursor, query }, context);
    },
    getExpensesReport: (_, { from, to }, context) => {
      return context.Expenses.getExpensesReport({ from, to }, context);
    },
    getExpense: (_, { id }, context) => {
      return context.Expenses.getExpense(id);
    },
    searchExpenses: (_, { q }, context) => {
      if (isEmpty(q)) {
        return [];
      }

      return context.Expenses.query(q);
    },
  },
};
