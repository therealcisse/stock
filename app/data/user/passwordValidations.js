import zxcvbn from 'zxcvbn';
import { generateValidation, addValidation } from 'validation';

import { PASSWORD_MIN_SCORE } from 'vars';

addValidation('currentPassword', (_, oldPassword, __, { user }) => {
  if (!oldPassword) {
    return false;
  }
  return Parse.User.logIn(user.get('username'), oldPassword); // TODO: verify current password
});

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
    currentPassword: true,
  },
};

export default generateValidation(validations);
