// @flow weak

import React from 'react';
import T from 'prop-types';
import { withStyles } from 'material-ui/styles';

import cx from 'classnames';

import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    width: '80%',
  },
  textField: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    // width: 200,
  },
});

function DT(props) {
  const { classes, label, input, meta: { touched, error } } = props;

  const hasError = touched && error && (error.required);

  return (
    <FormControl
      className={cx(classes.formControl, classes.container)}
      error={hasError}
      noValidate
    >
      <InputLabel shrink htmlFor={input.name}>
        {label}
      </InputLabel>
      <Input
        id={input.name}
        {...input}
        type="date"
        className={classes.textField}
      />
      {hasError
        ? [
            error.required && (
              <FormHelperText>{'Ce champ ne peut être vide.'}</FormHelperText>
            ),
          ]
        : null}
    </FormControl>
  );
}

DT.propTypes = {
  classes: T.object.isRequired,
};

export default withStyles(styles)(DT);
