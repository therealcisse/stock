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

import style from 'routes/Quotations/styles';

import cx from 'classnames';

import Link from 'react-router-dom/Link';

import compose from 'redux/lib/compose';

import * as DataLoader from 'routes/Clients/DataLoader';

function renderInput(inputProps) {
  const {
    classes,
    autoFocus,
    value,
    ref,
    meta: { touched, error },
    ...other
  } = inputProps;

  const hasError = touched && error && error.required;

  return (
    <TextField
      error={hasError}
      helperText={hasError ? 'Le client est nécessaire.' : null}
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
  const matches = match(suggestion.client.displayName, query);
  const parts = parse(suggestion.client.displayName, matches);

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
  return suggestion.client.displayName;
}

const styles = theme => ({
  container: {
    width: '35%',
    position: 'relative',
    zIndex: 1501,
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
});

class ClientFieldAutosuggest extends React.Component {
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

  onClient = (e, { suggestion }) => {
    this.props.input.onChange(suggestion);
    this.props.onDone();
  };

  getSuggestions(value) {
    const suggestions = this.props.data.getAllClients || [];

    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
      ? []
      : suggestions.filter(suggestion => {
          const keep =
            count < 5 &&
            suggestion.client.displayName.toLowerCase().slice(0, inputLength) ===
              inputValue;

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
            Client
          </div>

          <div className={style.amount2}>
            <Link to="/" onClick={this.handleCancel}>
              {input.value.client.displayName}
            </Link>
          </div>
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
        onSuggestionSelected={this.onClient}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          meta,
          autoFocus: true,
          classes,
          placeholder: 'Rechercher un client',
          value: this.state.value,
          onChange: this.handleChange,
          onFocus: input.onFocus,
          onBlur: this.onBlur,
        }}
      />
    );
  }
}

ClientFieldAutosuggest.propTypes = {
  classes: T.object.isRequired,
};

export default compose(withStyles(styles), DataLoader.clients)(
  ClientFieldAutosuggest,
);
