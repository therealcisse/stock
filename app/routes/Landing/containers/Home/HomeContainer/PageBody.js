import React from 'react';
import T from 'prop-types';

import compose from 'redux/lib/compose';

import { withStyles } from 'material-ui/styles';

import { injectIntl } from 'react-intl';

import Loading from 'components/Loading';

import style from 'routes/Landing/styles';

import TestGraph from './TestGraph';

const styles = theme => ({});

class PageBody extends React.Component {
  render() {
    const { intl, loading, classes } = this.props;

    if (loading) {
      return (
        <div className={style.loading}>
          <Loading />
        </div>
      );
    }

    return (
      <div className={style.pageBody}>
        <TestGraph width={500} height={600} />
      </div>
    );
  }
}

export default compose(injectIntl, withStyles(styles))(PageBody);
