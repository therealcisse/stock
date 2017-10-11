import React from 'react';

import TextField from 'material-ui/TextField';

import { withStyles } from 'material-ui/styles';

import { connect } from 'react-redux';

import compose from 'redux/lib/compose';

import style from './SearchWidget.scss';

const styles = theme => ({
  formControl: {},
});

class SearchTextInput extends React.Component {
  componentWillReceiveProps(nextProps) {}

  onChange = e => {
    this.props.onText(e.target.value);
  };

  render() {
    const { q, classes, onText } = this.props;

    return (
      <div classes={{}}>
        <TextField
          className={classes.formControl}
          InputProps={{
            disableUnderline: true,
          }}
          value={q}
          onChange={this.onChange}
          fullWidth
          autoFocus
          placeholder="Rechercher"
        />
      </div>
    );
  }
}

export default compose(withStyles(styles))(SearchTextInput);
