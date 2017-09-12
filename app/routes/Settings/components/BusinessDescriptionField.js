import React from 'react';

import Textarea from 'react-textarea-autosize';

import style from 'routes/Settings/styles';

import { injectIntl, intlShape } from 'react-intl';

function BusinessDescriptionField({ intl, label, input }) {
  return (
    <div className={style.formGroup}>
      <label htmlFor={input.name} className={style.label}>
        {label}
      </label>
      <div className={style.inputWrapper}>
        <Textarea {...input} rows={4} maxRows={4} className={style.control} />
      </div>
    </div>
  );
}

BusinessDescriptionField.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(BusinessDescriptionField);
