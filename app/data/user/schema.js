import graphqlResolvers from '../graphqlResolvers';

import objectAssign from 'object-assign';

import accountSettingsValidations from 'routes/Settings/containers/Account/AccountSettingsContainer/validations';
import emailValidations from './emailValidations';
import passwordValidations from './passwordValidations';

import { fromJS } from 'immutable';

const log = require('log')('app:server:graphql');

export const schema = [
  `

  type LogInResponse {
    user: User
    error: Error
  }

  # ------------------------------------
  # Change email
  # ------------------------------------

  input ChangeEmailPayload {
    email: String
  }

  type ChangeEmailResponse {
    user: User!
    errors: JSON!
  }

  # ------------------------------------
  # Set password
  # ------------------------------------

  input SetPasswordPayload {
    currentPassword: String
    newPassword: String
  }

  type SetPasswordResponse {
    errors: JSON!
  }

  # ------------------------------------
  # Update account settings
  # ------------------------------------
  input UpdateAccountSettingsPayload {
    displayName: String!
  }

  type UpdateAccountSettingsResponse {
    user: User,
    errors: JSON!
  }

  # ------------------------------------
  # User type
  # ------------------------------------
  type User {
    id: ID!

    changePasswordAtNextLogin: Boolean

    displayName: String
    email: String
    username: String!

    date: Date!
    lastModified: Date!

    business: Business
  }

  extend type Mutation {
    # auth
    logIn(username: String, password: String): LogInResponse!

    setPassword(payload: SetPasswordPayload!): SetPasswordResponse!
    changeEmail(payload: ChangeEmailPayload!): ChangeEmailResponse!
    updateAccountSettings(payload: UpdateAccountSettingsPayload!): UpdateAccountSettingsResponse!
  }

  extend type Query {
    getUser(id: ID!): User!
  }
`,
];

export const resolvers = {
  User: objectAssign(
    {
      business(_, {}, context) {
        return context.Business.get();
      },
    },
    graphqlResolvers([
      'id',
      'changePasswordAtNextLogin',
      'displayName',
      'email',
      'username',
      'date',
      'lastModified',
    ]),
  ),

  ChangeEmailResponse: objectAssign({}, graphqlResolvers(['user', 'errors'])),

  SetPasswordResponse: objectAssign({}, graphqlResolvers(['errors'])),

  UpdateAccountSettingsResponse: objectAssign(
    {},
    graphqlResolvers(['user', 'errors']),
  ),

  LogInResponse: objectAssign({}, graphqlResolvers(['user', 'error'])),

  Mutation: {
    async updateAccountSettings(_, { payload }, context) {
      if (!context.user) {
        throw new Error('Login required.');
      }

      try {
        await accountSettingsValidations.asyncValidate(fromJS(payload));
      } catch (errors) {
        return { errors };
      }
      const user = await context.Users.updateAccountSettings(payload, context);
      return { user, errors: {} };
    },
    async changeEmail(_, { payload }, context) {
      if (!context.user) {
        throw new Error('Login required.');
      }
      try {
        await emailValidations.asyncValidate(
          fromJS({ ...payload, user: context.user }),
        );
      } catch (errors) {
        return { errors };
      }
      const user = await context.Users.changeEmail(payload, context);
      return { user, errors: {} };
    },
    async setPassword(_, { payload }, context) {
      if (!context.user) {
        throw new Error('Login required.');
      }
      try {
        await passwordValidations.asyncValidate(
          fromJS({ ...payload, user: context.user }),
        );
      } catch (errors) {
        return { errors };
      }

      try {
        await context.Users.setPassword(payload, context);
      } catch (errors) {
        return { errors };
      }

      return { errors: {} };
    },

    // auth
    async logIn(_, { username, password }, context) {
      try {
        const user = await context.Users.logIn({ username, password });
        return { user };
      } catch (e) {
        return { error: { code: e.code || null } };
      }
    },
  },

  Query: {
    getUser(_, { id }, context) {
      return context.Users.get(id);
    },
  },
};
