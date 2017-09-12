import React from 'react';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { injectIntl, intlShape } from 'react-intl';

import style from 'routes/Settings/styles';

import Header from 'routes/Settings/components/Header';
import Sidebar from 'routes/Settings/components/Sidebar';

import { logOut } from 'redux/reducers/user/actions';

import { createSelector } from 'utils/reselect';

import * as selectors from 'redux/reducers/user/selectors';

import messages from 'routes/Settings/messages';

import Title from 'components/Title';

import { APP_NAME } from 'vars';

import ChangePasswordForm from './ChangePasswordForm';

function ChangePasswordContainer({ intl, user, actions }) {
  return (
    <div className={style.root}>
      <Title title={intl.formatMessage(messages.title, { appName: APP_NAME })} />
      <Header
        danger={
          user && user.changePasswordAtNextLogin ? (
            intl.formatMessage(messages.changePasswordAtNextLogin)
          ) : null
        }
        onLogOut={actions.logOut}
      />
      <Sidebar user={user} selectedMenuItem={'security.change_password'} />
      <ChangePasswordForm intl={intl} />
    </div>
  );
}

ChangePasswordContainer.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = createSelector(selectors.user, user => ({ user }));

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ logOut }, dispatch) };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(injectIntl, Connect)(ChangePasswordContainer);
