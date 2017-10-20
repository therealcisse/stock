import React from 'react';
import ReactDOM from 'react-dom/server';
import Link from 'react-router-dom/Link';

import { print } from 'redux/reducers/app/actions';

import compose from 'redux/lib/compose';

import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';

import { PATH_QUOTATIONS, DATE_FORMAT } from 'vars';

import parseMoney from 'parseMoney';

import { TransactionStatus, Quotation } from 'data/types';

import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

import Report from './Report';

import pick from 'lodash.pick';

import moment from 'moment';

import style from 'routes/Quotation/styles';

import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import MoreHorizIcon from 'material-ui-icons/MoreHoriz';

import AcceptForm from './AcceptForm';
import VoidForm from './VoidForm';

import PDF from './templates/PDF';

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

  handleClickOpen = async option => {
    if (option === 'print') {
      this.setState({
        dialogOpen: false,
        open: false,
        option: null,
      });

      const html = ReactDOM.renderToStaticMarkup(
        <PDF
          business={this.props.business}
          intl={this.props.intl}
          n={this.props.data.getQuotation}
        />,
      );

      this.props.actions.print(Quotation.TYPE, '<!DOCTYPE html >' + html);
    } else {
      this.setState({ dialogOpen: true, option, open: false, anchorEl: null });
    }
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false, option: null });
  };

  handleClick = event => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { intl, data, classes } = this.props;
    const { getQuotation: n } = data;

    const options = [];

    if (n) {
      if (!n.quotation.status) {
        options.push({ id: 'accept', displayName: 'Accepter' });
      }

      options.push({ id: 'print', displayName: 'Imprimer' });

      if (!n.quotation.status) {
        options.push({ id: 'void', displayName: 'Annuler' });
      }
    }
    return (
      <div className={style.pageHeader}>
        <div className={style.title}>
          <Typography type="display1" gutterBottom>
            <Link className={style.titleLink} to={PATH_QUOTATIONS}>
              Devis
            </Link>
          </Typography>
          {n
            ? [
                <Typography
                  className={style.breadcrumb}
                  type="title"
                  gutterBottom
                >
                  #{n.quotation.refNo}
                </Typography>,

                n.quotation.status === TransactionStatus.CANCELLED ||
                n.quotation.status === TransactionStatus.ACCEPTED ? null : (
                  <div className={style.actions}>
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
                  </div>
                ),
              ]
            : null}
        </div>

        <div>{n ? <Report intl={intl} quotation={n} /> : null}</div>

        {(() => {
          const { dialogOpen, option } = this.state;

          if (!dialogOpen) {
            return null;
          }

          if (option === 'void') {
            return (
              <VoidForm
                id={n.quotation.id}
                handleRequestClose={this.handleDialogClose}
              />
            );
          }

          if (option === 'accept') {
            return (
              <AcceptForm
                id={n.quotation.id}
                handleRequestClose={this.handleDialogClose}
              />
            );
          }
        })()}
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        print,
      },
      dispatch,
    ),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withStyles(styles), Connect)(PageHeader);
