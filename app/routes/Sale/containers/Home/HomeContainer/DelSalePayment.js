/* eslint-disable flowtype/require-valid-file-annotation */

import React from 'react';
import T from 'prop-types';

import Loading from 'components/Loading';

import * as DataLoader from 'routes/Sale/DataLoader';

import style from 'routes/Sale/styles';

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

class DelSalePayment extends React.Component {
  onDelSalePayment = async () => {
    this.setState({ loading: true });

    const { handleRequestClose, id, delSalePayment } = this.props;

    const { data: { delSalePayment: { error } } } = await delSalePayment(id);

    if (error) {
      //
    }

    this.context.snackbar.show({
      message: error ? 'Erreur inconnu. Veuillez ré-essayer.' : 'Succès',
      duration: 2500,
    });

    handleRequestClose();
  };

  state = {
    loading: false,
  };

  render() {
    const { classes, handleRequestClose } = this.props;
    return (
      <Dialog
        open
        classes={{
          paper: classes.dialog,
        }}
        ignoreBackdropClick
        ignoreEscapeKeyUp
        transition={Slide}
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
              <Button onClick={handleRequestClose} color="primary">
                Retour
              </Button>
              <Button onClick={this.onDelSalePayment} color="primary">
                Oui, Annuler
              </Button>
            </DialogActions>,
          ]
        )}
      </Dialog>
    );
  }
}

DelSalePayment.propTypes = {
  id: T.string.isRequired,
};

DelSalePayment.contextTypes = {
  snackbar: T.object.isRequired,
};

export default compose(
  withStyles(styles),
  injectIntl,
  DataLoader.delSalePayment,
)(DelSalePayment);
