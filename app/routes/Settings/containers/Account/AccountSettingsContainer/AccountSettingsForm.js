import React from 'react';
import T from 'prop-types';
import { compose } from 'redux';

import { withApollo } from 'react-apollo';

import {
  reduxForm,
  Field,
  propTypes as reduxFormPropTypes,
  SubmissionError,
} from 'redux-form/immutable';

import ImmutablePropTypes from 'react-immutable-proptypes';

import isEmpty from 'isEmpty';

import { intlShape } from 'react-intl';

import messages from 'routes/Settings/messages';

import style from 'routes/Settings/styles';

import refreshCurrentUser from 'utils/refreshCurrentUser';

import EmailField from 'routes/Settings/components/EmailField';
import FullNameField from 'routes/Settings/components/FullNameField';

import validations from './validations';

import MUTATION from './updateAccountSettings.mutation.graphql';

export class AccountSettingsForm extends React.Component {
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
      data: { updateAccountSettings: { user, errors } },
    } = await this.props.client.mutate({
      mutation: MUTATION,
      variables: {
        payload: {
          displayName: data.get('displayName'),
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
        duration: 2000,
        message: 'Succès', // intl.formatMessage( messages.accountSettingsChangeSuccessNotification,),
      });
    }
  }

  render() {
    const { intl, handleSubmit, pristine, submitting, invalid } = this.props;
    return (
      <div className={style.content}>
        <h1 className={style.formHeading}>
          {intl.formatMessage(messages.linkAccountSettings)}
        </h1>
        <div className={style.form}>
          <Field
            name="email"
            component={EmailField}
            label={intl.formatMessage(messages.labelEmail)}
          />
          <Field
            name="displayName"
            component={FullNameField}
            label={intl.formatMessage(messages.labelFullName)}
            onKeyDown={this.onKeyDown}
          />
          <div className={style.formGroup}>
            <div className={style.offset2} />
            <button
              onClick={handleSubmit(this.onSubmit)}
              disabled={pristine || submitting || invalid}
              className={style.saveButton}
            >
              {intl.formatMessage(messages.save)}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

AccountSettingsForm.contextTypes = {
  snackbar: T.shape({
    show: T.func.isRequired,
  }),
};

AccountSettingsForm.defaultProps = {};

AccountSettingsForm.propTypes = {
  ...reduxFormPropTypes,
  intl: intlShape.isRequired,
  initialValues: ImmutablePropTypes.contains({
    displayName: T.string,
    email: T.string.isRequired,
  }).isRequired,
};

const Form = reduxForm({
  form: 'account.settings',
  enableReinitialize: true,
  keepDirtyOnReinitialize: false,
  ...validations,
});

export default compose(withApollo, Form)(AccountSettingsForm);
