import React from 'react';

import Typography from 'material-ui/Typography';

import style from 'routes/Sale/styles';

import cx from 'classnames';

export default class Report extends React.Component {
  render() {
    const {
      intl,
      sale: { isFullyPaid, paid, total, balanceDue },
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
            <div className={style.amount}>
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
          <div className={style.amount}>
            {intl.formatNumber(balanceDue, { format: 'MAD' })} MAD
          </div>
        </div>
      </div>
    );
  }
}
