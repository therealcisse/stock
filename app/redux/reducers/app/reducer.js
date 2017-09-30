import { DB_STATUS, DBStatus } from './constants';

import { INIT } from 'vars';

import { Record } from 'immutable';

export class AppState extends Record({
  dbStatus: DBStatus.PENDING,
}) {}

const initialState = new AppState();

export default function reducer(state = initialState, action) {
  switch (action.type) {
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
