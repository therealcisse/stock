import { createSelector } from 'utils/reselect';

const userSelector = state => state.get('user');

export default createSelector(userSelector, user => ({ user }));
