import React from 'react';

import { TransactionStatus } from 'data/types';

import Typography from 'material-ui/Typography';

import style from 'routes/Expense/styles';

import cx from 'classnames';

export default class Report extends React.Component {
  render() {
    const {
      intl,
      expense: { isFullyPaid, paid, total, balanceDue, expense },
    } = this.props;

    if (isFullyPaid) {
      return (
        <div className={cx(style.leftPadding10, style.inlineBlock)}>
          <div>
            <div
              className={cx(
                style.stageAmountLabel,
                style.upperCase,
                style.alignTextRight,
              )}
            >
              Montant
            </div>
            <div
              className={cx(
                style.amount,
                expense.status === TransactionStatus.CANCELLED &&
                  style.cancelled,
              )}
            >
              {intl.formatNumber(total, { format: 'MAD' })} MAD
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={cx(style.leftPadding10, style.inlineBlock)}>
        <div>
          <div
            className={cx(
              style.stageAmountLabel,
              style.upperCase,
              style.alignTextRight,
            )}
          >
            Solde à payé
          </div>
          <div
            className={cx(
              style.amount,
              expense.status === TransactionStatus.CANCELLED && style.cancelled,
            )}
          >
            {intl.formatNumber(balanceDue, { format: 'MAD' })} MAD
          </div>
        </div>
      </div>
    );
  }
}
