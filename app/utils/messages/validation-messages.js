import { defineMessages } from 'react-intl';

export default defineMessages({
  passwordRequired: {
    id: 'validation-messages.password-required',
    defaultMessage: 'Mot de passe requis.',
  },

  passwordMinLength: {
    id: 'validation-messages.password-min-length',
    defaultMessage:
      'Le mot de passe doit comporter au moins {minLength} caractères.',
  },

  passwordMismatch: {
    id: 'validation-messages.password-mismatch',
    defaultMessage: 'Les mots de passe ne correspondent pas',
  },

  emailRequired: {
    id: 'validation-messages.email-required',
    defaultMessage: 'E-mail requis.',
  },

  emailInvalid: {
    id: 'validation-messages.email-invalid',
    defaultMessage: 'Veuillez saisir une adresse e-mail valide.',
  },

  emailTaken: {
    id: 'validation-messages.email-taken',
    defaultMessage:
      'Cette adresse e-mail est déjà dans notre système. Identifiez-vous.',
  },

  recaptchaRequired: {
    id: 'validation-messages.recaptcha',
    defaultMessage: 'Vérifiez que vous êtes un humain.',
  },

  fullNameRequired: {
    id: 'validation-messages.fullname',
    defaultMessage: 'Nom complet requis.',
  },

  businessNameRequired: {
    id: 'validation-messages.business-name',
    defaultMessage: 'Veuillez saisir le nom de votre entreprise.',
  },
  currentPassword: {
    id: 'validation-messages.current-password-error',
    defaultMessage: 'Vous avez entré un mot de passe non valide.',
  },
  currentPasswordRequired: {
    id: 'validation-messages.current-password-required-error',
    defaultMessage: 'Veuillez entrer votre mot de passe actuel.',
  },

  passwordMinScore: {
    id: 'validation-messages.password-min-score',
    defaultMessage: 'Veuillez choisir un mot de passe plus fort.',
  },
  newPasswordRequired: {
    id: 'validation-messages.new-password-required',
    defaultMessage: 'Veuillez saisir votre nouveau mot de passe.',
  },

  zipInvalid: {
    id: 'validation-messages.zipcode-invalid',
    defaultMessage: 'Veuillez entrer un code postal valide.',
  },
  urlInvalid: {
    id: 'validation-messages.url-invalid',
    defaultMessage: 'Veuillez saisir un site Web valide.',
  },
  phoneInvalid: {
    id: 'validation-messages.phone-invalid',
    defaultMessage: 'Veuillez entrer un numéro de téléphone valide.',
  },

  countryInvalid: {
    id: 'validation-messages.country-invalid',
    defaultMessage:
      'Seul {country} est actuellement pris en charge. Restez à l’écoute!',
  },
  countryRequired: {
    id: 'validation-messages.country-required',
    defaultMessage: 'Veuillez nous indiquer votre pays.',
  },
});
