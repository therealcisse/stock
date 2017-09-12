import { INIT } from 'vars';

import { USER_LOGGED_OUT, USER_LOGGED_IN } from 'redux/reducers/user/constants';

import { LOCATION_CHANGE } from 'react-router-redux';

import { UPDATE_NOTIFICATION, REMOVE_NOTIFICATION } from './constants';

import { Record } from 'immutable';

export class NotificationState extends Record({
  id: null,
  options: {
    active: false,
    animation: null,
    persist: false,
    duration: null,
  },
}) {}

const initialState = new NotificationState();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_NOTIFICATION: {
      if (typeof action.id === 'undefined' || action.id === state.id) {
        return state.update('options', options => ({
          ...options,
          ...action.options,
        }));
      } else {
        // New notification
        return state.merge({
          id: action.id,
          options: action.options,
        });
      }
      return state;
    }
    case REMOVE_NOTIFICATION: {
      if (typeof action.id === 'undefined' || action.id === state.id) {
        // Clear all but required.
        return maybeRequiredNotification(state, action);
      }
      return state;
    }
    case USER_LOGGED_IN:
    case LOCATION_CHANGE:
    case INIT: {
      return maybeRequiredNotification(state);
    }
    case USER_LOGGED_OUT:
      return initialState;
    default:
      return state;
  }
}

function maybeRequiredNotification(state, action = {}) {
  return state;
}
