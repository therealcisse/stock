import { ACTION, SET_SORT_KEY, SET_SORT_DIRECTION } from './constants';

function dispatchSortAction(category, action) {
  return {
    type: `${ACTION}/${category}`,
    payload: action,
  };
}

export const sortKey = category => key =>
  dispatchSortAction(category, {
    type: SET_SORT_KEY,
    key,
  });

export const sortDirection = category => direction =>
  dispatchSortAction(category, {
    type: SET_SORT_DIRECTION,
    direction,
  });

export const sort = category => (key, direction) => [
  sortKey(category)(key),
  sortDirection(category)(direction),
];
