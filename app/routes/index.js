import React from 'react';

import CoreLayout from 'layouts/CoreLayout';

import Switch from 'react-router/Switch';

import LandingRoute from 'routes/Landing';
import LoginRoute from 'routes/Login';

import SalesRoute from 'routes/Sales';
import QuotationsRoute from 'routes/Quotations';
import ExpensesRoute from 'routes/Expenses';

import ProductsRoute from 'routes/Products';
import ProductRoute from 'routes/Product';

import ClientsRoute from 'routes/Clients';
import SuppliersRoute from 'routes/Suppliers';

import SettingsRoute from 'routes/Settings';

import SupplierRoute from 'routes/Supplier';
import ClientRoute from 'routes/Client';

import SaleRoute from 'routes/Sale';
import QuotationRoute from 'routes/Quotation';
import ExpenseRoute from 'routes/Expense';

const [_0, _1, _2, _3, _4] = SettingsRoute;

export default () => (
  <CoreLayout>
    <Switch>
      {LandingRoute}
      {LoginRoute}
      {SalesRoute}
      {QuotationsRoute}
      {ExpensesRoute}
      {ProductsRoute}
      {ProductRoute}
      {ClientsRoute}
      {SuppliersRoute}
      {SupplierRoute}
      {ClientRoute}
      {SaleRoute}
      {QuotationRoute}
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
