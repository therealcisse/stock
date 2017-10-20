import React from 'react';
import Link from 'react-router-dom/Link';

import { PATH_CLIENTS } from 'vars';

import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

import Report from './Report';

import pick from 'lodash.pick';

import ClientForm from 'routes/Clients/containers/Home/HomeContainer/ClientForm';

import style from 'routes/Client/styles';

import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import MoreHorizIcon from 'material-ui-icons/MoreHoriz';

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
    const { getClient: n } = data;
    return (
      <div className={style.pageHeader}>
        <div className={style.title}>
          <Typography type="display1" gutterBottom>
            <Link className={style.titleLink} to={PATH_CLIENTS}>
              Clients
            </Link>
          </Typography>
          {n
            ? [
                <Typography
                  className={style.breadcrumb}
                  type="title"
                  gutterBottom
                >
                  {n.client.displayName}
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

        <div>
          {n ? (
            <Report
              intl={intl}
              totalPaid={n.totalPaid}
              balanceDue={n.balanceDue}
            />
          ) : null}
        </div>

        {this.state.dialogOpen ? (
          <ClientForm
            onClose={this.handleDialogClose}
            initialValues={{
              ...pick(n.client, [
                'displayName',
                'tel',
                'email',
                'address',
                'taxId',
              ]),
            }}
            id={n.client.id}
            title="Modifier le client"
          />
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(PageHeader);
