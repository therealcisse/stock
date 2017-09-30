import React from 'react';

import { APP_NAME } from 'vars';

import style from './SideMenu.scss';

import Logo from './Logo';
import TopContainer from './TopContainer';
import BottomContainer from './BottomContainer';
import NavigationContainer from './NavigationContainer';

export default function SideMenu({
  loading = false,
  intl,
  user,
  onLogOut,
  selectedItem,
}) {
  if (loading) {
    return (
      <div className={style.menu} data-is-closed>
        <nav className={style['nav']}>
          <div className={style['nav--left']}>
            <div className={style['nav--left-top']}>
              <ul className={style['nav--items']}>
                <li />
                <li />
                <li />
                <li className={style['icon']} />
                <li className={style['icon-sub']} />
                <li className={style['icon-sub']} />
                <li className={style['icon-sub']} />
                <li className={style['icon-sub']} />
                <li className={style['icon-sub']} />
                <li className={style['icon-sub']} />
              </ul>
            </div>
            <div className={style['nav--left-bottom']}>
              <div className={style['nav--left-bottom-wrapper']}>
                <div className={style['nav--item-help']} />
                <div className={style['nav--item-profile']} />
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div
      className={style.menu2}
      data-is-closed
      data-global-appearance
      data-resolved
    >
      <div>
        <div>
          <div style={{ width: 64 }}>
            <div className={style['bZuPrG']}>
              <div className={style['euVEHb']}>
                <div className={style['ketCUk']}>
                  <div className={style['LbHYk']}>
                    <div className={style['bmpwdQ']}>
                      <Logo />
                      <TopContainer />
                    </div>
                  </div>

                  <br className={style['bLlyaX']} />

                  <NavigationContainer selectedItem={selectedItem} />

                  <BottomContainer user={user} onLogOut={onLogOut} intl={intl} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
