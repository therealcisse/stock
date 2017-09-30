export class Business {
  constructor({ connector }) {
    this.connector = connector;
  }
  updateBusiness(payload, context) {
    return this.connector.updateBusiness(payload, context);
  }
  get() {
    return this.connector.get();
  }
}
