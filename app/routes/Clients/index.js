import React from 'react';

import { PATH_CLIENTS } from 'vars';

import Route from 'react-router/Route';

import Home from './containers/Home';

import UserIsAuthenticated from 'authWrappers/UserIsAuthenticated';

export default (
  <Route path={PATH_CLIENTS} component={UserIsAuthenticated(Home)} />
);
