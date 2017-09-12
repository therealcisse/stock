import React from 'react';
import { compose } from 'redux';
import configureMockStore from 'redux-mock-store';
import { reduxForm } from 'redux-form/immutable';
import { IntlProvider, injectIntl } from 'react-intl';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';

import { fromJS } from 'immutable';

import { ChangeEmailForm } from '../ChangeEmailForm';

const client = {};

const user = {
  email: 'email',
};

const Decorated = compose(
  injectIntl,
  reduxForm({
    form: 'testForm',
  }),
)(ChangeEmailForm);

const middlewares = [];
const mockStore = configureMockStore(middlewares);

describe('change email form', () => {
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
            <Decorated user={user} client={client} />
          </Provider>
        </IntlProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
