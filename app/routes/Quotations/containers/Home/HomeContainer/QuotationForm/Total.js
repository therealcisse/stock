import React from 'react';

import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form/immutable';

import compose from 'redux/lib/compose';

import style from 'routes/Quotations/styles';

import cx from 'classnames';

class Total extends React.Component {
  render() {
    const { intl, total } = this.props;

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
            Total
          </div>
          <div className={cx(style.amount2)}>
            {intl.formatNumber(total, { format: 'MAD' })} MAD
          </div>
        </div>
      </div>
    );
  }
}

const selector = formValueSelector('quotation');

const mapPropsToState = state => {
  return {
    total: selector(state, 'items').reduce(
      (total, { qty, unitPrice }) => total + qty * unitPrice,
      0.0,
    ),
  };
};
const BalanceDueWithInfo = connect(mapPropsToState);

export default compose(BalanceDueWithInfo)(Total);
