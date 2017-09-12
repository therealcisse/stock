import React from 'react';
import T from 'prop-types';

export default function Download({ size, color }) {
  return (
    <svg
      fill={color}
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );
}

Download.propTypes = {
  color: T.string,
  size: T.number.isRequired,
};

Download.defaultProps = {
  color: 'currentColor',
};
