import React from 'react';

import CoreLayout from 'layouts/CoreLayout';

import Switch from 'react-router/Switch';

import LandingRoute from 'routes/Landing';
import LoginRoute from 'routes/Login';

import SalesRoute from 'routes/Sales';
import ExpensesRoute from 'routes/Expenses';

import ProductsRoute from 'routes/Products';

import ClientsRoute from 'routes/Clients';
import SuppliersRoute from 'routes/Suppliers';

import SettingsRoute from 'routes/Settings';

import SupplierRoute from 'routes/Supplier';
import ClientRoute from 'routes/Client';

import SaleRoute from 'routes/Sale';
import ExpenseRoute from 'routes/Expense';

const [_0, _1, _2, _3, _4] = SettingsRoute;

export default () => (
  <CoreLayout>
    <Switch>
      {LandingRoute}
      {LoginRoute}
      {SalesRoute}
      {ExpensesRoute}
      {ProductsRoute}
      {ClientsRoute}
      {SuppliersRoute}
      {SupplierRoute}
      {ClientRoute}
      {SaleRoute}
      {ExpenseRoute}
      <Switch>
        {_1}
        {_2}
        {_3}
        {_4}
        {/* {_0} */}
      </Switch>
    </Switch>
  </CoreLayout>
);
