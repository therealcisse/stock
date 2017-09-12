import React from 'react';
import T from 'prop-types';

export default function NavLeft({ size, color }) {
  return (
    <svg
      fill={color}
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );
}

NavLeft.propTypes = {
  color: T.string,
  size: T.number.isRequired,
};

NavLeft.defaultProps = {
  color: 'currentColor',
};
