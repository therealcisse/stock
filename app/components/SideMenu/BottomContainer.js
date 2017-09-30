import React from 'react';
import Link from 'react-router-dom/Link';

import ProfileButton from 'material-ui-icons/AccountCircle';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_ACCOUNT } from 'vars';

import messages from './messages';

import style from './SideMenu.scss';

export default function BottomContainer({ intl, user, onLogOut }) {
  return (
    <div className={style['dEthyU']}>
      <div className={style['dZqFkh']}>
        <div>
          <div>
            <Help />
            <Dropdown>
              <Dropdown.Toggle componentClass={Profile} />
              <Dropdown.Menu className={style.profileMenu}>
                <MenuItem componentClass={ProfileMenuItem} user={user} />
                <MenuItem
                  componentClass={Link}
                  to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_ACCOUNT}
                >
                  {intl.formatMessage(messages.manageAccount)}
                </MenuItem>
                <MenuItem divider />
                <MenuItem onClick={onLogOut}>
                  {intl.formatMessage(messages.logOut)}
                </MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
}

function Help({}) {
  return (
    <div className={style['_3yLaBVyvmC6ymEQhWxVizY']}>
      <div>
        <div>
          <div className={style['_1y7V-xTQeUbQ4DDTCHRw-e']}>
            <span tabIndex={0} className={style['cCQAhS']}>
              <span
                style={{
                  display: 'inline-block',
                  lineHeight: 1,
                  width: 24,
                  height: 24,
                  color: 'currentcolor',
                  fill: 'inherit',
                }}
              >
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  focusable="false"
                  role="img"
                  style={{
                    height: 24,
                    maxHeight: '100%',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    verticalAlign: 'bottom',
                    width: 24,
                  }}
                >
                  <g fillRule="evenodd">
                    <circle
                      fill="currentColor"
                      cx={12}
                      cy={12}
                      r={9}
                      role="presentation"
                    />
                    <circle
                      fill="inherit"
                      cx={12}
                      cy={18}
                      r={1}
                      role="presentation"
                    />
                    <path
                      d="M15.89 9.05a3.975 3.975 0 0 0-2.957-2.942C10.321 5.514 8.017 7.446 8 9.95l.005.147a.992.992 0 0 0 .982.904c.552 0 1-.447 1.002-.998a2.004 2.004 0 0 1 4.007-.002c0 1.102-.898 2-2.003 2H12a1 1 0 0 0-1 .987v2.014a1.001 1.001 0 0 0 2.004 0v-.782c0-.217.145-.399.35-.472A3.99 3.99 0 0 0 15.89 9.05"
                      fill="inherit"
                      role="presentation"
                    />
                  </g>
                </svg>
              </span>
            </span>
          </div>
        </div>
        <div
          style={{
            top: 0,
            left: 0,
            position: 'absolute',
            zIndex: 400,
          }}
        />
      </div>
    </div>
  );
}

function Profile({ onClick, tabIndex, role }) {
  return (
    <div onClick={onClick} tabIndex={tabIndex} role={role}>
      <div className={style['_3yLaBVyvmC6ymEQhWxVizY']}>
        <div>
          <div>
            <div className={style['_1y7V-xTQeUbQ4DDTCHRw-e']}>
              <span tabIndex={0} className={style['cCQAhS']}>
                <div className={style['bmhTDh']}>
                  <div className={style['fJkvZT']}>
                    <ProfileButton />
                  </div>
                </div>
              </span>
            </div>
          </div>
          <div
            style={{
              top: 0,
              left: 0,
              position: 'absolute',
              zIndex: 400,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ProfileMenuItem({ user }) {
  return (
    <div className={style.profile}>
      <div className={style.profileName}>{user && user.displayName}</div>
    </div>
  );
}
