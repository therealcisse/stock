import React from 'react';
import T from 'prop-types';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { injectIntl, intlShape } from 'react-intl';

import { logOut } from 'redux/reducers/user/actions';

import { createSelector } from 'utils/reselect';

import * as selectors from 'redux/reducers/user/selectors';

import style from 'routes/Settings/styles';

import Header from 'routes/Settings/components/Header';
import Sidebar from 'routes/Settings/components/Sidebar';

import messages from 'routes/Settings/messages';

import Title from 'components/Title';

import { APP_NAME } from 'vars';

import AccountSettingsForm from './AccountSettingsForm';

function AccountSettingsContainer({ intl, user, actions }) {
  return (
    <div className={style.root}>
      <Title title={intl.formatMessage(messages.title, { appName: APP_NAME })} />
      <Header onLogOut={actions.logOut} />
      <Sidebar user={user} selectedMenuItem={'account.settings'} />
      <AccountSettingsForm
        intl={intl}
        initialValues={{
          email: user.email,
          displayName: user.displayName,
        }}
      />
    </div>
  );
}

AccountSettingsContainer.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = createSelector(selectors.user, user => ({ user }));

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ logOut }, dispatch) };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(injectIntl, Connect)(AccountSettingsContainer);
