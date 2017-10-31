import { DB_PATH } from 'vars';

import Database from 'better-sqlite3';

const db = new Database(DB_PATH, {});

export default db;
