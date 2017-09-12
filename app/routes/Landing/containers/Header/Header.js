import React from 'react';
import T from 'prop-types';
import { Link } from 'react-router-dom';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AppBrand from 'components/AppBrand';

import messages from 'routes/Landing/messages';

import style from 'routes/Landing/styles';

import { injectIntl, intlShape } from 'react-intl';

import MenuItem from 'components/bootstrap/MenuItem';
import Button from 'components/bootstrap/Button';

import { PATH_SETTINGS_BASE, PATH_CASES } from 'vars';

import ProfileButton, { MenuItem as ProfileMenuItem } from 'components/Profile';

import { PlusIcon, NavLeftIcon } from 'components/icons/MaterialIcons';

import selector from './selector';

import emptyObject from 'emptyObject';

const styles = {
  show: (notificationOpen, scrollTop) => ({
    top: notificationOpen && scrollTop === 0 ? NOTIFICATION_HEIGHT : 0,
  }),
};

const MIN_HEIGHT = 200;
const MIN_SCROLL_UP_DELTA = 18.5;

const NOTIFICATION_HEIGHT = 45;

class Header extends React.Component {
  state = {
    show: true,
  };

  componentWillReceiveProps(nextProps) {
    const { scrollTop, lastScrollTop } = nextProps.scrolling;
    if (
      this.props.scrolling.scrollTop !== scrollTop ||
      this.props.scrolling.lastScrollTop !== lastScrollTop
    ) {
      if (scrollTop > lastScrollTop) {
        // downscroll code
        if (scrollTop >= MIN_HEIGHT && this.state.show === true) {
          this.setState({
            show: false,
          });
        }
      } else {
        // upscroll code
        if (
          Math.abs(lastScrollTop - scrollTop) >= MIN_SCROLL_UP_DELTA &&
          this.state.show === false
        ) {
          this.setState({
            show: true,
          });
        }
      }
    }
  }
  render() {
    const {
      id,
      notificationOpen,
      scrolling,
      searching,
      intl,
      user,
      onLogOut,
      app,
      actions,
    } = this.props;
    return (
      <nav
        style={
          this.state.show || searching ? (
            styles.show(notificationOpen, scrolling.scrollTop)
          ) : (
            emptyObject
          )
        }
        className={style.navbar}
      >
        <div className={style.leftNav}>
          <AppBrand />
        </div>

        <div className={style.middleNav} />

        <div className={style.rightNav}>
          <ProfileButton user={user}>
            <MenuItem componentClass={ProfileMenuItem} user={user} />
            <MenuItem componentClass={Link} to={PATH_SETTINGS_BASE}>
              {intl.formatMessage(messages.manageAccount)}
            </MenuItem>
            <MenuItem divider />
            <MenuItem onClick={onLogOut}>
              {intl.formatMessage(messages.logOut)}
            </MenuItem>
          </ProfileButton>
        </div>
      </nav>
    );
  }
}

Header.propTypes = {
  intl: intlShape.isRequired,
  onLogOut: T.func.isRequired,
  user: T.shape({
    displayName: T.string.isRequired,
    email: T.string,
  }),
  app: T.shape({
    alertsOpen: T.bool.isRequired,
  }),
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({}, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(injectIntl, Connect)(Header);
