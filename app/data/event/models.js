import {} from 'data/constants';

export class Events {
  constructor({ user, connector }) {
    this.user = user;
    this.connector = connector;
  }

  get(id, cached = true) {
    return this.connector.get(id, cached);
  }

  getTimeline({ cursor, query }) {
    return this.connector.getTimeline({ cursor, query, user: this.user });
  }
}
