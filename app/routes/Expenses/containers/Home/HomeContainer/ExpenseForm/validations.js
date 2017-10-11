import { generateValidation } from 'validation';

const validations = {
  supplier: {
    required: true,
    validateOnBlur: true,
  },
  dateCreated: {
    required: true,
    validateOnBlur: true,
  },
};

export default generateValidation(validations);
