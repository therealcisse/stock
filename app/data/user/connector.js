import asTransaction from 'data/asTransaction';

import * as passwordUtils from 'utils/password';

import { CURRENT_USER_COOKIE_NAME } from 'vars';

import { User } from 'data/types';

import Loaders from './loaders';

export class UserConnector {
  constructor({ db }) {
    this.db = db;
    this.loaders = Loaders({ db });

    this.setPassword = asTransaction(this.setPassword.bind(this));
    this.changeEmail = asTransaction(this.changeEmail.bind(this));
    this.updateAccountSettings = asTransaction(this.updateAccountSettings.bind(this));
  }

  get(id) {
    return this.loaders.ids.load(id);
  }

  // auth
  async logIn({ username, password }) {
    const user = this.db
      .prepare(`SELECT * FROM users WHERE username = @username;`)
      .get({ username });

    if (user && (await passwordUtils.compare(password, user.password))) {
      const serializedUser = User.fromDatabase(user);

      sessionStorage.setItem(
        CURRENT_USER_COOKIE_NAME,
        JSON.stringify(serializedUser),
      );

      return serializedUser;
    }

    return null;
  }

  async setPassword({ password }, { user, Users }) {
    const info = this.db
      .prepare('UPDATE users SET password = @password where id = @id;')
      .run({ id: user.id, password: await passwordUtils.hash(password) });

    return await Users.get(user.id);
  }
  changeEmail({ email }, { user, Users }) {
    const info = this.db
      .prepare('UPDATE users SET email = @email where id = @id;')
      .run({ id: user.id, email });

    this.loaders.ids.clear(user.id);

    return Users.get(user.id);
  }
  updateAccountSettings({ displayName }, { user, Users }) {
    const info = this.db
      .prepare('UPDATE users SET displayName = @displayName where id = @id;')
      .run({ id: user.id, displayName });

    this.loaders.ids.clear(user.id);

    return Users.get(user.id);
  }
}
