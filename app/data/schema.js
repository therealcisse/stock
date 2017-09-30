import graphqlResolvers from 'data/graphqlResolvers';

import objectAssign from 'object-assign';

// import R from 'R';

import { GraphQLError } from 'graphql/error';
import { Kind } from 'graphql/language';

import { makeExecutableSchema } from 'graphql-tools';

import merge from 'lodash.merge';

import moment from 'moment';

import invariant from 'invariant';

import parseJSONLiteral from './parseJSONLiteral';

import {
  schema as userSchema,
  resolvers as userResolvers,
} from 'data/user/schema';

import {
  schema as businessSchema,
  resolvers as businessResolvers,
} from 'data/business/schema';

import {
  schema as eventSchema,
  resolvers as eventResolvers,
} from 'data/event/schema';

import {
  schema as clientSchema,
  resolvers as clientResolvers,
} from 'data/client/schema';

import {
  schema as supplierSchema,
  resolvers as supplierResolvers,
} from 'data/supplier/schema';

import {
  schema as saleSchema,
  resolvers as saleResolvers,
} from 'data/sale/schema';

import {
  schema as expenseSchema,
  resolvers as expenseResolvers,
} from 'data/expense/schema';

import {
  schema as productSchema,
  resolvers as productResolvers,
} from 'data/product/schema';

import { Sale, Expense, TransactionStatus } from 'data/types';

import { DEBUG } from 'vars';

const log = require('log')('app:server:graphql');

const rootSchema = [
  `

  enum Order {
    asc
    desc
  }

  type Error {
    code: Int
    message: String
    stack: String
  }

  scalar Date

  scalar JSON

  type Query {
    dummy: Int!
  }

  type Mutation {
    dummy: Int!
  }

  schema {
    query: Query
    mutation: Mutation
  }

  # -------------------------------------------------------------------

  input AddPaymentPayload {
    amount: Int!
    dateCreated: Int!
  }

  union OperationInfo = SaleInfo | ExpenseInfo

  type AddPaymentResponse {
    foreign: OperationInfo
    payment: Payment
    events: [Event!]!
    error: Error
  }

  union Operation = Sale | Expense

  enum TransactionType {
    SALE
    EXPENSE
  }

  enum TransactionStatus {
    CANCELLED
  }

  type Item {
    id: ID!

    type: TransactionType!

    foreign: Operation!

    product: Product!

    qty: Int!

    unitPrice: Int!

    dateCreated: Date!

    date: Date!
  }

  type Payment {
    id: ID!

    type: TransactionType!

    foreign: Operation!

    amount: Int!

    status: TransactionStatus

    dateCreated: Date!

    date: Date!
  }

  `,
];

const rootResolvers = {
  AddPaymentResponse: objectAssign(
    {},
    graphqlResolvers(['foreign', 'payment', 'events', 'error']),
  ),

  Item: objectAssign(
    {},
    {
      foreign: (obj, {}, context) => {
        switch (obj.type) {
          case Sale.TYPE:
            return context.Sales.get(obj.foreignId);
          case Expense.TYPE:
            return context.Expenses.get(obj.foreignId);
        }
        throw new Error(`Item is invalid: ${obj}`);
      },
      product: (obj, {}, context) => context.Products.get(obj.productId),
      unitPrice: (obj, {}, context) => context.Money.fromDatabase(obj.unitPrice),
    },
    graphqlResolvers(['id', 'type', 'qty', 'dateCreated', 'date']),
  ),

  Payment: objectAssign(
    {},
    {
      status: (obj, {}, context) => TransactionStatus.fromDatabase(obj.state),
      foreign: (obj, {}, context) => {
        switch (obj.type) {
          case Sale.TYPE:
            return context.Sales.get(obj.foreignId);
          case Expense.TYPE:
            return context.Expenses.get(obj.foreignId);
        }
        throw new Error(`Payment is invalid: ${obj}`);
      },
      amount: (obj, {}, context) => context.Money.fromDatabase(obj.amount),
    },
    graphqlResolvers(['id', 'type', 'dateCreated', 'date']),
  ),

  Date: {
    __parseValue(value) {
      invariant(typeof value === 'number', 'Number required.');
      return new Date(value); // value from the client
    },
    __serialize(value: any): number {
      if (value instanceof Date) {
        return value.getTime(); // value sent to the client
      }

      if (moment.isMoment(value)) {
        return +value; // value sent to the client
      }

      if (typeof value === 'string' || Number.isInteger(value)) {
        const mDate = moment.utc(value);
        if (mDate.isValid()) {
          return +mDate; // value sent to the client
        }
      }

      throw new Error('Field error: value is an invalid Date');
    },
    __parseLiteral(ast: any): ?number {
      if (ast.kind !== Kind.INT) {
        throw new GraphQLError(
          'Query error: Can only parse integers to dates but got a: ' + ast.kind,
          [ast],
        );
      }
      return parseInt(ast.value, 10); // ast value is always in string format
    },
  },

  JSON: {
    __parseLiteral: parseJSONLiteral,
    __serialize: value => value,
    __parseValue: value => value,
  },
};

const schema = [
  ...rootSchema,
  ...userSchema,
  ...businessSchema,
  ...eventSchema,
  ...clientSchema,
  ...supplierSchema,
  ...productSchema,
  ...saleSchema,
  ...expenseSchema,
];

const resolvers = merge(
  {},
  rootResolvers,
  userResolvers,
  businessResolvers,
  eventResolvers,
  clientResolvers,
  supplierResolvers,
  productResolvers,
  saleResolvers,
  expenseResolvers,
);

export default makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolvers,
  allowUndefinedInResolve: false,
  logger: {
    log: e => {
      log.error('[GRAPHQL ERROR]', require('util').inspect(e));
      if (!__DEV__ && !DEBUG) {
        // R.captureException(e, {});
      }
    },
  },
  resolverValidationOptions: {
    requireResolversForArgs: true,
    requireResolversForNonScalar: __DEV__,
  },
});
