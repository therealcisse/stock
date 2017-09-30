import React from 'react';
import T from 'prop-types';
import Link from 'react-router-dom/Link';

import { connect } from 'react-redux';

import { compose } from 'redux';

import {
  PATH_SETTINGS_BASE,
  PATH_SETTINGS_ACCOUNT,
  PATH_SETTINGS_CHANGE_PASSWORD,
  PATH_SETTINGS_BUSINESS_DETAILS,
  PATH_SETTINGS_CHANGE_EMAIL,
} from 'vars';

import { createSelector } from 'utils/reselect';

import { intlShape, injectIntl } from 'react-intl';

import messages from 'routes/Settings/messages';

import cx from 'classnames';

import style from 'routes/Settings/styles';

const scrollingSelector = state => state.get('scrolling');
const notificationOpenSelector = state =>
  state.getIn(['notification', 'options']).active;

const selector = createSelector(
  scrollingSelector,
  notificationOpenSelector,
  (scrolling, notificationOpen) => ({ scrolling, notificationOpen }),
);

const NAVBAR_HEIGHT = 61;
const NOTIFICATION_HEIGHT = 45;

const DEFAULT_TOP = NAVBAR_HEIGHT;

const getStyle = (notificationOpen, scrollTop) =>
  notificationOpen
    ? {
        top: scrollTop === 0 ? DEFAULT_TOP + NOTIFICATION_HEIGHT : DEFAULT_TOP,
        height: `calc(100% - ${NAVBAR_HEIGHT} - ${NOTIFICATION_HEIGHT})`,
      }
    : {};

export function Sidebar({
  intl,
  user,
  selectedMenuItem,
  scrolling,
  notificationOpen,
}) {
  return (
    <div
      style={getStyle(notificationOpen, scrolling.scrollTop)}
      className={style.sidebar}
    >
      {/* General section */}
      <h1 className={style.heading}>
        {intl.formatMessage(messages.headingGeneral)}
      </h1>
      <ul>
        <li
          className={cx({
            [style.selected]: selectedMenuItem === 'account.settings',
          })}
        >
          <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_ACCOUNT}>
            {intl.formatMessage(messages.linkAccountSettings)}
          </Link>
        </li>
        <li
          className={cx({
            [style.selected]: selectedMenuItem === 'account.change_email',
          })}
        >
          <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_CHANGE_EMAIL}>
            {intl.formatMessage(messages.linkChangeEmail)}
          </Link>
        </li>
      </ul>

      <hr />

      {/* Security section */}
      <h1 className={style.heading}>
        {intl.formatMessage(messages.headingSecurity)}
      </h1>
      <ul>
        <li
          className={cx({
            [style.selected]: selectedMenuItem === 'security.change_password',
          })}
        >
          <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_CHANGE_PASSWORD}>
            {intl.formatMessage(messages.linkChangePassword)}
          </Link>
        </li>
      </ul>

      {/* Business settings */}
      {user ? (
        [
          <hr key="divider" />,
          <h1 key="business.title" className={style.heading}>
            {intl.formatMessage(messages.headingBusiness)}
          </h1>,
          <ul key="business.links">
            <li
              className={cx({
                [style.selected]: selectedMenuItem === 'business.settings',
              })}
            >
              <Link
                to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_DETAILS}
              >
                {intl.formatMessage(messages.linkBusinessDetails)}
              </Link>
            </li>
          </ul>,
        ]
      ) : null}
    </div>
  );
}

Sidebar.propTypes = {
  intl: intlShape.isRequired,
  selectedMenuItem: T.oneOf([
    'account.settings',
    'account.change_email',
    'security.change_password',
    'business.settings',
  ]).isRequired,
  user: T.object.isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

const Connect = connect(mapStateToProps);

export default compose(injectIntl, Connect)(Sidebar);
