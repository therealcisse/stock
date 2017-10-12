import React from 'react';
import { compose, bindActionCreators } from 'redux';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { injectIntl, intlShape } from 'react-intl';

import { logOut } from 'redux/reducers/user/actions';

import { createSelector } from 'utils/reselect';

import * as selectors from 'redux/reducers/user/selectors';

import style from 'routes/Settings/styles';

import Header from 'routes/Settings/components/Header';
import Sidebar from 'routes/Settings/components/Sidebar';

import messages from 'routes/Settings/messages';

import Title from 'components/Title';

import { APP_NAME } from 'vars';

import { COUNTRY } from 'vars';

import QUERY from './currentUser.query.graphql';

import BusinessDetailsForm from './BusinessDetailsForm';

function BusinessDetailsContainer({
  intl,
  user,
  data: { loading, currentUser },
  actions,
}) {
  const currentBusiness = currentUser && currentUser.business;
  return (
    <div className={style.root}>
      <Title title={intl.formatMessage(messages.title, { appName: APP_NAME })} />
      <Header onLogOut={actions.logOut} />
      <Sidebar user={user} selectedMenuItem={'business.settings'} />
      {loading ? null : (
        <BusinessDetailsForm
          user={user}
          intl={intl}
          initialValues={{
            id: currentBusiness ? currentBusiness.id : null,
            displayName: currentBusiness ? currentBusiness.displayName : null,
            url: currentBusiness ? currentBusiness.url : null,
            country: currentBusiness
              ? currentBusiness.country || COUNTRY
              : COUNTRY,
            city: currentBusiness ? currentBusiness.city : null,
            address: currentBusiness ? currentBusiness.address : null,
            postalCode: currentBusiness ? currentBusiness.postalCode : null,
            phone: currentBusiness ? currentBusiness.phone : null,
            fax: currentBusiness ? currentBusiness.fax : null,
            email: currentBusiness ? currentBusiness.email : null,
            patente: currentBusiness ? currentBusiness.patente : null,
            ice: currentBusiness ? currentBusiness.ice : null,
            rc: currentBusiness ? currentBusiness.rc : null,
            cnss: currentBusiness ? currentBusiness.cnss : null,
            taxId: currentBusiness ? currentBusiness.taxId : null,
          }}
        />
      )}
    </div>
  );
}

BusinessDetailsContainer.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = createSelector(selectors.user, user => ({ user }));

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ logOut }, dispatch) };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

const withCurrentUserAndBusiness = graphql(QUERY, {
  options: ({ user }) => ({
    variables: { id: user.id },
  }),
  skip: ({ user }) => user.isEmpty,
});

export default compose(injectIntl, Connect, withCurrentUserAndBusiness)(
  BusinessDetailsContainer,
);
