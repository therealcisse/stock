// @flow

import React from 'react';
import T from 'prop-types';

import Store from 'utils/Store';

import Typography from 'material-ui/Typography';

import DataLoader from 'routes/Sale/DataLoader';

import compose from 'redux/lib/compose';

import { withStyles } from 'material-ui/styles';

import { injectIntl } from 'react-intl';

import moment from 'moment';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import PaperSheet from './PaperSheet';

import Income from './Income';
import Expenses from './Expenses';
import ProfitLoss from './ProfitLoss';

const styles = theme => ({});

class PageBody extends React.Component {
  state = {
    expensesDate: Store.get('expensesDate', 12),
    profitLossDate: Store.get('profitLossDate', 12),
  };

  onDate = (key: 'expensesDate' | 'profitLossDate', date: any) =>
    this.setState({ [key]: date }, () => Store.set(key, date));

  render() {
    const { intl, classes, business } = this.props;

    return (
      <div className={cx(style.pageBody, style.pageBodyContainer)}>
        <div className={style.graphs}>
          <header>
            <a className={style.headerLink}>
              <div className={cx(style.inlineBlock, style.companyData)}>
                <div className={style.companyName}>
                  <Typography type="display1">
                    {business ? business.displayName : null}
                  </Typography>
                </div>
              </div>
            </a>
            {/* <div> */}
            {/*   <span className={style.date}> */}
            {/*     {moment(new Date()).format('LLLL')} */}
            {/*   </span> */}
            {/* </div> */}

            <br />
          </header>

          <PaperSheet>
            <Income />
          </PaperSheet>
          <PaperSheet>
            <Expenses
              onDate={this.onDate.bind(this, 'expensesDate')}
              date={this.state.expensesDate}
            />
          </PaperSheet>
          <PaperSheet>
            <ProfitLoss
              onDate={this.onDate.bind(this, 'profitLossDate')}
              date={this.state.profitLossDate}
            />
          </PaperSheet>
        </div>

        {/* <div className={style.events}> */}
        {/*   <Typography type="headline" component="h3"> */}
        {/*     Événnements récents */}
        {/*   </Typography> */}
        {/*   <div /> */}
        {/* </div> */}
      </div>
    );
  }
}

export default compose(injectIntl, withStyles(styles), DataLoader.business)(
  PageBody,
);
