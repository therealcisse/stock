import { DB_STATUS, APP_STATE_CHANGE } from './constants';

import debounce from 'debounce';

import gql from 'graphql-tag';

// import SUBSCRIPTION from './app.subscription.graphql';

export function dbStatus(status) {
  return (dispatch, getState, { client }) => {
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
      type: DB_STATUS,
      status,
    });
  };
}

export function appStateChange(currentState) {
  return {
    type: APP_STATE_CHANGE,
    currentState,
  };
}
