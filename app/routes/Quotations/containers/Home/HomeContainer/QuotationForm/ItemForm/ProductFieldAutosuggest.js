/* eslint-disable flowtype/require-valid-file-annotation */
/* eslint-disable react/no-array-index-key */

import React from 'react';
import T from 'prop-types';
import Autosuggest from 'react-autosuggest';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { withStyles } from 'material-ui/styles';

import { Map } from 'immutable';

import orange from 'material-ui/colors/orange';

import style from 'routes/Sales/styles';

import cx from 'classnames';

import Link from 'react-router-dom/Link';

import compose from 'redux/lib/compose';

import * as DataLoader from 'routes/Products/DataLoader';

function renderInput(inputProps) {
  const {
    classes,
    autoFocus,
    value,
    ref,
    meta: { touched, error },
    input,
    ...other
  } = inputProps;

  const hasError = touched && error && error.required;

  let helperText = hasError ? 'Le produit est nécessaire.' : null;

  return (
    <TextField
      error={hasError}
      helperText={helperText}
      autoFocus={autoFocus}
      className={classes.textField}
      value={value}
      inputRef={ref}
      InputProps={{
        classes: {
          input: classes.input,
        },
        ...other,
      }}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.product.displayName, query);
  const parts = parse(suggestion.product.displayName, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={index} style={{ fontWeight: 300 }}>
              {part.text}
            </span>
          ) : (
            <strong key={index} style={{ fontWeight: 500 }}>
              {part.text}
            </strong>
          );
        })}
      </div>
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.product.displayName;
}

const styles = theme => ({
  container: {
    width: '80%',
    position: 'relative',
    zIndex: 1502,
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  textField: {
    width: '100%',
  },
  warning: {
    color: theme.palette.primary,
    margin: 0,
    fontSize: 12,
    textAlign: 'left',
    marginTop: 8,
    minHeight: '1em',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1em',
  },
});

class ProductFieldAutosuggest extends React.Component {
  state = {
    value: '',
    suggestions: [],
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  handleCancel = e => {
    e.preventDefault();

    this.props.input.onChange(null);
    this.handleChange(e, { newValue: '' });
  };

  onProduct = (e, { suggestion }) => {
    this.props.input.onChange(suggestion);
    this.props.onDone(suggestion);
  };

  getSuggestions(value) {
    const suggestions = this.props.data.getAllProducts || [];

    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
      ? []
      : suggestions.filter(suggestion => {
          const keep =
            count < 5 &&
            suggestion.product.displayName
              .toLowerCase()
              .slice(0, inputLength) === inputValue;

          if (keep) {
            count += 1;
          }

          return keep;
        });
  }

  onBlur = () => {
    const { input } = this.props;
    input.onBlur(input.value);
  };

  render() {
    const { classes, input, meta } = this.props;

    if (input.value) {
      return (
        <div>
          <div
            className={cx(
              style.stageAmountLabel,
              style.upperCase,
              style.alignTextLeft,
            )}
          >
            Produit
          </div>

          <div className={style.amount2}>
            <Link to="/" onClick={this.handleCancel}>
              {Map.isMap(input.value)
                ? input.value.getIn(['product', 'displayName'])
                : input.value.product.displayName}
            </Link>
          </div>

          {(() => {
            const stock = Map.isMap(input.value)
              ? input.value.getIn(['stock'])
              : input.value.stock;

            return (
              <div className={classes.warning}>
                # Stock:
                <span
                  className={cx(style.stockNumber, stock <= 0 && style.danger)}
                >
                  {stock}
                </span>
              </div>
            );
          })()}
        </div>
      );
    }

    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderInputComponent={renderInput}
        suggestions={this.state.suggestions}
        onSuggestionSelected={this.onProduct}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          input,
          meta,
          autoFocus: true,
          classes,
          placeholder: 'Rechercher un produit',
          value: this.state.value,
          onChange: this.handleChange,
          onFocus: input.onFocus,
          onBlur: this.onBlur,
        }}
      />
    );
  }
}

ProductFieldAutosuggest.propTypes = {
  classes: T.object.isRequired,
};

export default compose(withStyles(styles), DataLoader.products)(
  ProductFieldAutosuggest,
);
