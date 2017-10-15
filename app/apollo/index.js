import { execute } from 'graphql';

import db from 'data/db';

import Clock from 'Clock';

import getCurrentUser from 'getCurrentUser';

import {
  ApolloClient,
  IntrospectionFragmentMatcher,
  toIdValue,
} from 'react-apollo';

import dataIdFromObject from 'dataIdFromObject';

import { createLocalInterface } from 'apollo-local-query';
import schema from 'data/schema';

// Connectors
import { UserConnector } from 'data/user/connector';
import { BusinessConnector } from 'data/business/connector';
import { EventConnector } from 'data/event/connector';
import { ClientConnector } from 'data/client/connector';
import { SupplierConnector } from 'data/supplier/connector';
import { QuotationConnector } from 'data/quotation/connector';
import { SaleConnector } from 'data/sale/connector';
import { ExpenseConnector } from 'data/expense/connector';
import { ProductConnector } from 'data/product/connector';

// Models
import { Users } from 'data/user/models';
import { Business } from 'data/business/models';
import { Events } from 'data/event/models';
import { Clients } from 'data/client/models';
import { Suppliers } from 'data/supplier/models';
import { Quotations } from 'data/quotation/models';
import { Sales } from 'data/sale/models';
import { Expenses } from 'data/expense/models';
import { Products } from 'data/product/models';

import { Money } from 'data/utils';

import { DEBUG } from 'vars';

const networkInterface = createLocalInterface({ execute }, schema, {
  context: {
    get user() {
      return getCurrentUser();
    },
    Now: Clock.getNow,
    Users: new Users({ connector: new UserConnector({ db }) }),
    Business: new Business({ connector: new BusinessConnector({ db }) }),
    Events: new Events({
      connector: new EventConnector({ db }),
    }),
    Clients: new Clients({ connector: new ClientConnector({ db }) }),
    Suppliers: new Suppliers({ connector: new SupplierConnector({ db }) }),
    Sales: new Sales({ connector: new SaleConnector({ db }) }),
    Quotations: new Quotations({ connector: new QuotationConnector({ db }) }),
    Expenses: new Expenses({ connector: new ExpenseConnector({ db }) }),
    Products: new Products({ connector: new ProductConnector({ db }) }),
    Money,
  },
});

export const client = new ApolloClient({
  ssrMode: true,
  connectToDevTools: __DEV__ || DEBUG,
  networkInterface,
  customResolvers: {
    Query: {
      getBusiness: (_, { id }) =>
        toIdValue(dataIdFromObject({ __typename: 'Business', id })),
      getUser: (_, { id }) =>
        toIdValue(dataIdFromObject({ __typename: 'User', id })),
      getProduct: (_, { id }) =>
        toIdValue(dataIdFromObject({ __typename: 'Product', id })),
      getSale: (_, { id }) =>
        toIdValue(dataIdFromObject({ __typename: 'Sale', id })),
      getExpense: (_, { id }) =>
        toIdValue(dataIdFromObject({ __typename: 'Expense', id })),
      getClient: (_, { id }) =>
        toIdValue(dataIdFromObject({ __typename: 'Client', id })),
      getSupplier: (_, { id }) =>
        toIdValue(dataIdFromObject({ __typename: 'Supplier', id })),
    },
  },
  dataIdFromObject,
  fragmentMatcher: new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
      __schema: {
        types: [
          {
            kind: 'UNION',
            name: 'Operation',
            possibleTypes: [
              {
                name: 'Sale',
              },
              {
                name: 'Expense',
              },
            ],
          },
          {
            kind: 'UNION',
            name: 'OperationInfo',
            possibleTypes: [
              {
                name: 'SaleInfo',
              },
              {
                name: 'ExpenseInfo',
              },
            ],
          },
          {
            kind: 'UNION',
            name: 'Beneficiary',
            possibleTypes: [
              {
                name: 'Client',
              },
              {
                name: 'Supplier',
              },
            ],
          },
        ],
      },
    },
  }),
});
