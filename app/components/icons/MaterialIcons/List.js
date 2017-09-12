import React from 'react';
import T from 'prop-types';

export default function List({ size, color }) {
  return (
    <svg
      fill={color}
      height={size}
      viewBox="0 0 20 20"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <rect x={5} y={3} width={14} height={3} />
        <rect x={1} y={3} width={3} height={3} />
        <rect x={5} y={8} width={14} height={3} />
        <rect x={1} y={8} width={3} height={3} />
        <rect x={5} y={13} width={14} height={3} />
        <rect x={1} y={13} width={3} height={3} />
      </g>
    </svg>
  );
}

List.propTypes = {
  color: T.string,
  size: T.number.isRequired,
};

List.defaultProps = {
  color: 'currentColor',
};
