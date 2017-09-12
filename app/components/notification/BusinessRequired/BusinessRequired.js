import React from 'react';
import { compose } from 'redux';
import { Link } from 'react-router-dom';

import style from '../Notification.scss';

import {
  APP_NAME,
  PATH_SETTINGS_BASE,
  PATH_SETTINGS_BUSINESS_DETAILS,
} from 'vars';

import messages from '../messages';

import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import cx from 'classnames';

class BusinessRequired extends React.Component {
  render() {
    const { intl, className } = this.props;
    const values = {
      appName: <strong className={''}>{APP_NAME}</strong>,
      link: (
        <Link
          className={style.businessLink}
          to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_DETAILS}
        >
          {intl.formatMessage(messages.AddBusinessLink)}
        </Link>
      ),
    };
    return (
      <div className={cx(className, style.notificationBusinessRequired)}>
        <FormattedMessage {...messages.BusinessRequired} values={values} />
      </div>
    );
  }
}

BusinessRequired.propTypes = {
  intl: intlShape.isRequired,
};

export default compose(injectIntl)(BusinessRequired);
