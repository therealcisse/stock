import DataLoader from 'dataloader';

import { Business } from 'data/types';

export default function({ db }) {
  return {
    business: new DataLoader(async function(ids) {
      const object = db
        .prepare(`SELECT * FROM business WHERE key = @key;`)
        .get({ key: ids[0] });

      return ids.map(() => Business.fromDatabase(object));
    }, {}),
  };
}
