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

class VoidForm extends React.Component {
  onVoid = async () => {
    this.setState({ loading: true });

    const { handleRequestClose, id, voidSale } = this.props;

    const {
      data: { voidSale: { error } },
    } = await voidSale(id);

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
        <DialogTitle>{'Annuler cette opération?'}</DialogTitle>
        {this.state.loading ? (
          <div className={style.center}>
            <Loading />
          </div>
        ) : (
          [
            <DialogContent key="content">
              <DialogContentText>
                Cette opération ne s'affichira plus et ses montants seront
                automatiquement déduits.
              </DialogContentText>
            </DialogContent>,
            <DialogActions key="actions">
              <Button onClick={handleRequestClose} color="primary">
                Retour
              </Button>
              <Button onClick={this.onVoid} color="primary">
                Oui, Annuler
              </Button>
            </DialogActions>,
          ]
        )}
      </Dialog>
    );
  }
}

VoidForm.propTypes = {
  id: T.string.isRequired,
};

VoidForm.contextTypes = {
  snackbar: T.object.isRequired,
};

export default compose(withStyles(styles), injectIntl, DataLoader.voidSale)(
  VoidForm,
);
