import { SHOW_CONFIRM, HIDE_CONFIRM } from './constants';

export const showConfirm = payload => ({
  type: SHOW_CONFIRM,
  payload,
});

export const hideConfirm = () => ({ type: HIDE_CONFIRM });
