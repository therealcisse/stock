import React from 'react';
import T from 'prop-types';

export default function Home({ size, color }) {
  return (
    <svg
      fill={color}
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );
}

Home.propTypes = {
  color: T.string,
  size: T.number.isRequired,
};

Home.defaultProps = {
  color: 'currentColor',
};
