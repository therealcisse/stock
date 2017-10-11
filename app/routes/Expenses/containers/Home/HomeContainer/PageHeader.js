import React from 'react';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

import style from 'routes/Expenses/styles';

import ExpenseForm from './ExpenseForm';

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
      <div className={style.pageHeader}>
        <div className={style.title}>
          <Typography type="display1" gutterBottom>
            Dépenses
          </Typography>
        </div>

        <div className={style.add}>
          <Button
            onClick={this.handleClickOpen}
            raised
            color="accent"
            className={classes.button}
          >
            Nouvelle dépense
          </Button>
          {this.state.dialogOpen ? (
            <ExpenseForm
              onClose={this.handleRequestClose}
              initialValues={{
                dateCreated: moment().format(DATE_FORMAT),
                items: [],
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PageHeader);
