// @flow

import Loaders from './loaders';

import asTransaction from 'data/asTransaction';

import invariant from 'invariant';

import { Product, Event, Sale, Expense } from 'data/types';

import uuid from 'uuid';

import sort from 'lodash.orderby';

export class ProductConnector {
  constructor({ db }) {
    this.db = db;
    this.loaders = Loaders({ db });

    this.addProduct = asTransaction(this.addProduct.bind(this));
  }

  getStock(id: string): Promise<any> {
    return this.loaders.stock.load(id);
  }

  async getProduct(id: string): Promise<any> {
    const product = await this.get(id);

    return { product, stock: await this.getStock(id) };
  }

  async newItem({
    type,
    foreignId,
    productId,
    qty,
    unitPrice,
    dateNow,
    dateCreated,
  }: {
    type: typeof Expense.TYPE | typeof Sale.TYPE,
    foreignId: string,
    productId: string,
    qty: number,
    unitPrice: number,
    dateNow: number,
    dateCreated: number,
  }): string {
    invariant(
      this.db.inTransaction,
      `Products.newItem must be ran in a transaction`,
    );

    this.loaders.stock.clear(productId);

    const id = uuid();

    this.db
      .prepare(
        `INSERT INTO items (id, type, foreignId, productId, qty, unitPrice, dateCreated, date) VALUES (@id, @type, @foreignId, @productId, @qty, @unitPrice, @dateCreated, @date);`,
      )
      .run({
        id,
        type,
        foreignId,
        productId,
        qty,
        unitPrice,
        dateCreated,
        date: dateNow,
      });

    return id;
  }

  get(id) {
    return this.loaders.ids.load(id);
  }

  async getAllProducts({ order, orderBy }) {
    const objects = this.db
      .prepare(`SELECT * FROM products;`)
      .all()
      .map(Product.fromDatabase);

    const products = await Promise.all(
      objects.map(async product => ({
        product,
        stock: await this.getStock(product.id),
      })),
    );

    return sort(products, [orderBy], [order]);
  }

  async addProduct(id, { displayName, unitPrice, ref }, { Events, Now }) {
    if (id) {
      this.loaders.ids.clear(id);

      this.db
        .prepare(
          `UPDATE products set displayName = @displayName, unitPrice = @unitPrice, ref = @ref, lastModified = @lastModified WHERE id = @id;`,
        )
        .run({
          displayName,
          unitPrice,
          ref,
          lastModified: Now(),
          id,
        });

      const event = await Events.create({
        ns: Event.NS_PRODUCTS,
        type: Event.TYPE_PRODUCT_UPDATED,
        clientId: id,
        metadata: JSON.stringify({}),
        timestamp: Now(),
      });

      return { id, events: [event] };
    } else {
      const newId = uuid();

      this.db
        .prepare(
          `INSERT INTO products (id, displayName, unitPrice, ref, date, lastModified) VALUES (@id, @displayName, @unitPrice, @ref, @date, @lastModified);`,
        )
        .run({
          id: newId,
          displayName,
          unitPrice,
          ref,
          date: Now(),
          lastModified: Now(),
        });

      const newProduct = await Events.create({
        ns: Event.NS_PRODUCTS,
        type: Event.TYPE_NEW_PRODUCT,
        productId: newId,
        metadata: JSON.stringify({}),
        timestamp: Now(),
      });

      return { id: newId, events: [newProduct] };
    }
  }

  async query(q: ?string) {
    const products = await this.loaders.q.load(q);
    return await Promise.all(
      products.map(async product => ({
        product,
        stock: await this.getStock(product.id),
      })),
    );
  }
}
