import React from 'react';
import T from 'prop-types';

import moment from 'moment';

import { Map } from 'immutable';

import * as DataLoader from 'routes/Sales/DataLoader';

import Button from 'material-ui/Button';

import ErrorOutline from 'material-ui-icons/ErrorOutline';

import { withStyles } from 'material-ui/styles';

import IconButton from 'material-ui/IconButton';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';

import CloseIcon from 'material-ui-icons/Close';

import NextRefNo from './NextRefNo';

import Typography from 'material-ui/Typography';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';

import { compose } from 'redux';
import { connect } from 'react-redux';

import validations from './validations';

import style from 'routes/Sales/styles';

import { injectIntl } from 'react-intl';

import {
  SubmissionError,
  Field,
  reduxForm,
  submit,
  propTypes as formPropTypes,
} from 'redux-form/immutable';

import BalanceDue from './BalanceDue';
import ClientFieldAutosuggest from './ClientFieldAutosuggest';
import DT from './DT';
import ItemForm from './ItemForm';

import Items from './Items';
import SaveButton from './SaveButton';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    background: theme.palette.background.paper,
  },
  dialog: {},
  dialogContent: {
    padding: 0,
  },
  button: {
    margin: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit,
    width: '80%',
  },
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
});

class SaleForm extends React.Component {
  state = {
    open: true,
    dialogOpen: false,
  };

  onAddItemDialog = (e, item = undefined) =>
    this.setState({ dialogOpen: true, item });

  onCloseAddItemDialog = () =>
    this.setState({ dialogOpen: false, item: undefined });

  addOrEditItem = (id, item) => {
    const { array } = this.props;
    if (typeof id === 'number') {
      array.remove('items', id);
      array.insert('items', id, item);
    } else {
      array.push('items', item);
    }
  };

  removeItem = id => {
    const { array } = this.props;
    array.remove('items', id);
  };

  onSave = async data => {
    const { onClose, addSale } = this.props;

    if (data.getIn(['items']).isEmpty()) {
      throw new SubmissionError({
        _error: `Il faut au moins une ligne`,
      });
    }

    const payload = {
      client: data.getIn(['client']).client.id,
      dateCreated: +moment(data.getIn(['dateCreated'])),
      items: data
        .getIn(['items'])
        .map(item => ({
          productId: Map.isMap(item.product)
            ? item.product.getIn(['product', 'id'])
            : item.product.product.id,
          qty: item.qty,
          unitPrice: item.unitPrice,
        }))
        .toJS(),
      isFullyPaid: false,
    };

    const { data: { error } } = await addSale(payload);

    if (error) {
      throw new SubmissionError({
        _error: `Erreur d'enregistrement. Veuillez éssayer à nouveau.`,
      });
    }

    this.onClose();

    this.context.snackbar.show({
      message: 'Succès',
      duration: 2500,
    });
  };

  onKeyDown = e => {};

  onClose = () => this.setState({ open: false });

  onDTRef = dateField => {
    this.dateField = dateField;
  };

  onClientSelected = () => {
    if (this.dateField) {
      try {
        setTimeout(() => {
          this.dateField.focus();
        }, 0);
      } catch (e) {}
    }
  };

  render() {
    const {
      intl,
      classes,
      pristine,
      submitting,
      valid,
      error,
      handleSubmit,
      onClose,
    } = this.props;

    const fields = [
      <div className={style.formTopInfo}>
        <Field
          name="client"
          component={ClientFieldAutosuggest}
          props={{ onDone: this.onClientSelected }}
        />
        <BalanceDue intl={intl} />
      </div>,

      <div key="space-1" style={{ marginTop: 45 }} />,

      <div key="dateCreated" className={style.fieldDate}>
        <Field
          name="dateCreated"
          component={DT}
          props={{
            onRef: this.onDTRef,
            classes,
            label: 'Date facture',
          }}
        />
      </div>,

      <div key="space-2" style={{ marginTop: 60 }} />,

      <div key="items" className={style.fieldItems}>
        <Items
          intl={intl}
          editItem={this.onAddItemDialog}
          removeItem={this.removeItem}
        />
        <Field name="items" component={'input'} type="hidden" props={{}} />
      </div>,

      <div key="space-2" style={{ marginTop: 60 }} />,

      <div key="ops" className={style.fieldOps}>
        <Button
          raised
          onClick={this.onAddItemDialog}
          color="primary"
          className={classes.button}
        >
          Ajouter
        </Button>
      </div>,

      <div key="space-x" style={{ marginTop: 15 }} />,
      <div key="space-xx" style={{ marginTop: 15 }} />,
    ];

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
        onExited={onClose}
        fullScreen
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="contrast"
              onClick={this.onClose}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              Facture de vente <NextRefNo />
            </Typography>
            <SaveButton
              disabled={submitting}
              intl={intl}
              onSave={handleSubmit(this.onSave)}
            />
          </Toolbar>
        </AppBar>
        <DialogContent
          classes={{
            root: classes.dialogContent,
          }}
        >
          {error
            ? [
                <div key="error" className={style.errorLine}>
                  <ErrorOutline width={32} height={32} />
                  <div style={{ marginLeft: 9 }}>{error}</div>
                </div>,
              ]
            : null}
          {fields}
          {(() => {
            const { dialogOpen, item = { index: null, value: {} } } = this.state;

            if (!dialogOpen) {
              return null;
            }

            return (
              <ItemForm
                initialValues={{ qty: 1, ...item.value }}
                id={item.index}
                addOrEditItem={this.addOrEditItem}
                handleRequestClose={this.onCloseAddItemDialog}
              />
            );
          })()}
        </DialogContent>
      </Dialog>
    );
  }
}

SaleForm.propTypes = {
  ...formPropTypes,
};

SaleForm.defaultProps = {
  id: null,
};

SaleForm.contextTypes = {
  store: T.object.isRequired,
  snackbar: T.object.isRequired,
};

const WithForm = reduxForm({
  form: 'sale',
  keepDirtyOnReinitialize: false,
  enableReinitialize: true,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  validate: validations.validate,
  asyncBlurFields: validations.asyncBlurFields,
});

export default compose(
  withStyles(styles),
  injectIntl,
  DataLoader.addSale,
  WithForm,
)(SaleForm);
