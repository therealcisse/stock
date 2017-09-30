import React from 'react';

import * as DataLoader from 'routes/Expense/DataLoader';

import compose from 'redux/lib/compose';

import style from 'routes/Expense/styles';

import { injectIntl } from 'react-intl';

import PageHeader from './PageHeader';

import PageBody from './PageBody';

class Page extends React.Component {
  render() {
    const { data, intl } = this.props;

    return (
      <div className={style.page}>
        <PageHeader intl={intl} data={data} />
        <PageBody data={data} />
      </div>
    );
  }
}

export default compose(injectIntl, DataLoader.expense)(Page);
