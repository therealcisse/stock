export class Suppliers {
  constructor({ connector }) {
    this.connector = connector;
  }
  get(id) {
    return this.connector.get(id);
  }

  addSupplier(id, payload, context) {
    return this.connector.addSupplier(id, payload, context);
  }

  getAllSuppliers(query) {
    return this.connector.getAllSuppliers(query);
  }

  getSupplier(id) {
    return this.connector.getSupplier(id);
  }

  getSupplierExpenses(id, query, context) {
    return this.connector.getSupplierExpenses(id, query, context);
  }

  query(q: ?string) {
    return this.connector.query(q);
  }
}
