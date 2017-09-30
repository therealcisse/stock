import React from 'react';

import Component from './Snackbar';

import { update } from 'redux/reducers/snackbar/actions';

export function createSnackbarController(store) {
  function getState() {
    return store
      .getState()
      .get('snackbar')
      .toJS();
  }

  return {
    timer: null,

    /**
     * @method notify
     * @param {Object} notification
     */
    show(notification) {
      let { active } = getState();

      // ### Timer
      // We need to reset the timer since this is a new notification.

      clearTimeout(this.timer);

      // ### Action
      // Bind snackbar to the click method of the action.

      if (notification.action) {
        notification.action.click = notification.action.click.bind(this);
      }

      // ### Present
      // Present the new notification.

      if (active) {
        this.slideOut(
          function() {
            this.slideIn(notification);
          }.bind(this),
        );
      } else {
        this.slideIn(notification);
      }
    },

    /**
     * Clears the timeout and removed the notification.
     */
    dismiss() {
      let { active } = getState();

      // ### Timer
      // We need to reset the timer since this is a new notification.

      clearTimeout(this.timer);

      // ### Dismiss
      // Dismiss the notification if its currently in an active state.

      if (active) {
        this.slideOut();
      }
    },

    /**
     * @param {Object} notification
     */
    slideIn(notification) {
      store.dispatch(
        update({
          active: true,
          animation: 'fadeInUp',
          ...notification,
        }),
      );
      if (!notification.persist) {
        this.timer = setTimeout(
          function() {
            this.slideOut();
          }.bind(this),
          notification.duration || (__DEV__ ? 2 * 60 * 1000 : 2500),
        );
      }
    },

    /**
     * @param {Function} done
     */
    slideOut(done) {
      store.dispatch(
        update({
          animation: 'fadeOutDown',
        }),
      );

      // ### Reset State
      // Once the fadeOut animation has completed we reset the snackbar
      // state to its default parameters.

      this.timer = setTimeout(function() {
        store.dispatch(
          update({
            active: false,
            type: null,
            animation: null,
            message: null,
            persist: false,
            action: null,
            duration: null,
          }),
        );
        if (done) {
          done();
        }
      }, 500);
    },

    /**
     * @return {Component}
     */
    render() {
      return <Component dismiss={this.dismiss.bind(this)} />;
    },
  };
}
