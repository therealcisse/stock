import React from 'react';

import { withStyles } from 'material-ui/styles';
import Tooltip from 'material-ui/Tooltip';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';

import SearchButtonIcon from 'material-ui-icons/Search';

import style from './SideMenu.scss';

import cx from 'classnames';

const styles = theme => ({});

function TopContainer({ classes }) {
  return (
    <div className={style['kfFTAe']}>
      <Tooltip title="Rechercher" placement="right">
        <div className={style['fSDZOA']}>
          <span className={style['fcnKTg']}>
            <span
              style={{
                display: 'inline-block',
                lineHeight: 1,
                width: 24,
                height: 24,
                color: 'currentcolor',
                fill: 'white',
              }}
            >
              <SearchButtonIcon width={24} height={24} />
            </span>
          </span>
        </div>
      </Tooltip>

      <Dropdown>
        <Dropdown.Toggle componentClass={AddButton} />
        <Dropdown.Menu className={style.addMenu}>
          <MenuItem eventKey="sales" key="sales">
            Vente
          </MenuItem>
          <MenuItem eventKey="expenses" key="expenses">
            Dépense
          </MenuItem>
          <MenuItem key="0" divider />
          <MenuItem eventKey="products" key="products">
            Produit
          </MenuItem>
          <MenuItem key="1" divider />
          <MenuItem eventKey="clients" key="clients">
            Client
          </MenuItem>
          <MenuItem eventKey="suppliers" key="suppliers">
            Fournisseur
          </MenuItem>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

function AddButton({ onClick, tabIndex, role }) {
  return (
    <Tooltip title="Créer" placement="right">
      <div
        onClick={onClick}
        tabIndex={tabIndex}
        role={role}
        className={style['fSDZOA']}
      >
        <span className={style['fcnKTg']}>
          <span
            style={{
              display: 'inline-block',
              lineHeight: 1,
              width: 24,
              height: 24,
              color: 'currentcolor',
              fill: 'white',
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
                verticalAlign: 'right',
                width: 24,
              }}
            >
              <g fill="currentColor" fillRule="evenodd">
                <path d="M11 3h2v18h-2z" role="presentation" />
                <path
                  d="M3.993 11A.997.997 0 0 0 3 12c0 .557.445 1 .993 1h16.014A.997.997 0 0 0 21 12c0-.556-.445-1-.993-1H3.993z"
                  role="presentation"
                />
              </g>
            </svg>
          </span>
        </span>
      </div>
    </Tooltip>
  );
}

export default withStyles(styles)(TopContainer);
