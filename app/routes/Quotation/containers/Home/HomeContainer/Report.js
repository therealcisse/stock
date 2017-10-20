import React from 'react';

import Typography from 'material-ui/Typography';

import { TransactionStatus } from 'data/types';

import style from 'routes/Quotation/styles';

import cx from 'classnames';

export default class Report extends React.Component {
  render() {
    const { intl, quotation: { total, quotation } } = this.props;

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
            Total
          </div>
          <div
            className={cx(
              style.amount,
              quotation.status === TransactionStatus.CANCELLED &&
                style.cancelled,
              quotation.status === TransactionStatus.ACCEPTED && style.accepted,
            )}
          >
            {intl.formatNumber(total, { format: 'MAD' })} MAD
          </div>
        </div>
      </div>
    );
  }
}
