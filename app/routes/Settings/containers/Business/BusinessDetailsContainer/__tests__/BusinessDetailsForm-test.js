import React from 'react';
import { compose } from 'redux';
import configureMockStore from 'redux-mock-store';
import { reduxForm } from 'redux-form/immutable';
import { IntlProvider, injectIntl } from 'react-intl';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';

import { fromJS } from 'immutable';

import { BusinessDetailsForm } from '../BusinessDetailsForm';

const client = {};

const Decorated = compose(injectIntl, reduxForm({ form: 'testForm' }))(
  BusinessDetailsForm,
);

const middlewares = [];
const mockStore = configureMockStore(middlewares);

describe('business details form', () => {
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
              user={{
                id: 'id',
              }}
              client={client}
              initialValues={{}}
            />
          </Provider>
        </IntlProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
