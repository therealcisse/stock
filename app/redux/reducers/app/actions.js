import { DB_STATUS, APP_STATE_CHANGE, TOGGLE_SEARCH } from './constants';

import path from 'path';

import { remote } from 'electron';

import debounce from 'debounce';

import gql from 'graphql-tag';

import * as htmlPdf from 'html-pdf-chrome';

import Queue from 'async/queue';

const pdfOptions = {
  printOptions: {
    printBackground: true,
    paperHeight: 14,
  },
};

const DEFAULT_INVOICE_FILENAME = 'Facture.pdf';

const defaultPath = path.resolve(
  remote.app.getPath('downloads'),
  DEFAULT_INVOICE_FILENAME,
);

const q = Queue(async function({ name, html }, callback) {
  try {
    const url = remote.dialog.showSaveDialog(
      remote.BrowserWindow.getFocusedWindow(),
      {
        defaultPath,
        createDirectory: true,
      },
    );

    if (url) {
      const resp = await htmlPdf.create(html, pdfOptions);
      await resp.toFile(url);
    }

    callback(null, url);
  } catch (e) {
    callback(`Erreur d'impression. Veuillez essayer encore.`);
  }
});

q.error = function(error, task) {};

// assign a callback
q.drain = function() {};

export function print(html) {
  return (dispatch, _, { snackbar }) => {
    q.push({ html }, function(err, url) {
      url &&
        snackbar.show({
          message: err || 'Succès',
          type: err ? 'danger' : undefined,
          duration: 7000,
          action: {
            title: 'AFFICHER',
            click() {
              this.dismiss();
              remote.shell.openItem(path.dirname(url));
            },
          },
        });
    });
  };
}

export function dbStatus(status) {
  return (dispatch, getState, { client }) => {
    dispatch({
      type: DB_STATUS,
      status,
    });
  };
}

export function appStateChange(currentState) {
  return {
    type: APP_STATE_CHANGE,
    currentState,
  };
}

export function toggleSearch() {
  return {
    type: TOGGLE_SEARCH,
  };
}
