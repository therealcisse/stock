import React from 'react';

import style from 'routes/Client/styles';

export default class PersonalInfo extends React.Component {
  render() {
    const { client } = this.props;
    return (
      <div className={style.personalInfo}>
        <div className={style.table}>
          <div className={style.tableRow}>
            <Line label="Nom du client" value={client.displayName} />
            <Line
              label="E-mail"
              value={client.email || <span>&mdash;</span>}
            />
            <Line
              label="Téléphone"
              value={client.tel || <span>&mdash;</span>}
            />
            <Line
              label="Adresse"
              value={client.address || <span>&mdash;</span>}
            />
            <Line
              label="Numéro d'indentification fiscale"
              value={client.taxId || <span>&mdash;</span>}
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

