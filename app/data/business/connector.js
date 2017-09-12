import DataLoader from 'dataloader';

import { BUSINESS_KEY } from 'vars';

import { Business } from 'data/types';

export class BusinessConnector {
  constructor({ db }) {
    this.business = new DataLoader(async function(ids) {
      const object = db
        .prepare(`SELECT * FROM business WHERE key = @key;`)
        .get({ key: ids[0] });

      return ids.map(() => Business.fromDatabase(object));
    }, {});
  }
  updateBusiness(payload, { Business }) {
    // TODO: save business
    this.business.clear(BUSINESS_KEY);
    return Business.get();
  }
  get() {
    return this.business.load(BUSINESS_KEY);
  }
}
