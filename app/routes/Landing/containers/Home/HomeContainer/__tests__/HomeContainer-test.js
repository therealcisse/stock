import React from 'react';
import { IntlProvider } from 'react-intl';
import renderer from 'react-test-renderer';

import { HomeContainer } from '../HomeContainer';

describe('home container', () => {
  it('should render the snapshot when loading', () => {
    const tree = renderer
      .create(
        <IntlProvider
          defaultLocale={'en'}
          locale={'en'}
          messages={{}}
          formats={{}}
        >
          <HomeContainer
            data={{
              loading: true,
            }}
            actions={{}}
          />
        </IntlProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the snapshot when finished loading', () => {
    const tree = renderer
      .create(
        <IntlProvider
          defaultLocale={'en'}
          locale={'en'}
          messages={{}}
          formats={{}}
        >
          <HomeContainer
            actions={{
              logOut: jest.fn(),
            }}
            data={{
              loading: false,
              currentUser: {
                email: 'email',
                username: 'username',
              },
            }}
          />
        </IntlProvider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
