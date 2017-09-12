import path from 'path';

import Database from 'better-sqlite3';

const app = require('electron').remote.app;
const dbPath = path.resolve(app.getPath('userData'), 'STOCK.DB');

const db = new Database(dbPath, { fileMustExist: true });

db.defaultSafeIntegers(true);

export default db;
