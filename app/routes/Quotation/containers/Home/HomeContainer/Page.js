import React from 'react';

import * as DataLoader from 'routes/Quotation/DataLoader';

import { TransactionStatus } from 'data/types';

import compose from 'redux/lib/compose';

import style from 'routes/Quotation/styles';

import cx from 'classnames';

import { injectIntl } from 'react-intl';

import PageHeader from './PageHeader';

import PageBody from './PageBody';

class Page extends React.Component {
  render() {
    const { data, business, intl } = this.props;

    return (
      <div className={style.page}>
        <PageHeader business={business} intl={intl} data={data} />
        <PageBody data={data} />
        {data.getQuotation &&
        data.getQuotation.quotation.status === TransactionStatus.ACCEPTED ? (
          <div className={cx(style.t, style.m1_1, style.s5_1, style.t1c_1)}>
            ACCEPTÉ
          </div>
        ) : null}
      </div>
    );
  }
}

export default compose(injectIntl, DataLoader.quotation, DataLoader.business)(
  Page,
);
