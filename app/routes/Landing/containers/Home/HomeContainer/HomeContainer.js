import React from 'react';
import T from 'prop-types';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { logOut } from 'redux/reducers/user/actions';

import style from 'routes/Landing/styles';

import Header from 'routes/Landing/containers/Header';

import Fade from 'components/Transition/Fade';

import selector from './selector';

export class HomeContainer extends React.PureComponent {
  getChildContext() {
    return {
      currentUser: this.props.user,
    };
  }
  render() {
    const { user, actions } = this.props;
    return (
      <Fade in appear>
        <div className={style.root}>
          <Header user={user} onLogOut={actions.logOut} />
        </div>
      </Fade>
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

export default compose(Connect)(HomeContainer);
