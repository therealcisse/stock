import React from 'react';
import T from 'prop-types';

import { connect } from 'react-redux';

import { compose } from 'redux';

import { createSelector } from 'utils/reselect';

import { dbStatus } from 'redux/reducers/app/actions';

import * as selectors from 'redux/reducers/app/selectors';

import { DBStatus } from 'redux/reducers/app/constants';

import messages from './messages';

import { intlShape, injectIntl } from 'react-intl';

import Title from 'components/Title';

import { HOME_TITLE, APP_NAME } from 'vars';

import style from 'styles/core.scss';

import cx from 'classnames';

// import Notification from 'components/notification';

import SearchWidget from 'components/SearchWidget';

import Loading from 'components/Loading';

class CoreLayout extends React.Component {
  static propTypes = {
    children: T.element.isRequired,
    intl: intlShape.isRequired,
  };

  render() {
    const { dbStatus, intl, children } = this.props;

    if (dbStatus === DBStatus.PENDING) {
      // return loading
      return (
        <div className={cx(style.root, style.center)}>
          <Title
            title={intl.formatMessage(messages.title, { appName: APP_NAME })}
          />
          <Loading />
        </div>
      );
    }

    if (dbStatus === DBStatus.FAILED) {
      return (
        <div className={cx(style.root, style.center)}>
          <Title
            title={intl.formatMessage(messages.title, { appName: APP_NAME })}
          />
          <div className={style.error}>
            Erreur d'initialization. Veuillez contacter votre administrateur.
          </div>
        </div>
      );
    }

    return [
      /* <Notification />, */

      <div className={style.root}>
        <Title
          title={intl.formatMessage(messages.title, { appName: APP_NAME })}
        />
        {children}
      </div>,

      <SearchWidget />,
    ];
  }
}

const mapStateToProps = createSelector(selectors.dbStatus, dbStatus => ({
  dbStatus,
}));

const Connect = connect(mapStateToProps);

export default compose(injectIntl, Connect)(CoreLayout);
