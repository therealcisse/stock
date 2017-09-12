import React from 'react';
import T from 'prop-types';

export default function Grid({ size, color }) {
  return (
    <svg
      fill={color}
      height={size}
      viewBox="0 0 20 20"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1,8h7v-6H1V8z M12,2v6h7v-6H12z M1,18h7v-6H1V18z M12,18h7v-6h-7    V18z"
      />
    </svg>
  );
}

Grid.propTypes = {
  color: T.string,
  size: T.number.isRequired,
};

Grid.defaultProps = {
  color: 'currentColor',
};
