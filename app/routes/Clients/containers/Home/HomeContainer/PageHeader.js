import React from 'react';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

import style from 'routes/Clients/styles';

import ClientForm from './ClientForm';

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
            Clients
          </Typography>
        </div>

        <div className={style.add}>
          <Button onClick={this.handleClickOpen} raised color="accent" className={classes.button}>
            Nouveau client
          </Button>
          {this.state.dialogOpen ? (
            <ClientForm
              onClose={this.handleRequestClose}
              initialValues={{}}
              title="Nouveau client"
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PageHeader);
