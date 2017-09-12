import { LANG } from 'vars';

import formats from 'intl-formats';

import { UPDATE } from './constants';

import { Record } from 'immutable';

export class IntlState extends Record({
  defaultLocale: LANG,
  locale: LANG,
  messages: {},
  formats,
}) {
  get localeWithFallback() {
    return this.get('locale', this.get('defaultLocale'));
  }
}

export const initialState = new IntlState();

export default function reducer(state = initialState, action) {
  if (action.type !== UPDATE) {
    return state;
  }

  return state
    .set('locale', action.payload.locale)
    .set('messages', action.payload.messages)
    .set('formats', action.payload.formats);
}
