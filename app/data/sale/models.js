export class Sales {
  constructor({ connector }) {
    this.connector = connector;
  }

  get(id) {
    return this.connector.get(id);
  }

  getPayment(id) {
    return this.connector.getPayment(id);
  }

  getPayments(id) {
    return this.connector.getPayments(id);
  }

  getItems(id) {
    return this.connector.getItems(id);
  }

  getSale(id) {
    return this.connector.getSale(id);
  }

  getResult(args, context) {
    return this.connector.getResult(args, context);
  }

  getSalesReport() {
    return this.connector.getSalesReport();
  }

  getSales({ cursor, query }) {
    return this.connector.getSales({ cursor, query });
  }

  addSale(payload, context) {
    return this.connector.addSale(payload, context);
  }

  void(id, context) {
    return this.connector.void(id, context);
  }

  pay(id, payload, context) {
    return this.connector.pay(id, payload, context);
  }

  delPay(id, context) {
    return this.connector.delPay(id, context);
  }

  getNextRefNo() {
    return this.connector.getNextRefNo();
  }

  query(q: ?string) {
    return this.connector.query(q);
  }
}
