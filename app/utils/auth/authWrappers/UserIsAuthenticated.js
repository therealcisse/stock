import { compose } from 'redux';

import {
  PATH_LOGIN,
  PATH_SETTINGS_BASE,
  PATH_SETTINGS_CHANGE_PASSWORD,
} from 'vars';

import { connectedReduxRedirect } from 'redux-auth-wrapper/history4/redirect';

import { routerActions } from 'react-router-redux';

import { locationHelper } from 'redux/configureStore';

export const UserIsAuthenticated = connectedReduxRedirect({
  wrapperDisplayName: 'UserIsAuthenticated',
  authenticatedSelector: state => !state.get('user').isEmpty,
  redirectPath: (_, ownProps) => {
    const redirect = locationHelper.getRedirectQueryParam(ownProps);
    return (
      PATH_LOGIN + (redirect ? '?redirect=' + encodeURIComponent(redirect) : '')
    );
  },
  redirectAction: routerActions.replace,
  allowRedirectBack: false,
});

export const UserDidNotChangePassword = connectedReduxRedirect({
  wrapperDisplayName: 'UserDidNotChangePassword',
  authenticatedSelector: state =>
    !state.get('user').getIn(['changePasswordAtNextLogin']),
  redirectPath: PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_CHANGE_PASSWORD,
  redirectAction: routerActions.push,
});

export default compose(UserIsAuthenticated, UserDidNotChangePassword);

export const ChangePassword = UserIsAuthenticated;
