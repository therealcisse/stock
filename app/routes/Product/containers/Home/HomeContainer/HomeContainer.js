import React from 'react';
import T from 'prop-types';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { logOut } from 'redux/reducers/user/actions';

import style from 'routes/Product/styles';

import messages from 'routes/Product/messages';

import Title from 'components/Title';

import SideMenu from 'components/SideMenu';

import selector from './selector';

import { PATH_PRODUCTS, APP_NAME } from 'vars';

import { injectIntl } from 'react-intl';

import Page from './Page';

export class HomeContainer extends React.Component {
  getChildContext() {
    return {
      currentUser: this.props.user,
    };
  }
  render() {
    const { intl, user, actions, match } = this.props;
    return (
      <div className={style.root}>
        <Title
          title={intl.formatMessage(messages.title, { appName: APP_NAME })}
        />
        <SideMenu
          intl={intl}
          user={user}
          selectedItem={PATH_PRODUCTS}
          onLogOut={actions.logOut}
        />
        <Page id={match.params.id} />
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
