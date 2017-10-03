import React from 'react';
import T from 'prop-types';

import * as DataLoader from 'routes/Products/DataLoader';

import { MONETARY_UNIT } from 'vars';

import Button from 'material-ui/Button';

import ErrorOutline from 'material-ui-icons/ErrorOutline';

import { withStyles } from 'material-ui/styles';

import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';

import { compose } from 'redux';
import { connect } from 'react-redux';

import validations from './validations';

import style from 'routes/Products/styles';

import { injectIntl } from 'react-intl';

import {
  SubmissionError,
  Field,
  reduxForm,
  propTypes as formPropTypes,
} from 'redux-form/immutable';

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
  formControl: {
    margin: theme.spacing.unit,
    width: '80%',
  },
});

function parseMoney(value) {
  const n = value
    ? parseFloat(value.replace(/,/g, '.').replace(/\s+/g, ''))
    : null;

  return n && !Number.isNaN(n)
    ? Math.trunc(n * MONETARY_UNIT) / MONETARY_UNIT
    : null;
}

function renderField({
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

class ProductForm extends React.Component {
  onSave = async data => {
    const { data: { error } } = await this.props.addProduct(this.props.id, {
      displayName: data.get('displayName'),
      unitPrice: parseMoney(data.get('unitPrice')),
      ref: data.get('ref'),
    });

    if (error) {
      throw new SubmissionError({
        _error: "Erreur d'enregistrement. Essayer à nouveau.",
      });
    }

    this.props.onClose();

    this.context.snackbar.show({
      message: 'Succès',
    });
  };

  onKeyDown = e => {};

  onBlur = e => {
    const { intl, dispatch, blur } = this.props;

    const n = parseMoney(e.target.value);

    dispatch([
      blur('unitPrice', n ? intl.formatNumber(n, { format: 'MONEY' }) : null),
    ]);
  };

  render() {
    const {
      intl,
      classes,
      title,
      pristine,
      submitting,
      invalid,
      error,
      handleSubmit,
      onClose,
    } = this.props;

    const fields = [
      <div key="space-0" style={{ marginTop: 15 }} />,
      <div key="space1" style={{ marginTop: 15 }} />,

      <div key="displayName">
        <Field
          name="displayName"
          props={{
            classes,
            autoFocus: true,
            onKeyDown: this.onKeyDown,
            label: 'Nom du produit',
          }}
          component={renderField}
        />
      </div>,

      <div key="space-3" style={{ marginTop: 15 }} />,

      <div key="unitPrice">
        <Field
          name="unitPrice"
          props={{
            classes,
            onKeyDown: this.onKeyDown,
            label: 'Prix unitaire',
            onBlur: this.onBlur,
          }}
          component={renderField}
        />
      </div>,

      <div key="space-4" style={{ marginTop: 15 }} />,

      <div key="ref">
        <Field
          name="ref"
          props={{
            classes,
            onKeyDown: this.onKeyDown,
            label: 'Référence',
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
        open
        transition={Slide}
        onRequestClose={onClose}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button disabled={submitting} onClick={onClose} color="primary">
            Annuler
          </Button>
          <Button
            disabled={pristine || submitting || invalid}
            onClick={handleSubmit(this.onSave)}
            color="primary"
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ProductForm.propTypes = {
  ...formPropTypes,
};

ProductForm.defaultProps = {
  id: null,
};

ProductForm.contextTypes = {
  snackbar: T.object.isRequired,
};

const WithForm = reduxForm({
  form: 'product',
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
  DataLoader.addProduct,
  WithForm,
)(ProductForm);
