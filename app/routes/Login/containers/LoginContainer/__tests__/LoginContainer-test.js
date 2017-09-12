import React from 'react';
import { compose } from 'redux';
import configureMockStore from 'redux-mock-store';
import { reduxForm } from 'redux-form/immutable';
import { IntlProvider, injectIntl } from 'react-intl';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';

import { fromJS } from 'immutable';

import { LoginContainer } from '../LoginContainer';

const Decorated = compose(injectIntl, reduxForm({ form: 'testForm' }))(
  LoginContainer,
);

const middlewares = [];
const mockStore = configureMockStore(middlewares);

describe('login container', () => {
  const store = mockStore(
    fromJS({
      form: {
        testForm: {},
      },
    }),
  );

  it('should render the snapshot', () => {
    const tree = renderer
      .create(
        <IntlProvider
          defaultLocale={'en'}
          locale={'en'}
          messages={{}}
          formats={{}}
        >
          <Provider store={store}>
            <Decorated
              actions={{
                login: jest.fn(),
              }}
            />
          </Provider>
        </IntlProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
