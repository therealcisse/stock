import React from 'react';

import { Route } from 'react-router';

import {
  PATH_SETTINGS_BASE,
  PATH_SETTINGS_ACCOUNT,
  PATH_SETTINGS_CHANGE_PASSWORD,
  PATH_SETTINGS_CHANGE_EMAIL,
} from 'vars';

import AccountSettingsContainer from './AccountSettingsContainer';
import ChangeEmailContainer from './ChangeEmailContainer';
import ChangePasswordContainer from './ChangePasswordContainer';

import UserIsAuthenticated, {
  ChangePassword,
} from 'authWrappers/UserIsAuthenticated';

export default [
  <Route
    exact
    key={1}
    path={PATH_SETTINGS_BASE}
    component={UserIsAuthenticated(AccountSettingsContainer)}
  />,
  <Route
    key={2}
    path={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_ACCOUNT}
    component={UserIsAuthenticated(AccountSettingsContainer)}
  />,
  <Route
    key={3}
    path={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_CHANGE_EMAIL}
    component={UserIsAuthenticated(ChangeEmailContainer)}
  />,
  <Route
    key={4}
    path={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_CHANGE_PASSWORD}
    component={ChangePassword(ChangePasswordContainer)}
  />,
];
