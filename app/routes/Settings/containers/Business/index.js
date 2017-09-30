import React from 'react';

import Route from 'react-router/Route';
import Switch from 'react-router/Switch';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_BUSINESS_DETAILS } from 'vars';

import UserIsAuthenticated from 'authWrappers/UserIsAuthenticated';

import BusinessDetailsContainer from './BusinessDetailsContainer';

export default (
  <Route
    path={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_DETAILS}
    component={UserIsAuthenticated(BusinessDetailsContainer)}
  />
);
