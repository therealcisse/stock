import { logOut } from 'redux/reducers/user/actions';
import { appStateChange } from 'redux/reducers/app/actions';
import AppState from 'AppState';
import { INACTIVITY_TIMEOUT } from 'vars';
import debug from 'log';

const log = debug('app:client:appStateChangeObserver');

export default function appStateChangeObserver(store) {
  let timeout;

  function clearTimeout() {
    if (timeout) {
      window.clearTimeout(timeout);
      timeout = null;
    }
  }

  function doLogOut() {
    clearTimeout();
    store.dispatch(logOut(/* manual = */ false));
  }

  function cb() {
    log(`[APP STATE CHANGED]: ${AppState.currentState}`);
    store.dispatch(appStateChange(AppState.currentState));

    clearTimeout();

    // fires when user switches tabs, apps, goes to homescreen, etc.
    if (AppState.currentState === 'background') {
      timeout = window.setTimeout(doLogOut, INACTIVITY_TIMEOUT);
    }
  }

  // subscribe to visibility change events
  AppState.addEventListener('change', cb);
  return {
    remove: () => {
      clearTimeout();
      AppState.removeEventListener('change', cb);
    },
  };
}
