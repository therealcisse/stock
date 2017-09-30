export class Events {
  constructor({ connector }) {
    this.connector = connector;
  }

  get(idOrIds) {
    return this.connector.get(idOrIds);
  }

  getTimeline({ cursor, query }, context) {
    return this.connector.getTimeline({ cursor, query }, context);
  }

  create(meta) {
    return this.connector.create(meta);
  }
}
