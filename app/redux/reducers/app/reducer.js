import { READY } from './constants';

import { INIT } from 'vars';

import { Record } from 'immutable';

export class AppState extends Record({
  isReady: false,
}) {}

const initialState = new AppState();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case READY:
      return state.merge({
        isReady: true,
      });
    case INIT: {
      return state.merge({});
    }
    default:
      return state;
  }
}
