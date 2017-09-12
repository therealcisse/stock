import { connectedReduxRedirect } from 'redux-auth-wrapper/history4/redirect';

import { locationHelper } from 'redux/configureStore';

import { routerActions } from 'react-router-redux';

export default connectedReduxRedirect({
  wrapperDisplayName: 'NotAuthenticated',
  authenticatedSelector: state => state.get('user').isEmpty,
  redirectPath: (_, ownProps) =>
    locationHelper.getRedirectQueryParam(ownProps) || '/',
  redirectAction: routerActions.replace,
  allowRedirectBack: false,
});
