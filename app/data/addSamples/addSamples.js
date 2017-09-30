// @flow

import gql from 'graphql-tag';

import { Money } from 'data/utils';

import products from './products';

import clients from './clients';

import suppliers from './suppliers';

import expenses from './expenses';

import sales from './sales';

import db from 'data/db';

import asTransaction from 'data/asTransaction';

import { TransactionStatus } from 'data/types';

import { client as apolloClient } from 'apollo';

function random(arr) {
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  return arr[getRandomInt(0, arr.length - 1)];
}

export default asTransaction(async function addSamples() {
  ['products', 'people', 'sales', 'expenses'].forEach(tableName => {
    db.exec(`delete from ${tableName};`);
  });

  // Add
  const _products = await Promise.all(
    products.map(async ({ displayName, unitPrice }) => {
      const { data: { addProduct: { info } } } = await apolloClient.mutate({
        mutation: gql`
          mutation addProduct($id: ID, $payload: AddProductPayload) {
            addProduct(id: $id, payload: $payload) {
              info {
                product {
                  id
                }
              }
            }
          }
        `,
        variables: {
          id: null,
          payload: {
            displayName,
            unitPrice: unitPrice ? Money.toDatabase(unitPrice) : null,
            ref: null,
          },
        },
      });

      return info.product.id;
    }),
  );

  // Add clients
  const _clients = await Promise.all(
    clients.map(async ({ displayName }) => {
      const { data: { addClient: { info } } } = await apolloClient.mutate({
        mutation: gql`
          mutation addClient($id: ID, $payload: AddClientPayload!) {
            addClient(id: $id, payload: $payload) {
              info {
                client {
                  id
                }
              }
            }
          }
        `,
        variables: {
          id: null,
          payload: {
            displayName,
          },
        },
      });

      return info.client.id;
    }),
  );

  // Add suppliers
  const _suppliers = await Promise.all(
    suppliers.map(async ({ displayName }) => {
      const { data: { addSupplier: { info } } } = await apolloClient.mutate({
        mutation: gql`
          mutation addSupplier($id: ID, $payload: AddSupplierPayload!) {
            addSupplier(id: $id, payload: $payload) {
              info {
                supplier {
                  id
                }
              }
            }
          }
        `,
        variables: {
          id: null,
          payload: {
            displayName,
          },
        },
      });

      return info.supplier.id;
    }),
  );

  // Add expenses
  const _expenses = await Promise.all(
    expenses.map(async function({ state, refNo, isFullyPaid, items }) {
      const {
        data: { addExpense: { info, error } },
      } = await apolloClient.mutate({
        mutation: gql`
          mutation addExpense($payload: AddExpensePayload!) {
            addExpense(payload: $payload) {
              error {
                code
              }
              info {
                expense {
                  id
                  items {
                    id
                    qty
                    unitPrice
                  }
                }
              }
            }
          }
        `,
        variables: {
          payload: {
            refNo,
            dateCreated: new Date().getTime(),
            beneficiary: random([random(_suppliers), random(_clients)]),
            items: items.map(({ qty, unitPrice }) => ({
              qty,
              unitPrice: Money.toDatabase(unitPrice),
              productId: random(_products),
            })),
            isFullyPaid,
          },
        },
      });

      if (
        !error &&
        TransactionStatus.fromDatabase(state) === TransactionStatus.CANCELLED
      ) {
        // void
        await apolloClient.mutate({
          mutation: gql`
            mutation voidExpense($id: ID!) {
              voidExpense(id: $id) {
                error {
                  code
                }
              }
            }
          `,
          variables: {
            id: info.expense.id,
          },
        });
      }

      return info.expense.id;
    }),
  );

  // Add sales
  const _sales = await Promise.all(
    sales.map(async function({ state, isFullyPaid, items }) {
      const { data: { addSale: { info, error } } } = await apolloClient.mutate({
        mutation: gql`
          mutation addSale($payload: AddSalePayload!) {
            addSale(payload: $payload) {
              info {
                sale {
                  id
                  items {
                    id
                    qty
                    unitPrice
                  }
                }
              }
            }
          }
        `,
        variables: {
          payload: {
            dateCreated: new Date().getTime(),
            client: random(_clients),
            items: items.map(({ qty, unitPrice }) => ({
              qty,
              unitPrice: Money.toDatabase(unitPrice),
              productId: random(_products),
            })),
            isFullyPaid,
          },
        },
      });

      if (
        !error &&
        TransactionStatus.fromDatabase(state) === TransactionStatus.CANCELLED
      ) {
        // void
        await apolloClient.mutate({
          mutation: gql`
            mutation voidSale($id: ID!) {
              voidSale(id: $id) {
                error {
                  code
                }
              }
            }
          `,
          variables: {
            id: info.sale.id,
          },
        });
      }

      return info.sale.id;
    }),
  );
});
