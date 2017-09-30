import { generateValidation } from 'validation';

const validations = {
  displayName: {
    required: true,
    validateOnBlur: true,
  },

  unitPrice: {
    number: true,
    validateOnBlur: true,
  },
};

export default generateValidation(validations);
