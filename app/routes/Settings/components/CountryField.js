import React from 'react';

import cx from 'classnames';

import style from 'routes/Settings/styles';

import FormMessages from 'components/FormMessages';

import validationMessages from 'validation-messages';

import messages from 'routes/Settings/messages';

import { injectIntl, intlShape } from 'react-intl';

import countries from 'countries';

import { COUNTRY } from 'vars';

function CountryField({
  intl,
  label,
  className,
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
        <select
          {...input}
          disabled
          onKeyDown={onKeyDown}
          className={cx(style.control, className, {
            [style.formControlDanger]: touched && error,
          })}
        >
          {countries.map(({ code }) => (
            <option value={code}>
              {intl.formatMessage(messages[`country_${code}`])}
            </option>
          ))}
        </select>
        <FormMessages errorCount={1} field={input.name}>
          <div className={style.formControlFeedback} when={'country'}>
            {intl.formatMessage(validationMessages.countryInvalid, {
              country: intl.formatMessage(messages[`country_${COUNTRY}`]),
            })}
          </div>
          <div className={style.formControlFeedback} when={'required'}>
            {intl.formatMessage(validationMessages.countryRequired)}
          </div>
        </FormMessages>
      </div>
    </div>
  );
}

CountryField.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CountryField);
