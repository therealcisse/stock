import React from 'react';
import Link from 'react-router-dom/Link';

import AppLogo from 'components/AppLogo';

import style from './AppBrand.scss';

export default function AppBrand({}) {
  return (
    <Link className={style.appBrand} to={'/'}>
      <AppLogo width={36} height={36} />
    </Link>
  );
}
