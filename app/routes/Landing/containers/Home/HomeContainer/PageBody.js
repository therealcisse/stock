import React from 'react';
import T from 'prop-types';

import Typography from 'material-ui/Typography';

import compose from 'redux/lib/compose';

import { withStyles } from 'material-ui/styles';

import { injectIntl } from 'react-intl';

import style from 'routes/Landing/styles';

import PaperSheet from './PaperSheet';

const styles = theme => ({});

class PageBody extends React.Component {
  render() {
    const { intl, classes } = this.props;

    return (
      <div className={style.pageBody}>
        <div className={style.graphs}>
          <PaperSheet />
          <PaperSheet />
          <PaperSheet />
        </div>

        <div className={style.events}>
          <Typography type="headline" component="h3">
            Événnements récents
          </Typography>
          <div />
        </div>
      </div>
    );
  }
}

export default compose(injectIntl, withStyles(styles))(PageBody);
