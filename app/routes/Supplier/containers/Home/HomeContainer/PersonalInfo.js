import React from 'react';

import style from 'routes/Supplier/styles';

export default class PersonalInfo extends React.Component {
  render() {
    const { supplier } = this.props;
    return (
      <div className={style.personalInfo}>
        <div className={style.table}>
          <div className={style.tableRow}>
            <Line label="Nom du client" value={supplier.displayName} />
            <Line
              label="E-mail"
              value={supplier.email || <span>&mdash;</span>}
            />
            <Line
              label="Téléphone"
              value={supplier.tel || <span>&mdash;</span>}
            />
            <Line
              label="Adresse"
              value={supplier.address || <span>&mdash;</span>}
            />
            <Line
              label="Numéro d'indentification fiscale"
              value={supplier.taxId || <span>&mdash;</span>}
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
