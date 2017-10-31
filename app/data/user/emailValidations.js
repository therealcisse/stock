import { generateValidation } from 'validation';

const validations = {
  email: {
    required: true,
    email: true,
  },
};

export default generateValidation(validations);
