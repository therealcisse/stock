import React from 'react';

import { PATH_QUOTATIONS } from 'vars';

import Route from 'react-router/Route';

import Home from './containers/Home';

import UserIsAuthenticated from 'authWrappers/UserIsAuthenticated';

export default (
  <Route path={PATH_QUOTATIONS} component={UserIsAuthenticated(Home)} />
);
