// @flow

export class Products {
  constructor({ connector }) {
    this.connector = connector;
  }

  get(id) {
    return this.connector.get(id);
  }

  getStock(id: string): Promise<any> {
    return this.connector.getStock(id);
  }

  getAllProducts(query) {
    return this.connector.getAllProducts(query);
  }

  addProduct(id, payload, context) {
    return this.connector.addProduct(id, payload, context);
  }

  newItem(item): Promise<string> {
    return this.connector.newItem(item);
  }
}
