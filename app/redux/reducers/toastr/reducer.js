import { guid } from './utils';

import { SHOW_CONFIRM, HIDE_CONFIRM } from './constants';

import { Record } from 'immutable';

export class ToastrState extends Record({ confirm: null }) {}

const initialState = new ToastrState();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_CONFIRM: {
      const { id, payload: { message, options } } = action;
      return state.set('confirm', {
        id: id || guid(),
        show: true,
        message: message,
        options: options || {},
      });
    }
    case HIDE_CONFIRM: {
      return state.set('confirm', null);
    }
    default:
      return state;
  }
}
