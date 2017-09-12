import { generateValidation } from 'validation';

const validations = {
  displayName: {
    validateOnBlur: true,
    required: true,
  },
};

export default generateValidation(validations);
