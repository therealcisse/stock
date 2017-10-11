import * as basicValidations from 'validation/basic-validations';
import { generateValidation, addValidation } from 'validation';

import parseMoney from 'parseMoney';

addValidation('balanceDue', (fieldName, amount, value, { balanceDue }) => {
  const args = [fieldName, amount, true, {}];

  if (
    basicValidations.required(...args) === false &&
    basicValidations.number(...args) === false
  ) {
    const money = parseMoney(amount);
    return !(money > 0 && money <= balanceDue);
  }

  return false;
});

const validations = {
  dateCreated: {
    required: true,
    validateOnBlur: true,
  },

  amount: {
    required: true,
    number: true,
    balanceDue: true,
    validateOnBlur: true,
  },
};

export default generateValidation(validations);
