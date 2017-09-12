import React from 'react';
import T from 'prop-types';

export default function Watch({ size, color, className }) {
  return (
    <svg
      className={className}
      fill={color}
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <path d="M0 0h24v24H0V0z" id="a" />
      </defs>
      <clipPath
        id="b"
        dangerouslySetInnerHTML={{
          __html: `<use overflow='visible' xlink:href='#a'/>`,
        }}
      />
      <path
        clipPath="url(#b)"
        d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"
      />
    </svg>
  );
}

Watch.propTypes = {
  color: T.string,
  size: T.number.isRequired,
};

Watch.defaultProps = {
  color: 'currentColor',
};
