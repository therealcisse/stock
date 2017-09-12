import React from 'react';
import T from 'prop-types';

export default function ArrowDropdown({ size, color }) {
  return (
    <svg
      fill={color}
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 10l5 5 5-5z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );
}

ArrowDropdown.propTypes = {
  color: T.string,
  size: T.number.isRequired,
};

ArrowDropdown.defaultProps = {
  color: 'currentColor',
};
