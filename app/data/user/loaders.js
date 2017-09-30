import DataLoader from 'dataloader';

import { User } from 'data/types';

export default function({ db }) {
  return {
    ids: new DataLoader(async function(ids) {
      const objects = db
        .prepare(
          `SELECT * FROM users WHERE id IN (${ids.map(() => '?').join(', ')});`,
        )
        .all(ids)
        .map(User.fromDatabase);

      return ids.map(id => {
        const index = objects.findIndex(object => object.id === id);
        return index !== -1 ? objects[index] : new Error(`User ${id} not found`);
      });
    }, {}),
  };
}
