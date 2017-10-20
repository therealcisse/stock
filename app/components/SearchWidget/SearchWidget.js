import React from 'react';

import { withStyles } from 'material-ui/styles';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';

import SearchTextInput from './SearchTextInput';

import { connect } from 'react-redux';

import { compose, bindActionCreators } from 'redux';

import { toggleSearch } from 'redux/reducers/app/actions';

import Logo from './Logo';
import Back from './Back';

import Quotations from './Quotations';
import Sales from './Sales';
import Expenses from './Expenses';
import Clients from './Clients';
import Suppliers from './Suppliers';
import Products from './Products';

import selector from './selector';

import style from './SearchWidget.scss';

function SlideRight(props) {
  return <Slide {...props} direction="right" />;
}

const styles = theme => ({
  root: {
    alignItems: 'initial',
    justifyContent: 'flex-start',
  },
  dialog: {
    maxWidth: 600,
    maxHeight: '100vh',
    overflow: 'none',
  },
  formControl: {
    margin: theme.spacing.unit,
    width: '80%',
  },
});

class SearchWidget extends React.Component {
  state = {
    q: null,
  };

  onText = q => this.setState({ q });

  onClose = () => {
    this.props.actions.toggleSearch();
    this.setState({ q: null });
  };

  render() {
    const { classes, searching } = this.props;

    return (
      <Dialog
        classes={{
          root: classes.root,
          paper: classes.dialog,
        }}
        open={searching}
        transition={SlideRight}
        onRequestClose={this.onClose}
        fullScreen
      >
        <DialogContent
          classes={{
            root: style.root,
          }}
        >
          <div className={style.side}>
            <Logo />
            <Back onClick={this.onClose} />
          </div>
          <div className={style.searchResults}>
            <div className={style.input}>
              <SearchTextInput q={this.state.q} onText={this.onText} />
            </div>
            <div className={style.results}>
              <Products handleRequestClose={this.onClose} q={this.state.q} />
              <Quotations handleRequestClose={this.onClose} q={this.state.q} />
              <Sales handleRequestClose={this.onClose} q={this.state.q} />
              <Expenses handleRequestClose={this.onClose} q={this.state.q} />
              <Clients handleRequestClose={this.onClose} q={this.state.q} />
              <Suppliers handleRequestClose={this.onClose} q={this.state.q} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        toggleSearch,
      },
      dispatch,
    ),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withStyles(styles), Connect)(SearchWidget);
