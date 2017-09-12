import db from 'data/db';

const begin = db.prepare('BEGIN');
const commit = db.prepare('COMMIT');
const rollback = db.prepare('ROLLBACK');

// Higher order function - returns a function that always runs in a transaction
export default function asTransaction(func) {
  return function(...args) {
    begin.run();
    try {
      func(...args);
      commit.run();
    } finally {
      if (db.inTransaction) rollback.run();
    }
  };
}
