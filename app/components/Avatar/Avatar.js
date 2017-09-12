import React from 'react';
import T from 'prop-types';

import assign from 'object-assign';

const defaultColors = [
  '#d73d32',
  '#7e3794',
  '#4285f4',
  '#67ae3f',
  '#d61a7f',
  '#ff4080',

  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
  '#795548',
  '#607d8b',

  // 'red',
  // 'pink',
  // 'purple',
  // 'deep-purple',
  // 'indigo',
  // 'blue',
  // 'light-blue',
  // 'cyan',
  // 'teal',
  // 'green',
  // 'light-green',
  // 'lime',
  // 'yellow',
  // 'amber',
  // 'orange',
  // 'deep-orange',
  // 'brown',
  // 'grey',
  // 'blue-grey',
];

function getRandomColor(value, colors = defaultColors) {
  // if no value is passed, always return transparent color otherwise
  // a rerender would show a new color which would will
  // give strange effects when an interface is loading
  // and gets rerendered a few consequent times
  if (!value) return 'transparent';

  // value based random color index
  // the reason we don't just use a random number is to make sure that
  // a certain value will always get the same color assigned given
  // a fixed set of colors
  const sum = _stringAsciiCodeSum(value);
  const colorIndex = sum % colors.length;
  return colors[colorIndex];
}

function _stringAsciiCodeSum(value) {
  return [...value]
    .map(letter => letter.charCodeAt(0))
    .reduce((current, previous) => previous + current);
}

function getStyles(props) {
  const {
    backgroundColor = getRandomColor(props.children),
    color,
    square,
    size,
    textSizeRatio,
  } = props;

  const styles = {
    root: {
      color,
      backgroundColor,
      userSelect: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      font:
        Math.floor(
          typeof size === 'number'
            ? size / textSizeRatio
            : Avatar.defaultProps.size / textSizeRatio,
        ) + 'px Helvetica, Arial, sans-serif',
      fontWeight: 'bolder',
      borderRadius: square ? 0 : '50%',
      textTransform: 'uppercase',
      height: size,
      width: size,
    },
    icon: {
      color,
      width: size * 0.6,
      height: size * 0.6,
      fontSize: size * 0.6,
      margin: size * 0.2,
    },
  };

  return styles;
}

export default class Avatar extends React.Component {
  static propTypes = {
    /**
     * The backgroundColor of the avatar. Does not apply to image avatars.
     */
    backgroundColor: T.string,
    /**
     * Can be used, for instance, to render a letter inside the avatar.
     */
    children: T.node,
    /**
     * The css class name of the root `div` or `img` element.
     */
    className: T.string,
    /**
     * The icon or letter's color.
     */
    color: T.string,
    /**
     * This is the SvgIcon or FontIcon to be used inside the avatar.
     */
    icon: T.element,
    /**
     * This is the size of the avatar in pixels.
     */
    size: T.number,
    /**
     * If passed in, this component will render an img element. Otherwise, a div will be rendered.
     */
    src: T.string,
    /**
     * Override the inline-styles of the root element.
     */
    style: T.object,
    /**
     * Display as a square.
     */
    square: T.bool,
    /**
     * Display as a square.
     */
    textSizeRatio: T.number,
  };

  static defaultProps = {
    size: 40,
    color: '#FFF',
    // backgroundColor: '#656565',
    square: false,
    textSizeRatio: 3,
  };

  render() {
    const {
      backgroundColor, // eslint-disable-line no-unused-vars
      icon,
      src,
      style,
      className,
      ...other
    } = this.props;

    const styles = getStyles(this.props);

    if (src) {
      return (
        <img
          style={assign(styles.root, style)}
          {...other}
          src={src}
          className={className}
        />
      );
    } else {
      return (
        <div {...other} style={assign(styles.root, style)} className={className}>
          {icon &&
            React.cloneElement(icon, {
              color: styles.icon.color,
              style: assign(styles.icon, icon.props.style),
            })}
          {this.props.children}
        </div>
      );
    }
  }
}
