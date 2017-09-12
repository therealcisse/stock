import React from 'react';
import T from 'prop-types';
import classNames from 'classnames';
import Button from 'components/bootstrap/Button';
import SafeAnchor from 'components/bootstrap/SafeAnchor';

import { bsClass as setBsClass } from '../utils/bootstrapUtils';

import getLocalCSSClassName from '../utils/getLocalCSSClassName';
import style from './Dropdown.scss';

const propTypes = {
  open: T.bool,
  title: T.string,
  noCaret: T.bool,
  useAnchor: T.bool,
};

const defaultProps = {
  open: false,
  noCaret: true,
  useAnchor: false,
  bsRole: 'toggle',
};

class DropdownToggle extends React.Component {
  render() {
    const {
      open,
      useAnchor,
      bsClass,
      className,
      noCaret,
      children,
      ...remainingProps
    } = this.props;

    delete remainingProps.bsRole;

    const Component = useAnchor ? SafeAnchor : Button;

    // This intentionally forwards bsSize and bsStyle (if set) to the
    // underlying component, to allow it to render size and style variants.

    // FIXME: Should this really fall back to `title` as children?

    return (
      <Component
        {...remainingProps}
        role="button"
        className={classNames(
          className,
          noCaret && style.noCaret,
          getLocalCSSClassName(style, bsClass),
        )}
        aria-haspopup
        aria-expanded={open}
      >
        {children || remainingProps.title}
      </Component>
    );
  }
}

DropdownToggle.propTypes = propTypes;
DropdownToggle.defaultProps = defaultProps;

export default setBsClass('dropdown-toggle', DropdownToggle);
