import React from 'react';

import cx from 'classnames';

import FormMessages from 'components/FormMessages';

import validationMessages from 'validation-messages';

import style from 'routes/Settings/styles';

import { injectIntl, intlShape } from 'react-intl';

function FullNameField({
  intl,
  label,
  onKeyDown,
  input,
  meta: { touched, error },
}) {
  return (
    <div
      className={cx(style.formGroup, {
        [style.formGroupHasDanger]: touched && error,
      })}
    >
      <label htmlFor={input.name} className={style.label}>
        {label} <span className={style.iconRequired}>⋆</span>
      </label>
      <div className={style.inputWrapper}>
        <input
          {...input}
          onKeyDown={onKeyDown}
          autoFocus
          autoComplete={'off'}
          type={'text'}
          className={cx(style.control, {
            [style.formControlDanger]: touched && error,
          })}
        />
        <FormMessages errorCount={1} field={input.name}>
          <div className={style.formControlFeedback} when={'required'}>
            {intl.formatMessage(validationMessages.fullNameRequired)}
          </div>
        </FormMessages>
      </div>
    </div>
  );
}

FullNameField.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(FullNameField);
