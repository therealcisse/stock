import { addLocaleData } from 'react-intl';
import moment from 'moment';

import debug from 'log';

const log = debug('app:client:intl');

const loaders = {
  en(force) {
    if (!window.Intl || force) {
      require('intl');
      require('intl/locale-data/jsonp/en.js');
      addLocaleData(require('react-intl/locale-data/en.js'));
      return { messages: {} };
    } else {
      addLocaleData(require('react-intl/locale-data/en.js'));
      return { messages: {} };
    }
  },

  fr(force) {
    moment.locale('fr');

    if (!window.Intl || force) {
      require('intl');
      require('intl/locale-data/jsonp/fr.js');
      addLocaleData(require('react-intl/locale-data/fr.js'));
      return { messages: {} };
    } else {
      addLocaleData(require('react-intl/locale-data/fr.js'));
      return { messages: {} };
    }
  },
};

export default (locale, force = false) => {
  let fn = loaders[locale];
  if (!fn) {
    log(`No loader for locale: ${locale}, Falling back to default lang`);
    fn = loaders.en;
  }
  return fn(force);
};
