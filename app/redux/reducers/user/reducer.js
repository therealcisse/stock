import { List } from 'immutable';

import getCurrentUser from 'getCurrentUser';

import { USER_LOGGED_IN, USER_LOGGED_OUT } from './constants';

import { INIT } from 'vars';

import { User } from 'data/types';

const initialState = new User();

export default function userReducer(state = initialState, { type, payload }) {
  if (type === USER_LOGGED_IN) {
    return new User(payload);
  }
  if (type === USER_LOGGED_OUT) {
    return initialState;
  }
  if (type === INIT) {
    return new User(getCurrentUser());
  }
  return state;
}
