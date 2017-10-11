import React from 'react';

import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form/immutable';

import compose from 'redux/lib/compose';

import style from 'routes/Sales/styles';

import cx from 'classnames';

class BalanceDue extends React.Component {
  render() {
    const { intl, balanceDue } = this.props;

    return (
      <div
        className={cx(
          style.balanceDueTop,
          style.leftPadding10,
          style.inlineBlock,
        )}
      >
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
          <div className={cx(style.amount2)}>
            {intl.formatNumber(balanceDue, { format: 'MAD' })} MAD
          </div>
        </div>
      </div>
    );
  }
}

const selector = formValueSelector('sale');

const mapPropsToState = state => {
  return {
    balanceDue: selector(state, 'items').reduce(
      (balanceDue, { qty, unitPrice }) => balanceDue + qty * unitPrice,
      0.0,
    ),
  };
};
const BalanceDueWithInfo = connect(mapPropsToState);

export default compose(BalanceDueWithInfo)(BalanceDue);
