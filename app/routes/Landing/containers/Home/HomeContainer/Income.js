import React from 'react';

import DataLoader from 'routes/Sales/DataLoader';

import compose from 'redux/lib/compose';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import { intlShape, injectIntl } from 'react-intl';

import messages from 'routes/Landing/messages';

const EMPTY = {
  sales: { total: 0, openCount: 0 },
  payments: { total: 0, paidCount: 0 },
};

class Income extends React.Component {
  render() {
    const { intl, data } = this.props;

    const {
      sales: { total: openAmount, openCount },
      payments: { total: closedAmount, paidCount: closedCount },
    } =
      data.getSalesReport || EMPTY;

    return (
      <div
        className={cx(style.module, style.income, data.loading && style.loading)}
      >
        <div className={style.header}>
          <div className={cx(style.title, style.inlineBlock)}>
            {intl.formatMessage(messages['IncomeTitle'])}
          </div>
          <div className={cx(style.floatRight, style.fancyText)}>
            {intl.formatMessage(messages['LastXDays'], { days: 365 })}
          </div>
          <div className={style.clear} />
        </div>

        <div className={style.moduleContent}>
          <div className={cx(style.subContainer, style.incomeCategories)}>
            <div className={style.chartContainer}>
              <div className={style.chart}>
                <div className={style.barsContainer}>
                  <div className={cx(style.open, style.invoiceBar)}>
                    <a>
                      <div className={style.insightTooltipDiv}>
                        <div
                          className={cx(
                            style.insightTooltipInnerDiv,
                            style.openInvoicesTooltipDiv,
                          )}
                        />
                      </div>
                    </a>

                    <div className={cx(style.moneySection, style.floatLeft)}>
                      <div className={style.fancyMoney}>
                        {intl.formatNumber(openAmount, { format: 'MAD' })} MAD
                      </div>
                      <div className={cx(style.fancyText, style.upperCase)}>
                        {intl.formatMessage(messages['x_open_invoices'], {
                          invoices: openCount,
                        })}
                      </div>
                    </div>
                  </div>

                  <div className={cx(style.paid, style.invoiceBar)}>
                    <a>
                      <div className={style.insightTooltipDiv}>
                        <div className={style.insightTooltipInnerDiv} />
                      </div>
                    </a>

                    <div className={cx(style.moneySection, style.floatLeft)}>
                      <div className={style.fancyMoney}>
                        {intl.formatNumber(closedAmount, { format: 'MAD' })} MAD
                      </div>
                      <div className={cx(style.fancyText, style.upperCase)}>
                        {intl.formatMessage(messages['paid_last_x_days'], {
                          invoices: closedCount,
                          days: 30,
                        })}
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

export default compose(injectIntl, DataLoader.salesReport)(Income);
