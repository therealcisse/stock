import addEventListener from 'utils/lib/DOM/addEventListener';

import { UPDATE_POSITION } from './constants';

import throttle from 'lodash.throttle';

// ------------------------------------
// Actions
// ------------------------------------
export function scrolling() {
  return dispatch => {
    addEventListener(
      window,
      'scroll',
      throttle(function() {
        const st = window.pageYOffset || document.documentElement.scrollTop; // Credits: 'https://github.com/qeremy/so/blob/master/so.dom.js#L426'
        dispatch(update(st));
      }, 50),
    );
  };
}

function update(scrollTop) {
  return {
    type: UPDATE_POSITION,
    scrollTop,
  };
}
