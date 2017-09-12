import classNames from 'classnames';
import React from 'react';
import T from 'prop-types';

import all from 'react-prop-types/lib/all';

import Button from 'components/bootstrap/Button';
import {
  bsClass,
  getClassSet,
  prefix,
  splitBsProps,
} from '../utils/bootstrapUtils';

import getLocalCSSClassName from '../utils/getLocalCSSClassName';
import style from './ButtonGroup.scss';

const propTypes = {
  vertical: T.bool,
  justified: T.bool,

  /**
   * Display block buttons; only useful when used with the 'vertical' prop.
   * @type {bool}
   */
  block: all(
    T.bool,
    ({ block, vertical }) =>
      block && !vertical
        ? new Error('`block` requires `vertical` to be set to have any effect')
        : null,
  ),
};

const defaultProps = {
  block: false,
  justified: false,
  vertical: false,
};

class ButtonGroup extends React.Component {
  render() {
    const {
      block,
      justified,
      vertical,
      className,
      ...remainingProps
    } = this.props;
    const [bsProps, elementProps] = splitBsProps(remainingProps);

    const classes = {
      ...getClassSet(style, bsProps),
      [getLocalCSSClassName(style, prefix(bsProps))]: !vertical,
      [getLocalCSSClassName(style, prefix(bsProps, 'vertical'))]: vertical,
      [getLocalCSSClassName(style, prefix(bsProps, 'justified'))]: justified,

      // this is annoying, since the class is `btn-block` not `btn-group-block`
      [getLocalCSSClassName(style, prefix(Button.defaultProps, 'block'))]: block,
    };

    return <div {...elementProps} className={classNames(className, classes)} />;
  }
}

ButtonGroup.propTypes = propTypes;
ButtonGroup.defaultProps = defaultProps;

export default bsClass('btn-group', ButtonGroup);
