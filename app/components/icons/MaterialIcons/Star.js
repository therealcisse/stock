import React from 'react';
import T from 'prop-types';

const Star = {};

function Empty({ size, color }) {
  return (
    <svg
      fill={color}
      height={size}
      viewBox="0 0 48 48"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );
}

function Full({ size, color }) {
  return (
    <svg
      fill={color}
      height={size}
      viewBox="0 0 48 48"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );
}

function Half({ size, color }) {
  return (
    <svg
      fill={color}
      height={size}
      viewBox="0 0 48 48"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs
        dangerouslySetInnerHTML={{
          __html: `<path d='M0 0h24v24H0V0z' id='a'/>`,
        }}
      />
      <clipPath
        id="b"
        dangerouslySetInnerHTML={{
          __html: `<use overflow='visible' xlink:href='#a'/>`,
        }}
      />
      <path
        clipPath="url(#b)"
        d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"
      />
    </svg>
  );
}

Full.propTypes = Half.propTypes = Empty.propTypes = {
  color: T.string,
  size: T.number.isRequired,
};

Full.defaultProps = Half.defaultProps = Empty.defaultProps = {
  color: 'currentColor',
};

export default { Empty, Full, Half };
