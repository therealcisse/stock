import keyOf from 'fbjs/lib/keyOf';

export const VERSION = require('../package.json').version;

export const DEBUG = process.env.DEBUG_PROD;

export const GA_TRACKING_ID = '';

export const SENTRY_DSN = '';

// Use this constant to initialize reducers
export const INIT = keyOf({ INIT: null });

export const APP_NAME = require('../package.json').productName;
export const COUNTRY = 'MA';
export const BUSINESS_KEY = '49d9988e-d550-4e64-a8fb-a9295c44cb02';
export const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes

export const CURRENT_USER_COOKIE_NAME = 'currentUser';

export const LANG = 'fr';

export const APOLLO_QUERY_BATCH_INTERVAL = 10;

export const PASSWORD_MIN_LENGTH = 5;
export const PASSWORD_MIN_SCORE = 2;

export const PATH_LOGIN = '/login';

// Settings
export const PATH_SETTINGS_BASE = '/settings';
export const PATH_SETTINGS_ACCOUNT = 'account_settings';
export const PATH_SETTINGS_CHANGE_PASSWORD = 'change_password';
export const PATH_SETTINGS_BUSINESS_DETAILS = 'business';
export const PATH_SETTINGS_CHANGE_EMAIL = 'change_email';

export const LINK_TERMS_OF_SERVICE = '';
export const LINK_PRIVACY_POLICY = '';
export const LINK_SUPPORT = '';

export const APOLLO_DEFAULT_REDUX_ROOT_KEY = 'apollo';
