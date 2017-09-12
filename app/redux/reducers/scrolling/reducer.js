import { UPDATE_POSITION } from './constants';

import { Record } from 'immutable';

export class ScrollState extends Record({
  lastScrollTop: 0,
  scrollTop: 0,
}) {}

const initialState = new ScrollState();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_POSITION: {
      return state.merge({
        lastScrollTop: state.scrollTop,
        scrollTop: action.scrollTop,
      });
    }
    default:
      return state;
  }
}
