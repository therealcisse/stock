export default function loadZxcvbn() {
  return new Promise(resolve => {
    const zxcvbn = require('zxcvbn');
    resolve(zxcvbn);
  });
}
