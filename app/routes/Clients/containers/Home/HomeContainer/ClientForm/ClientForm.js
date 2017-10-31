import React from 'react';
import T from 'prop-types';

import * as DataLoader from 'routes/Clients/DataLoader';

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

import style from 'routes/Clients/styles';

import { injectIntl } from 'react-intl';

import {
  SubmissionError,
  Field,
  reduxForm,
  submit,
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
    maxHeight: 735,
  },
  formControl: {
    margin: theme.spacing.unit,
    width: '80%',
  },
});

function renderField({
  classes,
  onKeyDown,
  label,
  autoFocus,
  input,
  meta: { touched, error },
  multiline = false,
  rows,
}) {
  const hasError = touched && error && (error.required || error.email);

  return (
    <FormControl className={classes.formControl} error={hasError}>
      <InputLabel htmlFor={input.name}>{label}</InputLabel>
      <Input
        id={input.name}
        {...input}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        multiline={multiline}
        rows={rows}
        rowsMax={7}
      />
      {hasError
        ? [
            error.required && (
              <FormHelperText>{'Ce champ ne peut être vide.'}</FormHelperText>
            ),
            error.email && (
              <FormHelperText>{'Entrer un e-mail valid.'}</FormHelperText>
            ),
          ]
        : null}
    </FormControl>
  );
}

class ClientForm extends React.Component {
  state = {
    open: true,
  };

  onSave = async data => {
    const { data: { error } } = await this.props.addClient(this.props.id, {
      displayName: data.get('displayName'),
      tel: data.get('tel'),
      email: data.get('email'),
      address: data.get('address'),
      taxId: data.get('taxId'),
    });

    if (error) {
      throw new SubmissionError({
        _error: "Erreur d'enregistrement. Essayer à nouveau.",
      });
    }

    this.onClose();

    this.context.snackbar.show({
      message: 'Succès',
    });
  };

  onKeyDown = e => {};

  onClose = () => this.setState({ open: false });

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
            label: 'Nom du client',
          }}
          component={renderField}
        />
      </div>,

      <div key="space-3" style={{ marginTop: 15 }} />,

      <div key="tel">
        <Field
          name="tel"
          props={{
            classes,
            onKeyDown: this.onKeyDown,
            label: 'Téléphone',
          }}
          component={renderField}
        />
      </div>,

      <div key="space-4" style={{ marginTop: 15 }} />,

      <div key="email">
        <Field
          name="email"
          props={{
            classes,
            onKeyDown: this.onKeyDown,
            label: 'E-mail',
          }}
          component={renderField}
        />
      </div>,

      <div key="space-5" style={{ marginTop: 15 }} />,

      <div key="address">
        <Field
          name="address"
          props={{
            multiline: true,
            rows: 5,
            classes,
            onKeyDown: this.onKeyDown,
            label: 'Adresse',
          }}
          component={renderField}
        />
      </div>,

      <div key="space-6" style={{ marginTop: 15 }} />,

      <div key="taxId">
        <Field
          name="taxId"
          props={{
            classes,
            onKeyDown: this.onKeyDown,
            label: `Numéro d'indentification fiscale`,
          }}
          component={renderField}
        />
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
          <Button disabled={submitting} onClick={this.onClose} color="primary">
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

ClientForm.propTypes = {
  ...formPropTypes,
};

ClientForm.defaultProps = {
  id: null,
};

ClientForm.contextTypes = {
  store: T.object.isRequired,
  snackbar: T.object.isRequired,
};

const WithForm = reduxForm({
  form: 'client',
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
  DataLoader.addClient,
  WithForm,
)(ClientForm);
