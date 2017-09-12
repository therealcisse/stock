import { UPDATE_SNACKBAR } from './constants';

export function update(payload) {
  return {
    type: UPDATE_SNACKBAR,
    payload,
  };
}
