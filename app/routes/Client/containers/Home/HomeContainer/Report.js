import React from 'react';

import Typography from 'material-ui/Typography';

import style from 'routes/Client/styles';

export default class Report extends React.Component {
  render() {
    const { intl, totalPaid, balanceDue } = this.props;
    return (
      <div className={style.stageRoot} style={{ marginRight: 50 }}>
        <div className={style.stageRootInner}>
          <div className={style.stageInsightPaid}>
            <div className={style.stageAmountText}>
              {intl.formatNumber(totalPaid, { format: 'MAD' })}
            </div>
            <div className={style.stageAmountLabel}>
              <Typography type="caption">ENCAISSEMENTS</Typography>
            </div>
          </div>
        </div>
        <div className={style.stageRootInner}>
          <div className={style.stageInsightOverdue}>
            <div className={style.stageAmountText}>
              {intl.formatNumber(balanceDue, { format: 'MAD' })}
            </div>
            <div className={style.stageAmountLabel}>
              <Typography type="caption">EN COURS</Typography>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
