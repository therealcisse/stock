import React from 'react';
import T from 'prop-types';

function Blank({ size, color, className, onClick }) {
  return (
    <svg
      onClick={onClick}
      className={className}
      fill={color}
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );
}

function Indeterminate({ size, color, className, onClick }) {
  return (
    <svg
      onClick={onClick}
      className={className}
      fill={color}
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <path d="M0 0h24v24H0z" id="a" />
      </defs>
      <clipPath
        id="b"
        dangerouslySetInnerHTML={{
          __html: `<use overflow='visible' xlink:href='#a'/>`,
        }}
      />
      <path
        clipPath="url(#b)"
        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"
      />
    </svg>
  );
}

function Checked({ size, color, className, onClick }) {
  return (
    <svg
      onClick={onClick}
      className={className}
      fill={color}
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

Checked.propTypes = Blank.propTypes = Indeterminate.propTypes = {
  color: T.string,
  size: T.number.isRequired,
};

Checked.defaultProps = Blank.defaultProps = Indeterminate.defaultProps = {
  color: 'currentColor',
};

export default { Blank, Indeterminate, Checked };
