import { APP_STATE_CHANGE } from 'redux/reducers/app/constants';

import AppState from 'AppState';

export default function bufferActions() {
  let queue = [];
  let active = AppState.currentState === AppState.ACTIVE;

  return store => next => action => {
    if (action.type === APP_STATE_CHANGE) {
      if (action.currentState === AppState.BACKGROUND) {
        active = false;
        return next(action);
      } else {
        active = true;
        next([action, ...queue]);
        queue = [];
      }
    } else if (active) {
      return next(action);
    } else {
      queue.push(action);
    }
  };
}
