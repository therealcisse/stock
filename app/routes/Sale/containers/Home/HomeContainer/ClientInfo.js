import React from 'react';

import Link from 'react-router-dom/Link';

import moment from 'moment';

import { PATH_CLIENT_PREFIX, DATE_FORMAT } from 'vars';

import style from 'routes/Sale/styles';

import cx from 'classnames';

export default function ClientInfo({ n }) {
  return (
    <div className={cx(style.entrySection, style.leftPadding10)}>
      <div>
        <div
          className={cx(
            style.stageAmountLabel,
            style.upperCase,
            style.alignTextLeft,
          )}
        >
          Client
        </div>

        <div className={style.clientInfoRow}>
          <div className={style.amount}>
            <Link to={PATH_CLIENT_PREFIX + '/' + n.sale.client.id}>
              {n.sale.client.displayName}
            </Link>
          </div>
          <div className={style.clientInfoDate}>
            <b>{moment(n.sale.dateCreated).format(DATE_FORMAT)}</b>
          </div>
        </div>
      </div>
    </div>
  );
}
