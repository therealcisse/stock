import { UPDATE_USER_BUSINESS } from 'data/constants';

import { getRefNo } from 'data/utils';

export class Business {
  constructor({ connector, user }) {
    this.connector = connector;
    this.user = user;
  }
  updateBusiness(payload, context) {
    return this.connector.updateBusiness(payload, business);
  }
  get() {
    return this.connector.get();
  }

  async getLastRefNo(now) {
    return { value: await getRefNo(now) };
  }
}
