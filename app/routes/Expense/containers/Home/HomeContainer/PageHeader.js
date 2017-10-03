import React from 'react';
import Link from 'react-router-dom/Link';

import compose from 'redux/lib/compose';

import { PATH_EXPENSES, DATE_FORMAT } from 'vars';

import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

import { TransactionStatus } from 'data/types';

import Report from './Report';

import moment from 'moment';

import pick from 'lodash.pick';

import style from 'routes/Expense/styles';

import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import MoreHorizIcon from 'material-ui-icons/MoreHoriz';

import VoidForm from './VoidForm';
import PaymentForm from './PaymentForm';

const styles = theme => ({
  button: {},
});

const ITEM_HEIGHT = 48;

class PageHeader extends React.Component {
  state = {
    option: null,
    anchorEl: null,
    open: false,
    dialogOpen: false,
  };

  handleClickOpen = option => {
    this.setState({ dialogOpen: true, option, open: false, anchorEl: null });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false, option: null });
  };

  handleClick = event => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const { intl, data, classes } = this.props;
    const { getExpense: n } = data;

    const options = [];

    if (n) {
      if (!n.isFullyPaid) {
        options.push({ id: 'pay', displayName: 'Enregistrer un paiement' });
      }

      options.push({ id: 'void', displayName: 'Annuler' });
    }

    return (
      <div className={style.pageHeader}>
        <div className={style.title}>
          <Typography type="display1" gutterBottom>
            <Link className={style.titleLink} to={PATH_EXPENSES}>
              Dépenses
            </Link>
          </Typography>
          {n
            ? [
                <Typography
                  className={style.breadcrumb}
                  type="title"
                  gutterBottom
                >
                  #{n.expense.refNo}
                </Typography>,

                n.expense.status === TransactionStatus.CANCELLED ? null : <div className={style.actions}>
                  <IconButton
                    aria-label="Actions"
                    aria-owns={this.state.open ? 'long-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    anchorEl={this.state.anchorEl}
                    open={this.state.open}
                    onRequestClose={this.handleRequestClose}
                    PaperProps={{
                      style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: 200,
                      },
                    }}
                  >
                    {options.map(option => (
                      <MenuItem
                        key={option.id}
                        onClick={this.handleClickOpen.bind(this, option.id)}
                      >
                        {option.displayName}
                      </MenuItem>
                    ))}
                  </Menu>
                </div>,
              ]
            : null}
        </div>

        <div>{n ? <Report intl={intl} expense={n} /> : null}</div>

        {(() => {
          const { dialogOpen, option } = this.state;

          if (!dialogOpen) {
            return null;
          }

          if (option === 'pay') {
            return (
              <PaymentForm
                id={n.expense.id}
                balanceDue={n.balanceDue}
                initialValues={{
                  dateCreated: moment().format(DATE_FORMAT),
                  balanceDue: n.balanceDue,
                }}
                handleRequestClose={this.handleDialogClose}
              />
            );
          }

          if (option === 'void') {
            return (
              <VoidForm
                id={n.expense.id}
                handleRequestClose={this.handleDialogClose}
              />
            );
          }
        })()}
      </div>
    );
  }
}

export default compose(withStyles(styles))(PageHeader);
