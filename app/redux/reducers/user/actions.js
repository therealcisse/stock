import { USER_LOGGED_IN, USER_LOGGED_OUT } from './constants';

import { DBStatus } from 'redux/reducers/app/constants';

import invariant from 'invariant';

import debug from 'log';

import addSamples from 'data/addSamples';

import { CURRENT_USER_COOKIE_NAME } from 'vars';

import LOG_IN_MUTATION from './logIn.mutation.graphql';

const log = debug('app:client:auth');

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

      dispatch({
        type: USER_LOGGED_IN,
        payload: user,
      });

      // Add samples if dbStatus === DBStatus.NEW
      if (getState().getIn(['app', 'dbStatus']) === DBStatus.NEW) {
        try {
          await addSamples();
          log('Import success.');
        } catch (e) {
          log.error('Import failure:', e);
        }
      }
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
