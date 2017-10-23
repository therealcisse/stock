import { DB_STATUS, DBStatus, TOGGLE_SEARCH, INVALID_MAC } from './constants';

import { INIT } from 'vars';

import { Record } from 'immutable';

export class AppState extends Record({
  dbStatus: DBStatus.PENDING,
  searching: false,
  unAuthorized: true,
}) {}

const initialState = new AppState();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INVALID_MAC:
      return state.merge({
        unAuthorized: true,
      });
    case TOGGLE_SEARCH:
      return state.merge({
        searching: !state.searching,
      });
    case DB_STATUS:
      return state.merge({
        dbStatus: action.status,
      });
    case INIT: {
      return state.merge({});
    }
    default:
      return state;
  }
}
