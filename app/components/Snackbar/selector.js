import { createSelector } from 'utils/reselect';

const getSnackbar = state => state.get('snackbar').toJS();

export default createSelector([getSnackbar], snackbar => ({ snackbar }));
