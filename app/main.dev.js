/* eslint global-require: 1, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow } from 'electron';
import MenuBuilder from './menu';

import fs from 'fs';
import path from 'path';

import debug from './utils/log';

import { DBStatus } from './redux/reducers/app/constants';

import { ADMIN_KEY, BUSINESS_KEY, APP_NAME, COUNTRY } from './vars';

const log = debug('app:main');

let mainWindow = null;

if (process.env.NODE_ENV === 'production' || process.env.DEBUG_PROD === 'true') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const {
    default: installExtension,
    REACT_PERF,
    REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS,
  } = require('electron-devtools-installer');

  const APOLLO_DEVELOPER_TOOLS = {
    id: 'jdkknkkbebbapilgoeccciglkfbmbnfm',
    electron: '^1.2.1',
  };

  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;

  try {
    const name = await installExtension(
      [
        REACT_DEVELOPER_TOOLS,
        REACT_PERF,
        APOLLO_DEVELOPER_TOOLS,
        REDUX_DEVTOOLS,
      ],
      forceDownload,
    );

    log(`${name} installed.`);
  } catch (e) {
    log.error(e);
  }
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const setupDB = new Promise(resolve => {
  const dbPath = path.resolve(app.getPath('userData'), 'STOCK.DB');
  fs.access(dbPath, fs.constants.R_OK | fs.constants.W_OK, err => {
    let status = DBStatus.OK;

    if (err) {
      log(`DB does not exist, creating...`);

      status = DBStatus.NEW;

      try {
        const Database = require('better-sqlite3');
        const db = new Database(dbPath, { fileMustExist: false });

        const begin = db.prepare('BEGIN');
        const commit = db.prepare('COMMIT');
        const rollback = db.prepare('ROLLBACK');

        begin.run();
        try {
          // Products table
          db.exec(
            `
            CREATE TABLE products (
              id            TEXT PRIMARY KEY,
              displayName   TEXT NOT NULL,
              unitPrice     INTEGER,

              ref           TEXT,

              date          INTEGER NOT NULL,
              lastModified  INTEGER NOT NULL
            ) WITHOUT ROWID;
            `,
          );

          // Sales

          db.exec(
            `
            CREATE TABLE sales (
              id            TEXT NOT NULL,
              refNo         INTEGER PRIMARY KEY AUTOINCREMENT,
              clientId      INTEGER NOT NULL,

              dateCreated   INTEGER NOT NULL,

              -- state: extensible indicator of whether sale is valid or voided
              state         INTEGER NOT NULL DEFAULT 1,

              date          INTEGER NOT NULL,
              lastModified  INTEGER NOT NULL
            );
            `,
          );

          db.exec(
            `
            CREATE UNIQUE INDEX idx_sales_id ON sales (id);
          `,
          );

          // Expenses

          db.exec(
            `
            CREATE TABLE expenses (
              id            TEXT PRIMARY KEY,
              refNo         TEXT,
              beneficiaryId INTEGER NOT NULL,

              dateCreated   INTEGER NOT NULL,

              -- state: extensible indicator of whether expense is valid or voided
              state         INTEGER NOT NULL DEFAULT 1,

              date          INTEGER NOT NULL,
              lastModified  INTEGER NOT NULL
            ) WITHOUT ROWID;
            `,
          );

          // items

          db.exec(
            `
            CREATE TABLE items (
              id            TEXT PRIMARY KEY,

              -- type { SALE, EXPENSE }
              type          TEXT NOT NULL,

              -- References either sale or expense
              foreignId     INTEGER NOT NULL,

              productId     INTEGER NOT NULL,

              qty           INTEGER NOT NULL,

              -- Prices are multiplied by 100
              unitPrice     INTEGER NOT NULL,

              dateCreated   INTEGER NOT NULL,

              date          INTEGER NOT NULL
            ) WITHOUT ROWID;
            `,
          );

          // payments

          db.exec(
            `
            CREATE TABLE payments (
              id           TEXT PRIMARY KEY,

              -- state: extensible indicator of whether expense is valid or voided
              state         INTEGER NOT NULL DEFAULT 1,

              -- type { SALE, EXPENSE }
              type         TEXT NOT NULL,

              -- References either sale or expense
              foreignId    INTEGER NOT NULL,

              -- Amounts are multiplied by 100
              amount       INTEGER NOT NULL,

              dateCreated  INTEGER NOT NULL,

              date         INTEGER NOT NULL
            ) WITHOUT ROWID;
            `,
          );

          // People table
          db.exec(
            `
            CREATE TABLE people (
              id            TEXT PRIMARY KEY,
              displayName   TEXT NOT NULL,
              email         TEXT,
              tel           TEXT,
              address       TEXT,
              taxId         TEXT,

              type          TEXT NOT NULL,

              date          INTEGER NOT NULL,
              lastModified  INTEGER NOT NULL
            ) WITHOUT ROWID;
            `,
          );

          // Event table
          db.exec(
            `
            CREATE TABLE events (
              id          TEXT PRIMARY KEY,

              -- ns { SALES, EXPENSES, PRODUCTS, CLIENTS, SUPPLIERS }
              ns          TEXT NOT NULL,

              -- type of event
              type        TEXT NOT NULL,

              metadata    TEXT NOT NULL,
              timestamp   INTEGER NOT NULL,

              -- A payment was made on an expense or a sale
              paymentId   INTEGER,

              -- A sale was created, modified or deleted
              saleId      INTEGER,

              -- An expense was created, modified or deleted
              expenseId   INTEGER,

              -- A product was created, modified or deleted
              productId   INTEGER,

              -- A client was created, modified or deleted
              clientId    INTEGER,

              -- A supplier was created, modified or deleted
              supplierId  INTEGER
            ) WITHOUT ROWID;
            `,
          );

          db.exec(
            `
            CREATE INDEX idx_events_timestamp ON events (timestamp);
          `,
          );

          // Business table
          db.exec(
            `
            CREATE TABLE business (
              key           TEXT PRIMARY KEY,
              displayName   TEXT NOT NULL,
              description   TEXT,
              url           TEXT,
              country       TEXT NOT NULL,
              addressLine1  TEXT,
              addressLine2  TEXT,
              city          TEXT,
              stateProvince TEXT,
              postalCode    TEXT,
              phone         TEXT,
              taxId         TEXT,
              date          INTEGER NOT NULL,
              lastModified  INTEGER NOT NULL
            ) WITHOUT ROWID;
            `,
          );

          db.exec(
            `
            INSERT INTO business (key, displayName, country, date, lastModified) VALUES ('${BUSINESS_KEY}', '${APP_NAME}', '${COUNTRY}', strftime('%s','now'), strftime('%s','now'));
            `,
          );

          // users table
          db.exec(
            `
              CREATE TABLE users (
                id                        TEXT PRIMARY KEY,
                password                  TEXT NOT NULL,
                displayName               TEXT NOT NULL,
                username                  VARCHAR NOT NULL,
                changePasswordAtNextLogin BOOLEAN NOT NULL DEFAULT 0,
                date                      INTEGER NOT NULL,
                lastModified              INTEGER NOT NULL
              ) WITHOUT ROWID;
            `,
          );

          // username unique index
          db.exec(
            `
            CREATE UNIQUE INDEX idx_users_username ON users (username);
          `,
          );

          // lastModified index
          db.exec(
            `
            CREATE INDEX idx_users_lastModified ON users (lastModified);
          `,
          );

          // Initial user
          db.exec(
            `
            INSERT INTO users (id, password, displayName, username, changePasswordAtNextLogin, date, lastModified) VALUES (${ADMIN_KEY}, '$2a$10$nWFC.i/7wl0HNabsOikfluI78m2EnTeFtBm1YWxrAu5n6Y5vm3yF.', 'Admin', 'admin', 0, strftime('%s','now'), strftime('%s','now'));
          `,
          );

          commit.run();
        } finally {
          if (db.inTransaction) rollback.run();
        }
      } catch (e) {
        log.error(`DB error:`, e);

        try {
          fs.unlinkSync(dbPath);
        } catch (e) {}

        status = DBStatus.FAILED;
      }
    }

    // TODO: check if admin user and business exist.

    resolve(status);
  });
});

const isSecondInstance = app.makeSingleInstance(
  (commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  },
);

if (isSecondInstance) {
  app.quit();
}

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1281,
    height: 750,
    title: APP_NAME,
  });

  const url = require('url').format({
    protocol: 'file',
    slashes: true,
    pathname: path.resolve(__dirname, 'app.html'),
    hash: '/',
  });

  mainWindow.loadURL(url);

  mainWindow.once('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error(`'mainWindow' is not defined`);
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.webContents.on('did-finish-load', async () => {
    if (!mainWindow) {
      throw new Error(`'mainWindow' is not defined`);
    }

    mainWindow.webContents.send('db-status', {
      status: await setupDB,
    });
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});
