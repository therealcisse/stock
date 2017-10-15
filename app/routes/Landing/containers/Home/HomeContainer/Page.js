import React from 'react';

import compose from 'redux/lib/compose';

import style from 'routes/Landing/styles';

import { injectIntl } from 'react-intl';

import PageBody from './PageBody';

class Page extends React.Component {
  render() {
    const { intl } = this.props;

    return (
      <div className={style.page}>
        <PageBody />
      </div>
    );
  }
}

export default compose(injectIntl)(Page);
