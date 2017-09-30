import React from 'react';
import T from 'prop-types';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { logOut } from 'redux/reducers/user/actions';

import style from 'routes/Sales/styles';

import SideMenu from 'components/SideMenu';

import selector from './selector';

import messages from 'routes/Sales/messages';

import Title from 'components/Title';

import { PATH_SALES, APP_NAME } from 'vars';

import { injectIntl } from 'react-intl';

import PageHeader from './PageHeader';

import PageBody from './PageBody';

export class HomeContainer extends React.Component {
  getChildContext() {
    return {
      currentUser: this.props.user,
    };
  }
  render() {
    const { intl, user, actions } = this.props;
    return (
      <div className={style.root}>
        <Title
          title={intl.formatMessage(messages.title, { appName: APP_NAME })}
        />
        <SideMenu
          intl={intl}
          user={user}
          selectedItem={PATH_SALES}
          onLogOut={actions.logOut}
        />
        <div className={style.page}>
          <PageHeader />
          <PageBody />
        </div>
      </div>
    );
  }
}

HomeContainer.propTypes = {};

HomeContainer.childContextTypes = {
  currentUser: T.object.isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ logOut }, dispatch) };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(injectIntl, Connect)(HomeContainer);
