export class Clients {
  constructor({ connector }) {
    this.connector = connector;
  }
  get(id) {
    return this.connector.get(id);
  }

  addClient(id, payload, context) {
    return this.connector.addClient(id, payload, context);
  }

  getAllClients(query) {
    return this.connector.getAllClients(query);
  }

  getClient(id) {
    return this.connector.getClient(id);
  }

  getClientSales(id, query, context) {
    return this.connector.getClientSales(id, query, context);
  }

  getClientExpense(id, query, context) {
    return this.connector.getClientExpense(id, query, context);
  }

  query(q: ?string) {
    return this.connector.query(q);
  }
}
