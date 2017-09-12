import React from 'react';
import { compose } from 'redux';
import configureMockStore from 'redux-mock-store';
import { reduxForm } from 'redux-form/immutable';
import { IntlProvider, injectIntl } from 'react-intl';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';

import { fromJS } from 'immutable';

import { AccountSettingsForm } from '../AccountSettingsForm';

const client = {};

const Decorated = compose(
  injectIntl,
  reduxForm({
    form: 'testForm',
    initialValues: {
      displayName: 'displayName',
      email: 'email',
    },
  }),
)(AccountSettingsForm);

const middlewares = [];
const mockStore = configureMockStore(middlewares);

describe('account settings form', () => {
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
            <Decorated client={client} />
          </Provider>
        </IntlProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
