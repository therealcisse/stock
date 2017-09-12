import React from 'react';
import T from 'prop-types';

export default function Import({ size, color, className }) {
  return (
    <svg
      className={className}
      fill={color}
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
    </svg>
  );
}

Import.propTypes = {
  color: T.string,
  size: T.number.isRequired,
};

Import.defaultProps = {
  color: 'currentColor',
};
