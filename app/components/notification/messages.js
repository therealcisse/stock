import { defineMessages } from 'react-intl';

export default defineMessages({
  InvalidLink: {
    id: 'notification.invalid_link',
    defaultMessage:
      'Ce lien a expiré. Veuillez recommencer le processus. Merci.',
  },

  PasswordResetSuccess: {
    id: 'notification.password_reset_success',
    defaultMessage: 'Succès',
  },

  EmailVerificationSuccess: {
    id: 'notification.email_verification_success',
    defaultMessage: 'Succès. Merci d’avoir vérifié votre adresse e-mail!',
  },

  EmailVerificationPending: {
    id: 'notification.email_verification_pending',
    defaultMessage:
      'Vous devez activer votre compte avant de continue. Nous avons envoyé un e-mail à {email}. {resendEmailVerificationLink} {changeEmail}',
  },

  ResendVerification: {
    id: 'notification.resend_verification',
    defaultMessage: 'Renvoyer l’e-mail d’activation',
  },
  ChangeEmail: {
    id: 'notification.change_email',
    defaultMessage: 'Changer votre adresse e-mail',
  },

  emailSent: {
    id: 'notification.email-sent-successfully',
    defaultMessage: 'Merci. Nous avons envoyé un e-mail à l’adresse fournie.',
  },

  BusinessRequired: {
    id: 'notification.business-required',
    defaultMessage:
      'Merci d’utiliser {appName}. Veuillez {link} pour ajouter les détails de votre entreprise.',
  },
  AddBusinessLink: {
    id: 'notification.add-business-link',
    defaultMessage: 'cliquez ici',
  },

  SessionExpired: {
    id: 'notification.session-expired',
    defaultMessage: 'Votre session a expiré. Veuillez vous connecter à nouveau.',
  },
});
