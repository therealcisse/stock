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

import { DEBUG } from 'vars';

const log = require('log')('app:server:graphql');

const rootSchema = [
  `
    type Error {
      code: Int
      message: String
      stack: String
    }

    type Deletion {
      user: User!
      date: Date!
    }

    scalar Date

    scalar JSON

    type Query {
      # Accounts
      getUser(id: ID!): User

      # Events
      timeline(cursor: Date, query: TimelineQuery!): TimelineResponse!
    }

    type Mutation {
      # auth
      logIn(username: String, password: String): LogInResponse!

      setPassword(payload: SetPasswordPayload!): SetPasswordResponse!
      changeEmail(payload: ChangeEmailPayload!): ChangeEmailResponse!
      updateAccountSettings(payload: UpdateAccountSettingsPayload!): UpdateAccountSettingsResponse!

      # Business
      updateBusiness(payload: UpdateBusinessPayload!): UpdateBusinessResponse!

    }

    schema {
      query: Query
      mutation: Mutation
    }

  `,
];

const rootResolvers = {
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

const schema = [...rootSchema, ...userSchema, ...businessSchema, ...eventSchema];

const resolvers = merge(
  {},
  rootResolvers,
  userResolvers,
  businessResolvers,
  eventResolvers,
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
