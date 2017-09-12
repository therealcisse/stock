import React from 'react';

import { Route, Switch } from 'react-router';

import AccountRoute from './containers/Account';
import BusinessRoute from './containers/Business';

const [_0, _1, _2, _3] = AccountRoute;

export default (
  <Route>
    <Switch>
      {_0}
      {_1}
      {_2}
      {_3}
      {BusinessRoute}
    </Switch>
  </Route>
);
