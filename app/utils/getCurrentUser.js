import { CURRENT_USER_COOKIE_NAME } from 'vars';

export default function getCurrentUser() {
  const serialized = sessionStorage.getItem(CURRENT_USER_COOKIE_NAME);
  return serialized ? JSON.parse(serialized) : null;
}
