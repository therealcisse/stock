import { execute } from 'graphql';

import db from 'data/db';

import getCurrentUser from 'getCurrentUser';

import ApolloClient, { toIdValue } from 'apollo-client';

import dataIdFromObject from 'dataIdFromObject';

import { createLocalInterface } from 'apollo-local-query';
import schema from 'data/schema';

// Connectors
import { UserConnector } from 'data/user/connector';
import { BusinessConnector } from 'data/business/connector';
import { EventConnector } from 'data/event/connector';

// Models
import { Users } from 'data/user/models';
import { Business } from 'data/business/models';
import { Events } from 'data/event/models';

const networkInterface = createLocalInterface({ execute }, schema, {
  context: {
    get user() {
      return getCurrentUser();
    },
    Now: Date.now,
    Users: new Users({ connector: new UserConnector({ db }) }),
    Business: new Business({ connector: new BusinessConnector({ db }) }),
    Events: new Events({
      connector: new EventConnector({ db }),
    }),
  },
});

export const client = new ApolloClient({
  ssrMode: true,
  // Remember that this is the interface the SSR server will use to connect to the
  // API server, so we need to ensure it isn't firewalled, etc
  networkInterface,
  customResolvers: {
    Query: {
      getUser: (_, { id }) =>
        toIdValue(dataIdFromObject({ __typename: 'User', id })),
    },
  },
  dataIdFromObject,
  batchMax: 10,
});
