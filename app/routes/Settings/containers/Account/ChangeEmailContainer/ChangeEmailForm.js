import React from 'react';
import T from 'prop-types';
import { compose } from 'redux';

import { withApollo } from 'react-apollo';

import refreshCurrentUser from 'utils/refreshCurrentUser';

import {
  reduxForm,
  Field,
  propTypes as reduxFormPropTypes,
  SubmissionError,
} from 'redux-form/immutable';

import isEmpty from 'isEmpty';

import { intlShape, FormattedMessage } from 'react-intl';

import messages from 'routes/Settings/messages';

import style from 'routes/Settings/styles';

import NewEmailField from 'routes/Settings/components/NewEmailField';

import MUTATION from './changeEmail.mutation.graphql';

export class ChangeEmailForm extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.onKeyDown = this._onKeyDown.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  _onKeyDown(e) {
    if (e.key === 'Enter' && e.shiftKey === false) {
      const submit = this.props.handleSubmit(this.onSubmit);
      submit();
    }
  }

  async onSubmit(data) {
    const {
      data: { changeEmail: { user, errors } },
    } = await this.props.client.mutate({
      mutation: MUTATION,
      variables: {
        payload: {
          email: data.get('email'),
        },
      },
    });

    if (!isEmpty(errors)) {
      throw new SubmissionError(errors);
    }

    // currentUser has changed, refresh.
    await refreshCurrentUser(user, this.props.dispatch);

    const { intl } = this.props;
    const { snackbar } = this.context;
    if (snackbar) {
      snackbar.show({
        message: 'Succès', // intl.formatMessage(messages.emailChangeSuccessNotification),
        duration: 2000,
      });
    }
  }

  render() {
    const {
      intl,
      user,
      handleSubmit,
      pristine,
      submitting,
      invalid,
    } = this.props;
    return (
      <div className={style.content}>
        <h1 className={style.changeEmailFormHeading}>
          {intl.formatMessage(messages.titleChangeEmail)}
        </h1>
        <p className={style.currentEmailIntro}>
          <FormattedMessage
            {...messages.currentEmailIntro}
            values={{
              email: <strong>{user.email}</strong>,
            }}
          />
        </p>
        <div className={style.form}>
          <Field
            name="email"
            component={NewEmailField}
            label={intl.formatMessage(messages.labelNewEmail)}
            onKeyDown={this.onKeyDown}
          />
          <div className={style.formGroup}>
            <div className={style.offset2} />
            <button
              onClick={handleSubmit(this.onSubmit)}
              disabled={submitting || invalid}
              className={style.saveButton}
            >
              {intl.formatMessage(messages.changeEmail)}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

ChangeEmailForm.contextTypes = {
  snackbar: T.shape({
    show: T.func.isRequired,
  }),
};

ChangeEmailForm.defaultProps = {};

ChangeEmailForm.propTypes = {
  ...reduxFormPropTypes,
  intl: intlShape.isRequired,
  user: T.shape({
    email: T.string,
  }).isRequired,
};

const Form = reduxForm({
  form: 'changeEmail',
  enableReinitialize: true,
  keepDirtyOnReinitialize: false,
});

export default compose(withApollo, Form)(ChangeEmailForm);
