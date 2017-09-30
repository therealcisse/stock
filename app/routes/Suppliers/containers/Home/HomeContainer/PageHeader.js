import React from 'react';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

import SupplierForm from './SupplierForm';

import style from 'routes/Suppliers/styles';

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
            Fournisseurs
          </Typography>
        </div>

        <div className={style.add}>
          <Button onClick={this.handleClickOpen} raised color="accent" className={classes.button}>
            Nouveau fournisseur
          </Button>
          {this.state.dialogOpen ? (
            <SupplierForm
              onClose={this.handleRequestClose}
              initialValues={{}}
              title="Nouveau fournisseur"
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PageHeader);
