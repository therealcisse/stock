import { REMOVE_NOTIFICATION, UPDATE_NOTIFICATION } from './constants';

// ------------------------------------
// Actions
// ------------------------------------
export function post(id, options = {}) {
  let timer = null;
  return dispatch => {
    function show(options) {
      // ### Timer
      // We need to reset the timer since this is a new notification.

      clearTimeout(timer);

      // ### Present
      // Present the new notification.

      slideIn(options);
    }

    function slideIn(options) {
      dispatch(
        update(id, {
          active: true,
          animation: 'fadeInDown',
          ...options,
        }),
      );
      if (!options.persist) {
        timer = setTimeout(function() {
          slideOut();
        }, options.duration || 5000);
      }
    }

    function slideOut(done) {
      dispatch(
        update(id, {
          animation: 'fadeOutUp',
        }),
      );

      // ### Reset State
      // Once the fadeOut animation has completed we reset the notification
      // state to its default parameters.

      timer = setTimeout(function() {
        dispatch(remove());
        if (done) {
          done();
        }
      }, 500);
    }

    show(options);
  };
}

export function update(id, options = {}) {
  return {
    type: UPDATE_NOTIFICATION,
    id,
    options,
  };
}

export function remove(id) {
  return {
    type: REMOVE_NOTIFICATION,
    id,
  };
}
