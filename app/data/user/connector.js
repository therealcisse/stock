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
    this.updateAccountSettings = asTransaction(
      this.updateAccountSettings.bind(this),
    );
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

  async setPassword(
    { currentPassword, newPassword: password },
    { user, Users },
  ) {
    const dbUser = this.db
      .prepare(`SELECT * FROM users WHERE id = @id;`)
      .get({ id: user.id });

    if (
      !dbUser ||
      !await passwordUtils.compare(currentPassword, dbUser.password)
    ) {
      throw { currentPassword: { currentPassword: 'Mot de passe invalide.' } };
    }

    this.db
      .prepare(
        'UPDATE users SET password = @password, changePasswordAtNextLogin = @changePasswordAtNextLogin WHERE id = @id;',
      )
      .run({
        id: user.id,
        password: await passwordUtils.hash(password),
        changePasswordAtNextLogin: 0,
      });

    const refreshedUser = await Users.get(user.id);

    sessionStorage.setItem(
      CURRENT_USER_COOKIE_NAME,
      JSON.stringify(refreshedUser),
    );

    return refreshedUser;
  }
  async changeEmail({ email }, { user, Users }) {
    const info = this.db
      .prepare('UPDATE users SET email = @email WHERE id = @id;')
      .run({ id: user.id, email });

    this.loaders.ids.clear(user.id);

    const dbUser = await Users.get(user.id);

    sessionStorage.setItem(CURRENT_USER_COOKIE_NAME, JSON.stringify(dbUser));

    return dbUser;
  }
  async updateAccountSettings({ displayName }, { user, Users }) {
    const info = this.db
      .prepare('UPDATE users SET displayName = @displayName WHERE id = @id;')
      .run({ id: user.id, displayName });

    this.loaders.ids.clear(user.id);

    const dbUser = await Users.get(user.id);

    sessionStorage.setItem(CURRENT_USER_COOKIE_NAME, JSON.stringify(dbUser));

    return dbUser;
  }
}
