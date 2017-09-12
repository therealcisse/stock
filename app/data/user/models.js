export class Users {
  constructor({ connector }) {
    this.connector = connector;
  }

  setPassword(payload, context) {
    return this.connector.setPassword(payload, context);
  }
  changeEmail(payload, context) {
    return this.connector.changeEmail(payload, context);
  }
  updateAccountSettings(payload, context) {
    return this.connector.updateAccountSettings(payload, context);
  }

  get(id) {
    return this.connector.get(id);
  }

  logIn({ username, password }) {
    return this.connector.logIn({ username, password });
  }
}
