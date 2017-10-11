import { generateValidation } from 'validation';

const validations = {
  client: {
    required: true,
    validateOnBlur: true,
  },
  dateCreated: {
    required: true,
    validateOnBlur: true,
  },
};

export default generateValidation(validations);
