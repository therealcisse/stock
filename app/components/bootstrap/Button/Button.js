import classNames from 'classnames';
import React from 'react';
import T from 'prop-types';
import elementType from 'react-prop-types/lib/elementType';

import {
  bsClass,
  bsSizes,
  bsStyles,
  getClassSet,
  prefix,
  splitBsProps,
} from '../utils/bootstrapUtils';
import { Size, State, Style } from '../utils/StyleConfig';

import SafeAnchor from 'components/bootstrap/SafeAnchor';

import getLocalCSSClassName from '../utils/getLocalCSSClassName';
import style from './Button.scss';

const propTypes = {
  active: T.bool,
  disabled: T.bool,
  block: T.bool,
  onClick: T.func,
  componentClass: elementType,
  href: T.string,
  /**
   * Defines HTML button type attribute
   * @defaultValue 'button'
   */
  type: T.oneOf(['button', 'reset', 'submit']),
};

const defaultProps = {
  active: false,
  block: false,
  disabled: false,
};

class Button extends React.Component {
  renderAnchor(elementProps, className) {
    return (
      <SafeAnchor
        {...elementProps}
        className={classNames(
          className,
          elementProps.disabled && getLocalCSSClassName(style, 'disabled'),
        )}
      />
    );
  }

  renderButton({ componentClass, ...elementProps }, className) {
    const Component = componentClass || 'button';

    return (
      <Component
        {...elementProps}
        type={elementProps.type || 'button'}
        className={className}
      />
    );
  }

  render() {
    const { active, block, className, ...props } = this.props;
    const [bsProps, elementProps] = splitBsProps(props);

    const classes = {
      ...getClassSet(style, bsProps),
      [getLocalCSSClassName(style, 'active')]: active,
      [getLocalCSSClassName(style, prefix(bsProps, 'block'))]: block,
    };
    const fullClassName = classNames(className, classes);

    if (elementProps.href) {
      return this.renderAnchor(elementProps, fullClassName);
    }

    return this.renderButton(elementProps, fullClassName);
  }
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default bsClass(
  'btn',
  bsSizes(
    [Size.LARGE, Size.SMALL, Size.XSMALL],
    bsStyles(
      [...Object.values(State), Style.SECONDARY, Style.PRIMARY, Style.LINK],
      Button,
    ),
  ),
);
