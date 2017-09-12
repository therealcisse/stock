import DataLoader from 'dataloader';

import asTransaction from 'data/asTransaction';

import * as passwordUtils from 'utils/password';

import { CURRENT_USER_COOKIE_NAME } from 'vars';

import { User } from 'data/types';

export class UserConnector {
  constructor({ db }) {
    this.db = db;
    this.users = new DataLoader(async function(ids) {
      const objects = db
        .prepare(
          `SELECT * FROM users WHERE id IN (${ids.map(() => '?').join(', ')});`,
        )
        .all(ids)
        .map(User.fromDatabase);

      return ids.map(id => {
        const index = objects.findIndex(user => String(user.id) === id);
        return index !== -1 ? objects[index] : new Error(`User ${id} not found`);
      });
    }, {});

    this.setPassword = asTransaction(this.setPassword);
    this.changeEmail = asTransaction(this.changeEmail);
    this.updateAccountSettings = asTransaction(this.updateAccountSettings);
  }

  get(id) {
    return this.users.load(id);
  }

  // auth
  async logIn({ username, password }) {
    const user = this.db
      .prepare(`SELECT * FROM users WHERE username = @username;`)
      .get({ username });

    if (user && (await passwordUtils.compare(password, user.password))) {
      const serialized = UserConnector.fromDatabase(user);

      sessionStorage.setItem(
        CURRENT_USER_COOKIE_NAME,
        JSON.stringify(serialized),
      );

      return serialized;
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

    this.users.clear(user.id);

    return Users.get(user.id);
  }
  updateAccountSettings({ displayName }, { user, Users }) {
    const info = this.db
      .prepare('UPDATE users SET displayName = @displayName where id = @id;')
      .run({ id: user.id, displayName });

    this.users.clear(user.id);

    return Users.get(user.id);
  }
}
