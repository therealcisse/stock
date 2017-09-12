import React from 'react';
import T from 'prop-types';

export default function Plus({ size, color }) {
  return (
    <svg
      fill={color}
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );
}

Plus.propTypes = {
  color: T.string,
  size: T.number.isRequired,
};

Plus.defaultProps = {
  color: 'currentColor',
};
