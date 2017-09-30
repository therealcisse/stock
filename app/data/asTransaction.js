// @flow

import db from 'data/db';

const begin = db.prepare('BEGIN');
const commit = db.prepare('COMMIT');
const rollback = db.prepare('ROLLBACK');

// Higher order function - returns a function that always runs in a transaction
export default function asTransaction(func: Function) {
  return async function(...args) {
    if (db.inTransaction) {
      return await func(...args);
    }

    begin.run();
    try {
      const retValue = await func(...args);
      commit.run();
      return retValue;
    } finally {
      if (db.inTransaction) rollback.run();
    }
  };
}
