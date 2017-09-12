import React from 'react';
import T from 'prop-types';

export default function DownArrow({ size, color }) {
  return (
    <svg
      fill={color}
      height={size}
      viewBox="0 0 48 48"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="none" d="M0 0h48v48H0V0z" />
      <path d="M40 24l-2.82-2.82L26 32.34V8h-4v24.34L10.84 21.16 8 24l16 16 16-16z" />
    </svg>
  );
}

DownArrow.propTypes = {
  color: T.string,
  size: T.number.isRequired,
};

DownArrow.defaultProps = {
  color: 'currentColor',
};
