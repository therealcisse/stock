import React from 'react';

import * as DataLoader from 'routes/Sale/DataLoader';

import compose from 'redux/lib/compose';

import style from 'routes/Sale/styles';

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
        {data.getSale && data.getSale.isFullyPaid ? (
          <div className={cx(style.t, style.m1_1, style.s5_1, style.t1c_1)}>
            PAYÉ
          </div>
        ) : null}
      </div>
    );
  }
}

export default compose(injectIntl, DataLoader.sale, DataLoader.business)(Page);
