import React from 'react';

import { graphql } from 'react-apollo';

import Link from 'react-router-dom/Link';

import { PATH_QUOTATION_PREFIX } from 'vars';

import moment from 'moment';

import SearchQuotationsQuery from './searchQuotations.query.graphql';

import compose from 'redux/lib/compose';

import style from './SearchWidget.scss';

import cx from 'classnames';

class Quotations extends React.Component {
  render() {
    const { data, handleRequestClose } = this.props;
    const { searchQuotations = [] } = data;

    if (searchQuotations.length === 0) {
      return null;
    }

    return (
      <div className={cx(style.result, style.sales)}>
        <div className={style.eQxqTz}>
          <div className={style.boCzJo}>
            <div className={style.kkwoZI}>Devis</div>
          </div>
        </div>
        <div className={style.list}>
          {searchQuotations.map(e => (
            <Link
              className={style.link}
              onClick={handleRequestClose}
              to={PATH_QUOTATION_PREFIX + '/' + e.id}
            >
              <span>{/* icon */}</span>
              <span className={style.content}>
                <span className={style.text}>
                  Devis <b>#{e.refNo}</b>
                </span>
                <span className={style.hint}>
                  {moment(e.dateCreated).format('d MMM YYYY')}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    );
  }
}

const searchQuotations = graphql(SearchQuotationsQuery, {
  options: ownProps => ({
    variables: { q: ownProps.q },
  }),
});

export default compose(searchQuotations)(Quotations);
