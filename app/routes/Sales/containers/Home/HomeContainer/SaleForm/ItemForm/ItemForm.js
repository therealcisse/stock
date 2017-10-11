/* eslint-disable flowtype/require-valid-file-annotation */

import React from 'react';
import T from 'prop-types';

import raf from 'requestAnimationFrame';

import Loading from 'components/Loading';

import moment from 'moment';

import style from 'routes/Sales/styles';

import compose from 'redux/lib/compose';

import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

import ErrorOutline from 'material-ui-icons/ErrorOutline';

import { withStyles } from 'material-ui/styles';

import validations from './validations';

import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';

import parseMoney from 'parseMoney';

import { injectIntl } from 'react-intl';

import {
  SubmissionError,
  Field,
  reduxForm,
  propTypes as formPropTypes,
} from 'redux-form/immutable';

import ProductFieldAutosuggest from './ProductFieldAutosuggest';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    background: theme.palette.background.paper,
  },
  dialog: {
    width: '80%',
    maxHeight: 465,
  },
  formControl: {
    margin: theme.spacing.unit,
    width: '80%',
  },
});

function renderField({
  onRef,
  intl,
  classes,
  onBlur,
  onKeyDown,
  label,
  autoFocus,
  input,
  meta: { touched, error },
}) {
  const hasError = touched && error && (error.required || error.number);

  return (
    <FormControl className={classes.formControl} error={hasError}>
      <InputLabel htmlFor={input.name}>{label}</InputLabel>
      <Input
        id={input.name}
        {...input}
        inputRef={onRef}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        onBlur={onBlur || input.onBlur}
      />
      {hasError
        ? [
            error.required && (
              <FormHelperText>{'Ce champ ne peut être vide.'}</FormHelperText>
            ),
            error.number && (
              <FormHelperText>{'Entrer des chiffres valides.'}</FormHelperText>
            ),
          ]
        : null}
    </FormControl>
  );
}

function parseNumber(value) {
  return value ? parseInt(value, 10) : null;
}

class ItemForm extends React.Component {
  onItem = async data => {
    this.setState({ loading: true });

    const { id, addOrEditItem } = this.props;

    const payload = {
      product: data.get('product'),
      qty: data.get('qty'),
      unitPrice: parseMoney(data.get('unitPrice')),
    };

    addOrEditItem(id, payload);

    this.onClose();
  };

  state = {
    loading: false,
    open: true,
  };

  onClose = () => this.setState({ open: false });

  onKeyDown = e => {};

  onBlur = e => {
    const { intl, dispatch, blur } = this.props;

    const n = parseMoney(e.target.value);

    dispatch([
      blur('unitPrice', n ? intl.formatNumber(n, { format: 'MONEY' }) : null),
    ]);
  };

  componentDidMount() {}

  onProductSelected = suggestion => {
    if (this.amountField) {
      try {
        this.amountField.focus();
      } catch (e) {}
    }

    const { intl, dispatch, change } = this.props;

    if (suggestion.product.unitPrice) {
      raf(() =>
        dispatch(
          change(
            'unitPrice',
            intl.formatNumber(suggestion.product.unitPrice, { format: 'MONEY' }),
          ),
        ),
      );
    }
  };

  onPriceRef = amountField => {
    this.amountField = amountField;
  };

  render() {
    const {
      handleRequestClose,
      intl,
      classes,
      title,
      pristine,
      submitting,
      invalid,
      error,
      handleSubmit,
    } = this.props;

    const fields = [
      <div key="space-0" style={{ marginTop: 15 }} />,
      <div key="space1" style={{ marginTop: 15 }} />,

      <div key="product">
        <Field
          name="product"
          props={{
            autoFocus: true,
            classes,
            label: 'Produit',
            onDone: this.onProductSelected,
          }}
          component={ProductFieldAutosuggest}
        />
      </div>,

      <div key="space-3" style={{ marginTop: 30 }} />,

      <div key="unitPrice">
        <Field
          name="unitPrice"
          props={{
            onRef: this.onPriceRef,
            intl,
            classes,
            onKeyDown: this.onKeyDown,
            label: 'Prix unitaire',
            onBlur: this.onBlur,
          }}
          component={renderField}
        />
      </div>,

      <div key="space-4" style={{ marginTop: 15 }} />,

      <div key="qty">
        <Field
          name="qty"
          parse={parseNumber}
          props={{
            intl,
            classes,
            onKeyDown: this.onKeyDown,
            label: 'Qté',
          }}
          component={renderField}
        />
      </div>,

      <div key="space-5" style={{ marginTop: 15 }} />,
      <div key="space-6" style={{ marginTop: 15 }} />,
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
        onExited={handleRequestClose}
      >
        <DialogTitle>{'Ligne'}</DialogTitle>
        {this.state.loading ? (
          <div className={style.center}>
            <Loading />
          </div>
        ) : (
          [
            <DialogContent key="content">
              {error
                ? [
                    <div key="space" style={{ marginTop: 15 }} />,
                    <div key="error" className={style.errorLine}>
                      <ErrorOutline width={32} height={32} />
                      <div style={{ marginLeft: 9 }}>{error}</div>
                    </div>,
                  ]
                : null}
              {fields}
            </DialogContent>,
            <DialogActions key="actions">
              <Button
                disabled={submitting}
                onClick={this.onClose}
                color="primary"
              >
                Annuler
              </Button>
              <Button
                disabled={pristine || submitting || invalid}
                onClick={handleSubmit(this.onItem)}
                color="primary"
              >
                Ajouter
              </Button>
            </DialogActions>,
          ]
        )}
      </Dialog>
    );
  }
}

ItemForm.propTypes = {
  ...formPropTypes,
  id: T.string.isRequired,
};

ItemForm.contextTypes = {
  snackbar: T.object.isRequired,
};

const WithForm = reduxForm({
  form: 'item',
  keepDirtyOnReinitialize: false,
  enableReinitialize: true,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  validate: validations.validate,
  asyncBlurFields: validations.asyncBlurFields,
});

export default compose(withStyles(styles), injectIntl, WithForm)(ItemForm);
