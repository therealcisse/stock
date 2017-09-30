import React from 'react';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

import style from 'routes/Products/styles';

import ProductForm from './ProductForm';

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
            Produits
          </Typography>
        </div>

        <div className={style.add}>
          <Button
            onClick={this.handleClickOpen}
            raised
            color="accent"
            className={classes.button}
          >
            Nouveau produit
          </Button>
          {this.state.dialogOpen ? (
            <ProductForm
              onClose={this.handleRequestClose}
              initialValues={{}}
              title="Nouveau produit"
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PageHeader);
