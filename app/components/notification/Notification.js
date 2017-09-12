import React from 'react';
import T from 'prop-types';
import { bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import cx from 'classnames';

import selector from './selector';

import style from './Notification.scss';

import BusinessRequired from './BusinessRequired';

import { remove } from 'redux/reducers/notification/actions';

class Notification extends React.Component {
  constructor() {
    super();

    this.onClose = this.onClose.bind(this);
  }

  /**
   * Component update optimization.
   * @param  {Object} nextProps
   * @param  {Object} nextState
   * @return {Boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    // ### id
    // Check if a new id has been requested.

    const curId = this.props.notification.id;
    const nxtId = nextProps.notification.id;

    if (nxtId !== curId) {
      return true;
    }

    // ### Animation
    // Check if a new animation sequence has been requested.

    const curAnim = this.props.notification.animation;
    const nxtAnim = nextProps.notification.animation;

    if (nxtAnim !== curAnim) {
      return true;
    }

    // ### Active
    // Check if active has changed.

    const curActive = this.props.notification.options.active;
    const nxtActive = nextProps.notification.options.active;

    if (nxtActive !== curActive) {
      return true;
    }

    // ### scrollTop
    // Check if scrollTop has changed.

    const curScrollTop = this.props.scrollTop;
    const nxtScrollTop = nextProps.scrollTop;

    if (nxtScrollTop !== curScrollTop) {
      return true;
    }

    return false;
  }

  /**
   * Remove the relay subscription when the component unmounts.
   * @return {Void}
   */
  componentWillUnmount() {}

  /**
   * Returns the current class names for the notification.
   * @return {String}
   */
  getClass() {
    const { notification: { animation } } = this.props;
    return cx({
      [style.notification]: true,
      [style.animated]: !!animation,
      [style[animation]]: !!animation,
    });
  }

  onClose() {
    this.props.actions.remove();
  }

  /**
   * Renders the notification components.
   * @return {Object}
   */
  render() {
    const { notification, scrollTop, hidden } = this.props;
    const { id, options: { active } } = notification;
    if (scrollTop === 0 && active && !hidden) {
      switch (id) {
        case 'BusinessRequired':
          return <BusinessRequired className={this.getClass()} />;
        default:
          return null;
      }
    }
    return null;
  }
}

Notification.propTypes = {
  notification: T.shape({
    id: T.any,
    options: T.shape({
      active: T.bool.isRequired,
    }).isRequired,
  }).isRequired,
  hidden: T.bool.isRequired,
};

Notification.defaultProps = {
  hidden: false,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ remove }, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
