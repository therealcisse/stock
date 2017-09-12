import contains from 'dom-helpers/query/contains';
import React from 'react';
import T from 'prop-types';
import ReactDOM from 'react-dom';

import addEventListener from 'utils/lib/DOM/addEventListener';
import ownerDocument from '../utils/ownerDocument';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

export default class RootCloseWrapper extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.preventMouseRootClose = false;
  }

  componentDidMount() {
    if (!this.props.disabled) {
      this.addEventListeners();
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.disabled && prevProps.disabled) {
      this.addEventListeners();
    } else if (this.props.disabled && !prevProps.disabled) {
      this.removeEventListeners();
    }
  }

  componentWillUnmount() {
    if (!this.props.disabled) {
      this.removeEventListeners();
    }
  }

  addEventListeners() {
    const { event } = this.props;
    const doc = ownerDocument(this);

    // Use capture for this listener so it fires before React's listener, to
    // avoid false positives in the contains() check below if the target DOM
    // element is removed in the React mouse callback.
    this.documentMouseCaptureListener = addEventListener(
      doc,
      event,
      this.handleMouseCapture,
      true,
    );

    this.documentMouseListener = addEventListener(doc, event, this.handleMouse);

    this.documentKeyupListener = addEventListener(
      doc,
      'keyup',
      this.handleKeyUp,
    );
  }

  removeEventListeners() {
    if (this.documentMouseCaptureListener) {
      this.documentMouseCaptureListener.remove();
    }

    if (this.documentMouseListener) {
      this.documentMouseListener.remove();
    }

    if (this.documentKeyupListener) {
      this.documentKeyupListener.remove();
    }
  }

  handleMouseCapture = e => {
    this.preventMouseRootClose =
      isModifiedEvent(e) ||
      !isLeftClickEvent(e) ||
      contains(ReactDOM.findDOMNode(this), e.target) ||
      this.props.preventMouseRootClose(e);
  };

  handleMouse = () => {
    if (!this.preventMouseRootClose && this.props.onRootClose) {
      this.props.onRootClose();
    }
  };

  handleKeyUp = e => {
    if (e.keyCode === 27 && this.props.onRootClose) {
      this.props.onRootClose();
    }
  };

  render() {
    return this.props.children;
  }
}

RootCloseWrapper.displayName = 'RootCloseWrapper';

RootCloseWrapper.propTypes = {
  onRootClose: T.func,
  preventMouseRootClose: T.func,
  children: T.element,

  /**
   * Disable the the RootCloseWrapper, preventing it from triggering
   * `onRootClose`.
   */
  disabled: T.bool,
  /**
   * Choose which document mouse event to bind to
   */
  event: T.oneOf(['click', 'mousedown']),
};

RootCloseWrapper.defaultProps = {
  event: 'click',
  preventMouseRootClose(e) {
    let el = e.target;
    try {
      while (el !== document.body && el !== document) {
        if (el.hasAttribute('data-root-close-ignore')) {
          return true;
        }
        el = el.parentNode;
      }
    } catch (e) {}

    return false;
  },
};
