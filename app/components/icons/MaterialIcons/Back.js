import React from 'react';
import T from 'prop-types';

export default function Back({ size, color }) {
  return (
    <svg
      fill={color}
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
  );
}

Back.propTypes = {
  color: T.string,
  size: T.number.isRequired,
};

Back.defaultProps = {
  color: 'currentColor',
};
