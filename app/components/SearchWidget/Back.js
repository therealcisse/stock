import React from 'react';

import style from './SearchWidget.scss';

export default function Back({ onClick }) {
  return (
    <div onClick={onClick} className={style['ipifLD']}>
      <div className={style['fSDZOA']}>
        <span className={style['eOtRwA']}>
          <div className={style['kLXFVe']}>
            <span style={{}}>{BackSVG}</span>
          </div>
        </span>
      </div>
    </div>
  );
}

const BackSVG = (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    style={{
      height: 24,
      maxHeight: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      verticalAlign: 'bottom',
      width: 24,
    }}
  >
    <path
      d="M10.297 4.292L3.298 11.29a.998.998 0 0 0-.298.712c0 .257.097.514.291.71.003 0 .006.002.008.004l6.995 6.995a1 1 0 0 0 1.414-1.414l-5.294-5.295H20c.55 0 1-.45 1-1 0-.549-.45-.998-1-.998H6.414l5.297-5.298a1.003 1.003 0 0 0 0-1.415 1 1 0 0 0-.708-.29.994.994 0 0 0-.706.29z"
      fill="currentColor"
      fillRule="evenodd"
      role="presentation"
    />
  </svg>
);
