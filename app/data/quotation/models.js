export class Quotations {
  constructor({ connector }) {
    this.connector = connector;
  }

  get(id) {
    return this.connector.get(id);
  }

  getItems(id) {
    return this.connector.getItems(id);
  }

  getQuotation(id) {
    return this.connector.getQuotation(id);
  }

  getQuotations({ cursor, query }) {
    return this.connector.getQuotations({ cursor, query });
  }

  addQuotation(payload, context) {
    return this.connector.addQuotation(payload, context);
  }

  void(id, context) {
    return this.connector.void(id, context);
  }

  accept(id, context) {
    return this.connector.accept(id, context);
  }

  getNextRefNo() {
    return this.connector.getNextRefNo();
  }

  query(q: ?string) {
    return this.connector.query(q);
  }
}
