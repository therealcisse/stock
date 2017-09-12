import { createSelector } from 'utils/reselect';

const getNotification = state => state.get('notification').toJS();
const scrollTopSelector = state => state.getIn(['scrolling', 'scrollTop']);

export default createSelector(
  getNotification,
  scrollTopSelector,
  (notification, scrollTop) => ({ notification, scrollTop }),
);
