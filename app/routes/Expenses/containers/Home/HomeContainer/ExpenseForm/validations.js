import { generateValidation } from 'validation';

const validations = {
  displayName: {
    required: true,
    validateOnBlur: true,
  },

  email: {
    email: true,
    validateOnBlur: true,
  },

};

export default generateValidation(validations);
