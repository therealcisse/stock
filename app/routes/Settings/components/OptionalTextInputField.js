import React from 'react';

import cx from 'classnames';

import style from 'routes/Settings/styles';

import FormMessages from 'components/FormMessages';

import { injectIntl, intlShape } from 'react-intl';

function OptionalTextInputField({
  intl,
  label,
  className,
  onKeyDown,
  input,
  meta: { touched, error },
  children,
}) {
  return (
    <div
      className={cx(style.formGroup, {
        [style.formGroupHasDanger]: touched && error,
      })}
    >
      <label htmlFor={input.name} className={style.label}>
        {label}
      </label>
      <div className={style.inputWrapper}>
        <input
          {...input}
          onKeyDown={onKeyDown}
          className={cx(style.control, className, {
            [style.formControlDanger]: touched && error,
          })}
        />
        <FormMessages errorCount={1} field={input.name}>
          {children || []}
        </FormMessages>
      </div>
    </div>
  );
}

OptionalTextInputField.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(OptionalTextInputField);
