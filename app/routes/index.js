import React from 'react';

import CoreLayout from 'layouts/CoreLayout';

import { Switch } from 'react-router';

import LandingRoute from 'routes/Landing';
import LoginRoute from 'routes/Login';
import SettingsRoute from 'routes/Settings';

export default () => (
  <CoreLayout>
    <Switch>
      {LandingRoute}
      {LoginRoute}
      {SettingsRoute}
    </Switch>
  </CoreLayout>
);
