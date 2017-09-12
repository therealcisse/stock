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

import { BUSINESS_KEY, APP_NAME, COUNTRY } from './vars';

const log = debug('app:main');

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
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
    REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS,
  } = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS];

  return Promise.all(
    extensions.map(plugin => installExtension(plugin, forceDownload)),
  ).catch(log.error);
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
    let ok = true;

    if (err) {
      try {
        const Database = require('better-sqlite3');
        const db = new Database(dbPath, { fileMustExist: false });

        const begin = db.prepare('BEGIN');
        const commit = db.prepare('COMMIT');
        const rollback = db.prepare('ROLLBACK');

        begin.run();
        try {
          // Event table
          db.exec(
            `
            CREATE TABLE events
            (
              id            INTEGER PRIMARY KEY AUTOINCREMENT,
              userId        INTEGER NOT NULL,
              ns            TEXT NOT NULL,
              type          TEXT NOT NULL,
              metadata      TEXT NOT NULL,
              timestamp     INTEGER NOT NULL
            );
            `,
          );

          // Business table
          db.exec(
            `
            CREATE TABLE business
            (
              key           TEXT NOT NULL,
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
            );
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
              CREATE TABLE users
              (
                id                        INTEGER PRIMARY KEY AUTOINCREMENT,
                password                  TEXT NOT NULL,
                displayName               TEXT NOT NULL,
                username                  VARCHAR NOT NULL,
                changePasswordAtNextLogin BOOLEAN NOT NULL DEFAULT 0,
                date                      INTEGER NOT NULL,
                lastModified              INTEGER NOT NULL
              );
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
            INSERT INTO users (password, displayName, username, changePasswordAtNextLogin, date, lastModified) VALUES ('$2a$10$nWFC.i/7wl0HNabsOikfluI78m2EnTeFtBm1YWxrAu5n6Y5vm3yF.', 'Admin', 'admin', 0, strftime('%s','now'), strftime('%s','now'));
          `,
          );

          commit.run();
        } finally {
          if (db.inTransaction) rollback.run();
        }
      } catch (e) {
        fs.unlinkSync(dbPath);
        ok = false;
      }
    }

    // TODO: check if admin user and business exist.

    resolve(ok);
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
  if (process.env.NODE_ENV === 'development') {
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

    mainWindow.webContents.send('ready', { ok: await setupDB });
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});
