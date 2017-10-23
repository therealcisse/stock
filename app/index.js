import React from 'react';
import T from 'prop-types';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { configureStore, history } from 'redux/configureStore';

import { ApolloProvider } from 'react-apollo';

import MouseTrap from 'mousetrap';

import { Provider } from 'react-redux';

import IntlProvider from 'IntlProvider';

import intlLoader from 'utils/intl-loader';

import { createSelector } from 'utils/reselect';

import { client as apolloClient } from 'apollo';

import { dbStatus, invalidMac, toggleSearch } from 'redux/reducers/app/actions';

import { DBStatus } from 'redux/reducers/app/constants';

// import { scrolling } from 'redux/reducers/scrolling/actions';

import formats from 'intl-formats';

import { updateIntl } from 'redux/reducers/intl/actions';

import { LANG, DEBUG, PATH_LOGIN } from 'vars';

import 'typeface-roboto';

const APP_MOUNT_NODE = document.querySelector('main');
const SNACKBAR_MOUNT_NODE = document.querySelector('#snackbar');

MouseTrap.bind(['command+left', 'ctrl+left'], () => {
  if (history.length) {
    history.goBack();
  }
});

MouseTrap.bind(['command+right', 'ctrl+right'], () => {
  history.goForward();
});

MouseTrap.bind(['command+f', 'ctrl+f'], () => {
  store.dispatch(toggleSearch());
});

const store = configureStore();

let render = function() {
  const Root = require('./containers/Root'); // eslint-disable-line global-require

  // store.dispatch(scrolling());

  // Check database
  require('electron').ipcRenderer.once('db-status', (event, { status }) => {
    store.dispatch(dbStatus(status));
  });

  // Check mac address
  require('electron').ipcRenderer.once('invalid-mac', event => {
    store.dispatch(invalidMac());
  });

  const locale = LANG;

  // Update messages for locale
  const { messages: translations } = intlLoader(locale);
  store.dispatch(
    updateIntl({
      locale,
      messages: translations,
      formats,
    }),
  );

  const intlSelector = createSelector(
    state => ({
      defaultLocale: state.getIn(['intl', 'defaultLocale']),
      locale: state.getIn(['intl', 'locale']),
      messages: state.getIn(['intl', 'messages']),
      formats: state.getIn(['intl', 'formats']),
    }),
    intl => intl,
  );

  class Application extends React.Component {
    static childContextTypes = {
      snackbar: T.shape({
        show: T.func.isRequired,
        dismiss: T.func.isRequired,
      }).isRequired,
    };
    getChildContext() {
      return {
        snackbar: store.snackbar,
      };
    }
    render() {
      const { routerProps } = this.props;
      return (
        <ApolloProvider store={store} client={apolloClient} immutable>
          <IntlProvider intlSelector={intlSelector}>
            <Root {...routerProps} />
          </IntlProvider>
        </ApolloProvider>
      );
    }
  }

  ReactDOM.render(
    <AppContainer>
      <Application routerProps={{ history, store }} />
    </AppContainer>,
    APP_MOUNT_NODE,
    () => {},
  );

  ReactDOM.render(
    <Provider store={store}>
      <IntlProvider intlSelector={intlSelector}>
        {store.snackbar.render()}
      </IntlProvider>
    </Provider>,
    SNACKBAR_MOUNT_NODE,
  );
};

if (__DEV__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render;
    const renderError = error => {
      const RedBox = require('redbox-react').default;

      ReactDOM.render(<RedBox error={error} />, APP_MOUNT_NODE);
    };

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp();
      } catch (error) {
        renderError(error);
      }
    };

    // Setup hot module replacement
    module.hot.accept('./containers/Root', () => {
      // ReactDOM.unmountComponentAtNode(APP_MOUNT_NODE);
      // ReactDOM.unmountComponentAtNode(SNACKBAR_MOUNT_NODE);
      render();
    });
  }
}

if (__DEV__ || DEBUG) {
  // Show all debug messages.
  localStorage.debug = 'app:*';
}

// ========================================================
// Go!
// ========================================================
render();
