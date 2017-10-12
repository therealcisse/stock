import { generateValidation } from 'validation';

import { COUNTRY } from 'vars';

const validations = {
  // displayName: {
  //   validateOnBlur: true,
  //   required: true,
  // },
  // email: {
  //   validateOnBlur: true,
  //   email: true,
  // },
  // url: {
  //   validateOnBlur: true,
  //   webSite: true,
  // },
  // country: {
  //   validateOnBlur: true,
  //   country: COUNTRY,
  //   required: true,
  // },
};

export default generateValidation(validations);
