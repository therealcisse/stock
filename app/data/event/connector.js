import DataLoader from 'dataloader';

// import { EventType, DocType } from 'data/types';

import { DOC_FOREIGN_KEY } from 'data/constants';

const LIMIT_PER_PAGE = 15;

export class EventConnector {
  constructor({ db }) {
    this.db = db;
    this.loader = new DataLoader(this.fetch.bind(this), {});
  }
  async fetch(ids) {
    const events = await Promise.resolve([]);

    return ids.map(id => {
      const index = events.findIndex(event => event.id === id);
      return index !== -1 ? events[index] : new Error(`Event ${id} not found`);
    });
  }

  get(id, cached) {
    if (cached === false) {
      return null;
    }
    return this.loader.load(id);
  }

  getTimeline({ cursor, query, user }) {
    return [];
  }
}
