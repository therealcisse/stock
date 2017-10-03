import React from 'react';
import T from 'prop-types';

import compose from 'redux/lib/compose';

import { withStyles } from 'material-ui/styles';

import { injectIntl } from 'react-intl';

import Loading from 'components/Loading';

import style from 'routes/Expense/styles';

import NotFound from './NotFound';

import BeneficiaryInfo from './BeneficiaryInfo';

import Payments from './Payments';
import Items from './Items';

const styles = theme => ({
  paper: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },

  totalRow: {
    borderBottom: 'none',
  },
});

class PageBody extends React.Component {
  render() {
    const { data, intl, classes } = this.props;
    const { loading, error, getExpense: n } = data;

    if (error) {
      return <NotFound error={error} />;
    }

    if (loading) {
      return (
        <div className={style.loading}>
          <Loading />
        </div>
      );
    }

    return (
      <div className={style.pageBody}>
        <BeneficiaryInfo n={n} />
        <Items classes={classes} intl={intl} n={n} />
        <Payments intl={intl} n={n} />
      </div>
    );
  }
}

export default compose(injectIntl, withStyles(styles))(PageBody);
