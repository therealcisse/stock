import graphqlResolvers from 'data/graphqlResolvers';

import objectAssign from 'object-assign';

import { fromJS } from 'immutable';

import businessValidations from 'routes/Settings/containers/Business/BusinessDetailsContainer/validations';

export const schema = [
  `

  # Country
  enum Country {
    MA
  }

  # ------------------------------------
  # Business type
  # ------------------------------------
  type Business {
    id: ID!

    displayName: String
    url: String

    country: Country
    city: String
    address: String
    postalCode: String

    phone: String
    fax: String
    email: String

    patente: String
    taxId: String
    rc: String
    ice: String
    cnss: String

    date: Date!
    lastModified: Date!
  }

  # ------------------------------------
  # Update user business
  # ------------------------------------
  input UpdateBusinessPayload {
    displayName: String
    url: String

    country: Country
    city: String
    address: String
    postalCode: String

    phone: String
    fax: String
    email: String

    patente: String
    taxId: String
    rc: String
    ice: String
    cnss: String
  }

  type UpdateBusinessResponse {
    business: Business,
    errors: JSON!
  }

  extend type Mutation {
    # Business
    updateBusiness(payload: UpdateBusinessPayload!): UpdateBusinessResponse!
  }

  extend type Query {
    business: Business!
  }

`,
];

export const resolvers = {
  Business: objectAssign(
    {},
    graphqlResolvers([
      'id',
      'displayName',
      'url',

      'country',
      'city',
      'address',
      'postalCode',

      'phone',
      'fax',
      'email',

      'patente',
      'taxId',
      'ice',
      'rc',
      'cnss',

      'date',
      'lastModified',
    ]),
  ),

  UpdateBusinessResponse: objectAssign(
    {},
    graphqlResolvers(['business', 'errors']),
  ),

  Mutation: {
    async updateBusiness(obj, { payload }, context) {
      if (!context.user) {
        throw new Error('Login required.');
      }

      try {
        await businessValidations.asyncValidate(fromJS(payload));
      } catch (errors) {
        return { errors };
      }
      const business = await context.Business.updateBusiness(payload, context);
      return { business, errors: {} };
    },
  },

  Query: {
    business(_, {}, context) {
      return context.Business.get();
    },
  },
};
