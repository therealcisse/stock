const formats = {
  date: {
    medium: {
      style: 'medium',
    },
  },
  number: {
    MAD: {
      style: 'decimal',
      // currency: 'MAD',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,

      // currencyDisplay: oneOf(['symbol', 'code', 'name']),
      // minimumIntegerDigits    : number,
      // minimumFractionDigits   : number,
      // maximumFractionDigits   : number,
      // minimumSignificantDigits: number,
      // maximumSignificantDigits: number,

      // useGrouping    : bool,
    },
    MONEY: {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    PERCENT: {
      style: 'percent',
      minimumFractionDigits: 2,
    },
  },
};

export default formats;
