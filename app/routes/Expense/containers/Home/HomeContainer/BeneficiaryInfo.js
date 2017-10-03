import React from 'react';

import Link from 'react-router-dom/Link';

import { Client } from 'data/types';

import { PATH_CLIENT_PREFIX, PATH_SUPPLIER_PREFIX } from 'vars';

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
      </div>
    </div>
  );
}

