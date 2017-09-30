import { BUSINESS_KEY } from 'vars';

import Loaders from './loaders';

export class BusinessConnector {
  constructor({ db }) {
    this.loaders = Loaders({ db });
  }
  updateBusiness(payload, { Business }) {
    // TODO: save business
    this.loaders.business.clear(BUSINESS_KEY);
    return Business.get();
  }
  get() {
    return this.loaders.business.load(BUSINESS_KEY);
  }
}
