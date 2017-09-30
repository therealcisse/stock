import DataLoader from 'dataloader';

import { Event } from 'data/types';

export default function({ db }) {
  return {
    ids: new DataLoader(async function(ids) {
      const objects = db
        .prepare(
          `SELECT * FROM events WHERE id IN (${ids.map(() => '?').join(', ')});`,
        )
        .all(ids)
        .map(Event.fromDatabase);

      return ids.map(id => {
        const index = objects.findIndex(object => object.id === id);
        return index !== -1 ? objects[index] : new Error(`Event ${id} not found`);
      });
    }, {}),
  };
}

