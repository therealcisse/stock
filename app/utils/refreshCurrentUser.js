import { INIT } from 'vars';

import { USER_LOGGED_IN } from 'redux/reducers/user/constants';

export default function refreshCurrentUser(user, dispatch) {
  dispatch([
    {
      type: USER_LOGGED_IN,
      payload: user,
    },
    {
      type: INIT,
    },
  ]);
}
