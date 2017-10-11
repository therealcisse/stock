import React from 'react';

import Link from 'react-router-dom/Link';

import { Client } from 'data/types';

import moment from 'moment';

import { PATH_CLIENT_PREFIX, PATH_SUPPLIER_PREFIX, DATE_FORMAT } from 'vars';

import style from 'routes/Expense/styles';

import cx from 'classnames';

export default function BeneficiaryInfo({ n }) {
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
          Bénéficier
        </div>

        <div className={style.clientInfoRow}>
          <div className={style.amount}>
            <Link
              to={
                (Client.isClient(n.expense.beneficiary)
                  ? PATH_CLIENT_PREFIX
                  : PATH_SUPPLIER_PREFIX) +
                '/' +
                n.expense.beneficiary.id
              }
            >
              {n.expense.beneficiary.displayName}
            </Link>
          </div>
          <div className={style.clientInfoDate}>
            <b>{moment(n.expense.dateCreated).format(DATE_FORMAT)}</b>
          </div>
        </div>
      </div>
    </div>
  );
}
