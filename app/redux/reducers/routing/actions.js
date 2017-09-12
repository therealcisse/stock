import { LOCATION_CHANGE } from './constants';

// ------------------------------------
// Actions
// ------------------------------------
export function locationChange(location = { pathname: '/' }) {
  return {
    type: LOCATION_CHANGE,
    payload: location,
  };
}

// ------------------------------------
// Specialized Action Creator
// ------------------------------------
export const updateLocation = ({ dispatch }) => {
  return nextLocation => dispatch(locationChange(nextLocation));
};
