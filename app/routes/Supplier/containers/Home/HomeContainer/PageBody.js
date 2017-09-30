import React from 'react';
import T from 'prop-types';

import Tabs, { Tab } from 'material-ui/Tabs';

import SwipeableViews from 'react-swipeable-views';

import compose from 'redux/lib/compose';

import { withStyles } from 'material-ui/styles';

import { injectIntl } from 'react-intl';

import Paper from 'material-ui/Paper';

import Loading from 'components/Loading';

import style from 'routes/Supplier/styles';

import NotFound from './NotFound';

import Operations from './Operations';

import PersonalInfo from './PersonalInfo';

const styles = theme => ({
  paper: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
});

function TabContainer(props) {
  return <div style={{ padding: 20 }}>{props.children}</div>;
}

class PageBody extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { data, intl, classes } = this.props;
    const { loading, error, getSupplier: n } = data;

    if (error) {
      return <NotFound error={error} />;
    }

    if (loading) {
      return (
        <div className={style.loading}>
          <Loading />
        </div>
      );
    }

    return (
      <div className={style.pageBody}>
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          fullWidth
        >
          <Tab label="Liste d'opérations" />
          <Tab label="Information personelle" />
        </Tabs>
        <SwipeableViews
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer>
            <Operations
              id={n.supplier.id}
            />
          </TabContainer>
          <TabContainer>
            <PersonalInfo supplier={n.supplier}/>
          </TabContainer>
        </SwipeableViews>
      </div>
    );
  }
}

export default compose(injectIntl, withStyles(styles))(PageBody);
