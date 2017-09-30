import React from 'react';
import T from 'prop-types';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { logOut } from 'redux/reducers/user/actions';

import style from 'routes/Landing/styles';

import SideMenu from 'components/SideMenu';

import selector from './selector';

import { injectIntl } from 'react-intl';

export class HomeContainer extends React.Component {
  getChildContext() {
    return {
      currentUser: this.props.user,
    };
  }
  render() {
    const { intl, user, actions, ...props } = this.props;

    return (
      <div className={style.root}>
        <SideMenu intl={intl} user={user} onLogOut={actions.logOut} />
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
