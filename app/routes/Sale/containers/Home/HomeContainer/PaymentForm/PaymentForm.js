/* eslint-disable flowtype/require-valid-file-annotation */

import React from 'react';
import T from 'prop-types';

import Loading from 'components/Loading';

import * as DataLoader from 'routes/Sale/DataLoader';

import moment from 'moment';

import parseMoney from 'parseMoney';

import style from 'routes/Sale/styles';

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

import { injectIntl } from 'react-intl';

import DT from './DT';

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

function parseDate(s) {
  return s ? +moment.utc(s) : null;
}

function renderField({
  intl,
  balanceDue,
  classes,
  onBlur,
  onKeyDown,
  label,
  autoFocus,
  input,
  meta: { touched, error },
}) {
  const hasError =
    touched && error && (error.required || error.number || error.balanceDue);

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
      {hasError ? (
        [
          error.required && (
            <FormHelperText>{'Ce champ ne peut être vide.'}</FormHelperText>
          ),
          error.number && (
            <FormHelperText>{'Entrer des chiffres valides.'}</FormHelperText>
          ),
          error.balanceDue && (
            <FormHelperText>
              Le montant doit être égale ou inferieur à la solde courant:{' '}
              <b>{intl.formatNumber(balanceDue, { format: 'MAD' })}</b>.
            </FormHelperText>
          ),
        ]
      ) : (
        <FormHelperText>
          Le montant doit être égale ou inferieur à la solde courant:{' '}
          <b>{intl.formatNumber(balanceDue, { format: 'MAD' })}</b>.
        </FormHelperText>
      )}
    </FormControl>
  );
}

class PaymentForm extends React.Component {
  onPay = async data => {
    this.setState({ loading: true });

    const { id, paySale } = this.props;

    const payload = {
      dateCreated: parseDate(data.get('dateCreated')),
      amount: parseMoney(data.get('amount')),
    };

    const { data: { paySale: { error, sale } } } = await paySale(id, payload);

    if (error) {
      this.setState({ loading: false });
      throw new SubmissionError({
        _error: 'Erreur inconnu. Veuillez essayer à nouveau.',
      });
    } else {
      this.onClose();
    }

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

  onKeyDown = e => {};

  onBlur = e => {
    const { intl, dispatch, blur } = this.props;

    const n = parseMoney(e.target.value);

    dispatch([
      blur('amount', n ? intl.formatNumber(n, { format: 'MONEY' }) : null),
    ]);
  };

  componentDidMount() {}

  render() {
    const {
      balanceDue,
      handleRequestClose,
      intl,
      classes,
      title,
      submitting,
      invalid,
      error,
      handleSubmit,
    } = this.props;

    const fields = [
      <div key="space-0" style={{ marginTop: 15 }} />,
      <div key="space1" style={{ marginTop: 15 }} />,

      <div key="dateCreated">
        <Field
          name="dateCreated"
          autoFocus
          props={{
            classes,
            label: 'Date du paiement',
          }}
          component={DT}
        />
      </div>,

      <div key="space-3" style={{ marginTop: 15 }} />,

      <div key="amount">
        <Field
          name="amount"
          props={{
            intl,
            balanceDue,
            classes,
            onKeyDown: this.onKeyDown,
            label: 'Montant',
            onBlur: this.onBlur,
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
        <DialogTitle>{'Règlement de vente'}</DialogTitle>
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
                disabled={submitting || invalid}
                onClick={handleSubmit(this.onPay)}
                color="primary"
              >
                Enregistrer
              </Button>
            </DialogActions>,
          ]
        )}
      </Dialog>
    );
  }
}

PaymentForm.propTypes = {
  ...formPropTypes,
  id: T.string.isRequired,
};

PaymentForm.contextTypes = {
  snackbar: T.object.isRequired,
};

const WithForm = reduxForm({
  form: 'pay',
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
  WithForm,
  DataLoader.paySale,
)(PaymentForm);
