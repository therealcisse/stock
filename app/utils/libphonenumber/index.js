const { PhoneNumberUtil } = require('node-phonenumber');
export default PhoneNumberUtil.getInstance();
export const ValidationResult = PhoneNumberUtil.ValidationResult;
