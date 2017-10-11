import { generateValidation } from 'validation';

const validations = {
  product: {
    required: true,
    validateOnBlur: true,
  },

  unitPrice: {
    numberRequired: true,
    validateOnBlur: true,
  },

  qty: {
    numberRequired: true,
    validateOnBlur: true,
  },
};

export default generateValidation(validations);
