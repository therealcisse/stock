import React from 'react';

import * as DataLoader from 'routes/Sales/DataLoader';

import compose from 'redux/lib/compose';

import style from 'routes/Sales/styles';

import cx from 'classnames';

import { injectIntl } from 'react-intl';

const EMPTY = {
  sales: { total: 0, openCount: 0 },
  payments: { total: 0, paidCount: 0 },
};

class SalesReport extends React.Component {
  render() {
    const { intl, data } = this.props;
    const { loading, error, getSalesReport: n = EMPTY } = data;
    return (
      <div className={style.salesReport}>
        <div className={style.moneyBar}>
          <div className={cx(style.tableRow, style.unpaid)}>
            <div className={style.tableCell}>
              <div className={style.bucket}>
                <div className={style.reportHeader}>
                  Factures au cours des 365 derniers jours
                </div>
                <div className={style.table}>
                  <div className={style.tableRow}>
                    <div className={style.tableCell}>
                      <div className={style.box}>
                        <div className={style.subBox}>
                          <span className={style.amount}>
                            {intl.formatNumber(n.sales.total, {
                              format: 'MAD',
                            })}{' '}
                            MAD
                          </span>
                          <div>
                            <span>&nbsp;</span>
                            <span>{n.sales.openCount} en cours</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={cx(style.tableRow, style.paid)}>
              <div className={style.tableCell}>
                <div className={style.bucket}>
                  <div className={style.reportHeader}>Paiements effectués</div>
                  <div className={style.table}>
                    <div className={style.tableRow}>
                      <div className={style.tableCell}>
                        <div className={style.box}>
                          <div className={style.subBox}>
                            <span className={style.amount}>
                              {intl.formatNumber(n.payments.total, {
                                format: 'MAD',
                              })}{' '}
                              MAD
                            </span>
                            <div>
                              <span>&nbsp;</span>
                              <span>
                                {n.payments.paidCount} Paiements au cours des 30
                                derniers jours
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(injectIntl, DataLoader.salesReport)(SalesReport);
