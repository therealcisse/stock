import React from 'react';

import style from 'routes/Product/styles';

export default class ProductInfo extends React.Component {
  render() {
    const { intl, product } = this.props;
    return (
      <div className={style.personalInfo}>
        <div className={style.table}>
          <div className={style.tableRow}>
            <Line label="Nom du product" value={product.displayName} />
            <Line
              label="Prix unitaire"
              value={
                product.unitPrice ? (
                  intl.formatNumber(product.unitPrice, { format: 'MAD' })
                ) : (
                  <span>&mdash;</span>
                )
              }
            />
            <Line
              label="Référence"
              value={product.ref || <span>&mdash;</span>}
            />
          </div>
        </div>
      </div>
    );
  }
}

function Line({ label, value }) {
  return (
    <div className={style.info}>
      <div className={style.tableRow}>
        <div className={style.labelCell}>
          <span className={style.label}>{label}</span>
        </div>

        <div className={style.labelCell}>
          <span className={style.value}>{value}</span>
        </div>
      </div>
    </div>
  );
}
