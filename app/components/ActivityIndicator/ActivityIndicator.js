import React from 'react';
import T from 'prop-types';

import objectAssign from 'object-assign';

import style from './ActivityIndicator.scss';

export default function ActivityIndicator({
  animating,
  color,
  hidesWhenStopped,
  size,
  style,
  ...other
}) {
  return (
    <div
      {...other}
      accessibilityRole="progressbar"
      aria-valuemax="1"
      aria-valuemin="0"
      style={objectAssign(
        styles.container,
        typeof size === 'number' && { height: size, width: size },
      )}
    >
      <div
        style={objectAssign(
          indicatorSizes[size] || { width: size, height: size },
          styles.animation,
          !animating && styles.animationPause,
          !animating && hidesWhenStopped && styles.hidesWhenStopped,
        )}
      >
        <svg height="100%" viewBox="0 0 32 32" width="100%">
          <circle
            cx="16"
            cy="16"
            fill="none"
            r="14"
            strokeWidth="4"
            style={{
              stroke: color,
              opacity: 0.2,
            }}
          />
          <circle
            cx="16"
            cy="16"
            fill="none"
            r="14"
            strokeWidth="4"
            style={{
              stroke: color,
              strokeDasharray: 80,
              strokeDashoffset: 60,
            }}
          />
        </svg>
      </div>
    </div>
  );
}
ActivityIndicator.propTypes = {
  animating: T.bool,
  color: T.string,
  hidesWhenStopped: T.bool,
  size: T.oneOfType([T.oneOf(['small', 'large']), T.number]),
};

ActivityIndicator.defaultProps = {
  animating: true,
  color: '#1976D2',
  hidesWhenStopped: true,
  size: 'small',
};

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  hidesWhenStopped: {
    visibility: 'hidden',
  },
  animation: {
    animationDuration: '0.75s',
    animationName: style.ActivityIndicatorAnimation,
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
  animationPause: {
    animationPlayState: 'paused',
  },
};

const indicatorSizes = {
  small: {
    width: 20,
    height: 20,
  },
  large: {
    width: 36,
    height: 36,
  },
};
