import React from 'react';

import Typography from 'material-ui/Typography';

import style from 'routes/Product/styles';

import cx from 'classnames';

export default class Report extends React.Component {
  render() {
    const { intl, stock } = this.props;
    return (
      <div className={style.stageRoot}>
        <div className={style.stageRootInner}>
          <div
            className={cx(
              style.stageInsightPaid,
              stock > 0 || style.stageInsightPaidBad,
            )}
          >
            <div className={style.stageAmountText}>{Math.abs(stock)}</div>
            <div className={style.stageAmountLabel}>
              <Typography type="caption"># STOCK</Typography>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
