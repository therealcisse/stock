import React from 'react';
import T from 'prop-types';

import { connect } from 'react-redux';

import { compose } from 'redux';

import messages from './messages';

import { intlShape, injectIntl } from 'react-intl';

import Title from 'components/Title';

import { HOME_TITLE, APP_NAME } from 'vars';

import style from 'styles/core.scss';

import Notification from 'components/notification';

class CoreLayout extends React.Component {
  static propTypes = {
    children: T.element.isRequired,
    intl: intlShape.isRequired,
  };

  render() {
    const { intl, children } = this.props;
    return (
      <div className={style.root}>
        <Title
          title={intl.formatMessage(messages.title, { appName: APP_NAME })}
        />
        <Notification />
        {children}
      </div>
    );
  }
}

export default compose(injectIntl)(CoreLayout);
