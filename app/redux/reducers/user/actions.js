import { USER_LOGGED_IN, USER_LOGGED_OUT } from './constants';

import debounce from 'debounce';

import invariant from 'invariant';

import debug from 'log';

import { CURRENT_USER_COOKIE_NAME } from 'vars';

import LOG_IN_MUTATION from './logIn.mutation.graphql';

const log = debug('app:client:auth');

// import SUBSCRIPTION from 'redux/reducers/app/app.subscription.graphql';

function logIn(username, password) {
  return async (dispatch, getState, { client }) => {
    const { data: { logIn: { user, error } } } = await client.mutate({
      mutation: LOG_IN_MUTATION,
      variables: {
        username,
        password,
      },
    });

    if (error) {
      log.error(error);
      throw new Error();
    } else {
      invariant(user, '`user` must be defined at this point.');

      try {
        // Clear cache is required!
      } finally {
      }

      // const obs = client.subscribe({
      //   query: SUBSCRIPTION,
      //   variables: {},
      // });
      //
      // obs.subscribe({
      //   next: debounce(function({ onEvent: { event } }) {
      //     // Refresh relevants queries
      //     try {
      //       const QUERIES = [];
      //
      //       QUERIES.forEach(async q => {
      //         client.queryManager.refetchQueryByName(q);
      //       });
      //     } catch (e) {}
      //   }, 1000),
      //   error(error) {},
      // });

      dispatch({
        type: USER_LOGGED_IN,
        payload: user,
      });
    }
  };
}

function logOut(manual = true) {
  return async dispatch => {
    sessionStorage.removeItem(CURRENT_USER_COOKIE_NAME);

    dispatch({ type: USER_LOGGED_OUT, manual });
    // manual && (await client.resetStore());
  };
}

export { logIn, logOut };
