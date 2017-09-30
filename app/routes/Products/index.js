import React from 'react';

import { PATH_PRODUCTS } from 'vars';

import Route from 'react-router/Route';

import Home from './containers/Home';

import UserIsAuthenticated from 'authWrappers/UserIsAuthenticated';

export default (
  <Route path={PATH_PRODUCTS} component={UserIsAuthenticated(Home)} />
);
