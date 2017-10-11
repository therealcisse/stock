/* eslint-disable flowtype/require-valid-file-annotation */

import React from 'react';
import T from 'prop-types';

import Loading from 'components/Loading';

import * as DataLoader from 'routes/Expense/DataLoader';

import style from 'routes/Expense/styles';

import compose from 'redux/lib/compose';

import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';

import { injectIntl } from 'react-intl';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    background: theme.palette.background.paper,
  },
  dialog: {
    width: '80%',
    maxHeight: 435,
  },
});

class DelExpensePayment extends React.Component {
  onDelExpensePayment = async () => {
    this.setState({ loading: true });

    const { id, delExpensePayment } = this.props;

    const { data: { delExpensePayment: { error } } } = await delExpensePayment(
      id,
    );

    if (error) {
      //
    }

    this.onClose();

    this.context.snackbar.show({
      message: error ? 'Erreur inconnu. Veuillez ré-essayer.' : 'Succès',
      duration: 2500,
    });
  };

  state = {
    loading: false,
    open: true,
  };

  onClose = () => this.setState({ open: false });

  render() {
    const { classes, handleRequestClose } = this.props;
    return (
      <Dialog
        classes={{
          paper: classes.dialog,
        }}
        ignoreBackdropClick
        ignoreEscapeKeyUp
        open={this.state.open}
        transition={Slide}
        onRequestClose={this.onClose}
        onExited={handleRequestClose}
      >
        <DialogTitle>{'Annuler ce paiement?'}</DialogTitle>
        {this.state.loading ? (
          <div className={style.center}>
            <Loading />
          </div>
        ) : (
          [
            <DialogContent key="content">
              <DialogContentText>
                Ce paiement ne s'affichira plus et le montant sera
                automatiquement déduit.
              </DialogContentText>
            </DialogContent>,
            <DialogActions key="actions">
              <Button onClick={this.onClose} color="primary">
                Retour
              </Button>
              <Button onClick={this.onDelExpensePayment} color="primary">
                Oui, Annuler
              </Button>
            </DialogActions>,
          ]
        )}
      </Dialog>
    );
  }
}

DelExpensePayment.propTypes = {
  id: T.string.isRequired,
};

DelExpensePayment.contextTypes = {
  snackbar: T.object.isRequired,
};

export default compose(
  withStyles(styles),
  injectIntl,
  DataLoader.delExpensePayment,
)(DelExpensePayment);
