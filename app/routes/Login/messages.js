import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'account.login-page.title',
    defaultMessage: 'Connexion à {appName} · {appName}',
  },

  title: {
    id: 'account.login-form.title',
    defaultMessage: 'Connexion à {appName}',
  },

  username: {
    id: 'account.login-form.label.username',
    defaultMessage: 'Idenfiant',
  },

  password: {
    id: 'account.login-form.label.password',
    defaultMessage: 'Mot de passe',
  },

  error: {
    id: 'account.login-form.login-error',
    defaultMessage: 'Idenfiant ou mot de passe invalide.',
  },

  logIn: {
    id: 'account.login-form.login-action',
    defaultMessage: 'Connexion',
  },

  signupQuestion: {
    id: 'account.login-form.signup-question',
    defaultMessage: 'Pas encore membre?',
  },

  signUp: {
    id: 'acccount.login-form.signup',
    defaultMessage: 'Inscrivez-vous!',
  },

  passwordReset: {
    id: 'account.login-form.password_reset',
    defaultMessage: 'Informations de compte oubliées ?',
  },
  support: {
    id: 'account.login-form.support',
    defaultMessage: 'Support technique',
  },
  termsOfService: {
    id: 'account.login-form.terms-of-service',
    defaultMessage: 'Conditions d’utilisation',
  },

  privacyPolicy: {
    id: 'account.login-form.privacy-policy',
    defaultMessage: 'Confidentialité',
  },
});
