import React from 'react';

import Button from 'material-ui/Button';

import { connect } from 'react-redux';
import { isValid, formValueSelector } from 'redux-form/immutable';

import compose from 'redux/lib/compose';

import style from 'routes/Quotations/styles';

class SaveButton extends React.Component {
  render() {
    const { intl, disabled, onSave, isValid } = this.props;

    if (isValid) {
      return (
        <Button disabled={disabled} color="contrast" onClick={onSave}>
          Enregistrer
        </Button>
      );
    }

    return null;
  }
}

const isValidSelector = isValid('quotation');

const valueSelector = formValueSelector('quotation');

const mapStateToProps = state => {
  return {
    isValid: isValidSelector(state) && !valueSelector(state, 'items').isEmpty(),
  };
};

const SaveButtonWithInfo = connect(mapStateToProps);

export default compose(SaveButtonWithInfo)(SaveButton);
