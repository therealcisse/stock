import Immutable from 'immutable';
import { LOCATION_CHANGE } from './constants';

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = null;
export default function locationReducer(state = initialState, action) {
  return action.type === LOCATION_CHANGE
    ? Immutable.fromJS(action.payload)
    : state;
}
