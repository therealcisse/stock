import React from 'react';

import Link from 'react-router-dom/Link';

import moment from 'moment';

import { PATH_SALE_PREFIX } from 'vars';

import style from 'routes/Quotation/styles';

import cx from 'classnames';

export default function SaleInfo({ n }) {
  if (n.quotation.sale) {
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
            Vente
          </div>

          <div className={style.clientInfoRow}>
            <div className={style.amount}>
              <Link to={PATH_SALE_PREFIX + '/' + n.quotation.sale.id}>
                #{n.quotation.sale.refNo}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
