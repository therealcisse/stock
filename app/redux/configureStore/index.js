// @flow

import { createStore, applyMiddleware, compose } from 'redux';

import { APP_NAME, DEBUG, INIT } from 'vars';

import pick from 'lodash.pick';

import array from 'redux/middleware/array';
import bufferActions from 'redux/middleware/buffer-actions';

import { createHashHistory } from 'history';
import { routerMiddleware, routerActions } from 'react-router-redux';
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper';

import { client as apolloClient } from 'apollo';

import { createSnackbarController } from 'components/Snackbar';

import thunk from 'redux-thunk';

import rootReducer from 'redux/reducers';

const history = createHashHistory();

const configureStore = (initialState?: any) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middlewares = [
    bufferActions(),
    array,
    thunk.withExtraArgument({
      client: apolloClient,
      history,
      get snackbar() {
        return (
          store.snackbar || (store.snackbar = createSnackbarController(store))
        );
      },
    }),
    routerMiddleware(history),
  ];

  // Redux DevTools Configuration
  const actionCreators = {
    ...routerActions,
  };

  const composeEnhancers =
    (__DEV__ || DEBUG) && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          name: APP_NAME,
          routerActions,
        })
      : compose;

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = [applyMiddleware(...middlewares)];

  const enhancer = composeEnhancers(...enhancers);

  const store = createStore(rootReducer, enhancer);

  // Snackbar
  store.snackbar = createSnackbarController(store);

  // Initialize
  store.dispatch({ type: INIT });

  if (__DEV__) {
    if (module.hot) {
      module.hot.accept('../reducers', () => {
        store.replaceReducer(require('../reducers'));
      });
    }
  }

  return store;
};

export default {
  configureStore,
  history,
  locationHelper: locationHelperBuilder({}),
};
