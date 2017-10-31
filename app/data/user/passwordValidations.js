import zxcvbn from 'zxcvbn';
import { generateValidation, addValidation } from 'validation';

import { PASSWORD_MIN_SCORE } from 'vars';

addValidation('minScore', (_, newPassword, minScore) => {
  return newPassword ? zxcvbn(newPassword).score < minScore : false;
});

const validations = {
  newPassword: {
    validateOnBlur: true,
    required: true,
    minScore: PASSWORD_MIN_SCORE,
  },
  currentPassword: {
    required: true,
  },
};

export default generateValidation(validations);
