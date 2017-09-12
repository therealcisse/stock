import { UPDATE_SNACKBAR } from './constants';

import { Record } from 'immutable';

export class SnackState extends Record({
  active: false,
  type: null,
  message: null,
  animation: null,
  persist: false,
  closeable: false,
  action: null,
  duration: undefined,
}) {}

export default function reducer(state = new SnackState(), action) {
  switch (action.type) {
    case UPDATE_SNACKBAR:
      return state.merge(action.payload);
    default:
      return state;
  }
}
