import React from 'react';
import T from 'prop-types';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { configureStore, history } from 'redux/configureStore';

import { ApolloProvider } from 'react-apollo';

import IntlProvider from 'IntlProvider';

import intlLoader from 'utils/intl-loader';

import { createSelector } from 'utils/reselect';

import { client as apolloClient } from 'apollo';

import { ready } from 'redux/reducers/app/actions';

import { scrolling } from 'redux/reducers/scrolling/actions';

import formats from 'intl-formats';

import { updateIntl } from 'redux/reducers/intl/actions';

import { LANG, DEBUG, PATH_LOGIN } from 'vars';

const APP_MOUNT_NODE = document.querySelector('main');

const store = configureStore();

let render = function() {
  const Root = require('./containers/Root'); // eslint-disable-line global-require

  store.dispatch(scrolling());

  // Check database
  require('electron').ipcRenderer.on('ready', (event, { ok }) => {
    store.dispatch(ready());
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
      render();
    });
  }
}

if (__DEV__ || DEBUG) {
  // Show all debug messages.
  localStorage.debug = DEBUG || 'app:*';
}

// ========================================================
// Go!
// ========================================================
render();
