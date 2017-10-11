import React from 'react';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

import style from 'routes/Sales/styles';

import SalesReport from './SalesReport';

import SaleForm from './SaleForm';

import moment from 'moment';

import { DATE_FORMAT } from 'vars';

const styles = theme => ({
  button: {},
});

class PageHeader extends React.Component {
  state = {
    dialogOpen: false,
  };

  handleClickOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleRequestClose = () => {
    this.setState({ dialogOpen: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={style.header}>
        <div className={style.pageHeader}>
          <div className={style.title}>
            <Typography type="display1" gutterBottom>
              Ventes
            </Typography>
          </div>

          <div className={style.add}>
            <Button
              onClick={this.handleClickOpen}
              raised
              color="accent"
              className={classes.button}
            >
              Nouvelle facture
            </Button>
            {this.state.dialogOpen ? (
              <SaleForm
                onClose={this.handleRequestClose}
                initialValues={{
                  dateCreated: moment().format(DATE_FORMAT),
                  items: [],
                }}
              />
            ) : null}
          </div>
        </div>
        <SalesReport />
      </div>
    );
  }
}

export default withStyles(styles)(PageHeader);
