import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import { compose } from 'redux';

import { createSelector } from 'utils/reselect';

import AppBrand from 'components/AppBrand';

import messages from 'routes/Settings/messages';

import style from 'routes/Settings/styles';

import { injectIntl, intlShape } from 'react-intl';

const scrollingSelector = state => state.get('scrolling');
const notificationOpenSelector = state =>
  state.getIn(['notification', 'options']).active;

const selector = createSelector(
  scrollingSelector,
  notificationOpenSelector,
  (scrolling, notificationOpen) => ({ scrolling, notificationOpen }),
);

const NOTIFICATION_HEIGHT = 45;
const DEFAULT_TOP = 0;

const getStyle = (notificationOpen, scrollTop) =>
  notificationOpen
    ? {
        top: scrollTop === 0 ? NOTIFICATION_HEIGHT : DEFAULT_TOP,
      }
    : {};

function Header({ intl, danger, scrolling, notificationOpen, onLogOut }) {
  return (
    <nav
      style={getStyle(notificationOpen, scrolling.scrollTop)}
      className={style.navbar}
    >
      <AppBrand />
      {danger ? <div className={style.messageDanger}>{danger}</div> : null}
      <div className={style.menu}>
        <a className={style.logoutLink} onClick={onLogOut}>
          {intl.formatMessage(messages.logOut)}
        </a>
      </div>
    </nav>
  );
}

Header.propTypes = {
  intl: intlShape.isRequired,
  onLogOut: T.func.isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

const Connect = connect(mapStateToProps);

export default compose(injectIntl, Connect)(Header);
