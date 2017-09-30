import React from 'react';
import Link from 'react-router-dom/Link';

import { PATH_SUPPLIERS } from 'vars';

import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import MoreHorizIcon from 'material-ui-icons/MoreHoriz';

import SupplierForm from 'routes/Suppliers/containers/Home/HomeContainer/SupplierForm';

import style from 'routes/Supplier/styles';

import pick from 'lodash.pick';

import Report from './Report';

const styles = theme => ({
  button: {},
});

const options = ['Modifier'];

const ITEM_HEIGHT = 48;

class PageHeader extends React.Component {
  state = {
    anchorEl: null,
    open: false,
    dialogOpen: false,
  };

  handleClickOpen = () => {
    this.setState({ dialogOpen: true, open: false, anchorEl: null });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  handleClick = event => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };
  render() {
    const { intl, data, classes } = this.props;
    const { getSupplier: n } = data;
    return (
      <div className={style.pageHeader}>
        <div className={style.title}>
          <Typography type="display1" gutterBottom>
            <Link className={style.titleLink} to={PATH_SUPPLIERS}>
              Fournisseurs
            </Link>
          </Typography>
          {n
            ? [
                <Typography
                  className={style.breadcrumb}
                  type="title"
                  gutterBottom
                >
                  {n.supplier.displayName}
                </Typography>,

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
                      <MenuItem key={option} onClick={this.handleClickOpen}>
                        {option}
                      </MenuItem>
                    ))}
                  </Menu>
                </div>,
              ]
            : null}
        </div>

        <div>{n ? <Report intl={intl} balanceDue={n.balanceDue} /> : null}</div>

        {this.state.dialogOpen ? (
          <SupplierForm
            onClose={this.handleDialogClose}
            initialValues={{
              ...pick(n.supplier, [
                'displayName',
                'tel',
                'email',
                'address',
                'taxId',
              ]),
            }}
            id={n.supplier.id}
            title="Nouveau fournisseur"
          />
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(PageHeader);
