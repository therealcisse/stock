import { createSelector } from 'utils/reselect';

const getSearching = state => state.getIn(['app', 'searching']);

export default createSelector([getSearching], searching => ({ searching }));
