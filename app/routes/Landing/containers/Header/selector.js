import { createSelector } from 'utils/reselect';

import activeElement from 'getActiveElement';

function isFocused(elem) {
  return elem === activeElement(document) && (elem.type || elem.href);
}

const appSelector = state => state.get('app');
const isActiveSelector = state => {
  const node = document.getElementById('gSearchInput');
  return node ? isFocused(node) : false;
};
const scrollingSelector = state => state.get('scrolling');
const notificationOpenSelector = state =>
  state.getIn(['notification', 'options']).active;

export default createSelector(
  appSelector,
  isActiveSelector,
  scrollingSelector,
  notificationOpenSelector,
  (app, isActive, scrolling, notificationOpen) => ({
    app,
    searching: isActive,
    scrolling,
    notificationOpen,
  }),
);
