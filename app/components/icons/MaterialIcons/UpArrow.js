import React from 'react';
import T from 'prop-types';

export default function UpArrow({ size, color }) {
  return (
    <svg
      fill={color}
      height={size}
      viewBox="0 0 48 48"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="none" d="M0 0h48v48H0V0z" />
      <path d="M8 24l2.83 2.83L22 15.66V40h4V15.66l11.17 11.17L40 24 24 8 8 24z" />
    </svg>
  );
}

UpArrow.propTypes = {
  color: T.string,
  size: T.number.isRequired,
};

UpArrow.defaultProps = {
  color: 'currentColor',
};
