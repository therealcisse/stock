import React from 'react';

import cx from 'classnames';

import FormMessages from 'components/FormMessages';

import validationMessages from 'validation-messages';

import style from 'routes/Settings/styles';

import { injectIntl, intlShape } from 'react-intl';

import PasswordMeter from './PasswordMeter';

import PasswordInput from 'components/PasswordInput';

function NewPasswordField({
  intl,
  label,
  onKeyDown,
  input,
  meta: { touched, error },
}) {
  return (
    <div
      className={cx(style.formGroup, {
        // [style.formGroupHasDanger]: touched && error,
      })}
    >
      <label htmlFor={input.name} className={style.label}>
        {label}
      </label>
      <div className={style.inputWrapper}>
        <PasswordInput
          inputProps={input}
          inputClassName={cx(style.control, {
            [style.formControlDanger]: touched && error,
          })}
          onKeyDown={onKeyDown}
        />
        <PasswordMeter password={input.value} />
        <FormMessages errorCount={1} field={input.name}>
          <div className={style.formControlFeedback} when={'minScore'}>
            {intl.formatMessage(validationMessages.passwordMinScore)}
          </div>
          <div className={style.formControlFeedback} when={'required'}>
            {intl.formatMessage(validationMessages.newPasswordRequired)}
          </div>
        </FormMessages>
      </div>
    </div>
  );
}

NewPasswordField.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(NewPasswordField);
