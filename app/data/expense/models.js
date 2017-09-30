export class Expenses {
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

  getExpense(id) {
    return this.connector.getExpense(id);
  }

  getExpenses({ cursor, query }) {
    return this.connector.getExpenses({ cursor, query });
  }

  addExpense(payload, context) {
    return this.connector.addExpense(payload, context);
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
}
