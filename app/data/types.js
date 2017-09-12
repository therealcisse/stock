import { Record } from 'immutable';

export class User extends Record({
  loading: false,
  changePasswordAtNextLogin: false,
  id: undefined,
  displayName: undefined,
  email: undefined,
  username: undefined,
}) {
  get isEmpty() {
    return typeof this.id === 'undefined';
  }

  ////////////////////////////////////////////////////////////////

  static fromDatabase({ changePasswordAtNextLogin, password, ...props }) {
    return {
      changePasswordAtNextLogin: Boolean(changePasswordAtNextLogin),
      ...props,
    };
  }
}

export class Business extends Record({}) {
  static fromDatabase({ key, ...props }) {
    return {
      id: key,
      ...props,
    };
  }
}
