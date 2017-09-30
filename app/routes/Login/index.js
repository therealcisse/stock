import React from 'react';

import { PATH_LOGIN } from 'vars';

import Route from 'react-router/Route';

import Login from './containers/LoginContainer';

import NotAuthenticated from 'authWrappers/NotAuthenticated';

export default <Route path={PATH_LOGIN} component={NotAuthenticated(Login)} />;
