import React from 'react';

import Route from 'react-router/Route';

import Home from './containers/Home';

import UserIsAuthenticated from 'authWrappers/UserIsAuthenticated';

export default <Route exact path="/" component={UserIsAuthenticated(Home)} />;
