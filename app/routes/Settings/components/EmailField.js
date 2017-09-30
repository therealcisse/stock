import React from 'react';
import Link from 'react-router-dom/Link';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_CHANGE_EMAIL } from 'vars';

import style from 'routes/Settings/styles';

import { injectIntl, intlShape } from 'react-intl';

import messages from 'routes/Settings/messages';

import { PencilIcon } from 'components/icons/MaterialIcons';

function EmailField({ intl, label, input }) {
  return (
    <div className={style.emailField}>
      <label htmlFor={input.name} className={style.label}>
        {label}
      </label>
      <div className={style.inputWrapper}>
        <p className={style.email}>
          {input.value}{' '}
          <Link
            className={style.changeEmailButton}
            to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_CHANGE_EMAIL}
          >
            <PencilIcon className={style.changeEmailIcon} size={18} />
          </Link>
        </p>
      </div>
    </div>
  );
}

EmailField.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(EmailField);
