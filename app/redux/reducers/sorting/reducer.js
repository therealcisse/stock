import {
  SET_SORT_KEY,
  SET_SORT_DIRECTION,
  SORT_DIRECTION_DESC,
} from './constants';

import { Record } from 'immutable';

export class SortConfig extends Record({
  key: undefined,
  direction: SORT_DIRECTION_DESC,
}) {}

export const initialState = new SortConfig();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_SORT_KEY: {
      return state.merge({
        key: action.key,
      });
    }
    case SET_SORT_DIRECTION: {
      return state.merge({
        direction: action.direction,
      });
    }
    default:
      return state;
  }
}
