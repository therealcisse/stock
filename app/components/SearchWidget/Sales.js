import React from 'react';

import { graphql } from 'react-apollo';

import Link from 'react-router-dom/Link';

import { PATH_SALE_PREFIX, SALES_REF_NO_BASE } from 'vars';

import moment from 'moment';

import SearchSalesQuery from './searchSales.query.graphql';

import compose from 'redux/lib/compose';

import style from './SearchWidget.scss';

import cx from 'classnames';

class Sales extends React.Component {
  render() {
    const { data, handleRequestClose } = this.props;
    const { searchSales = [] } = data;

    if (searchSales.length === 0) {
      return null;
    }

    return (
      <div className={cx(style.result, style.sales)}>
        <div className={style.eQxqTz}>
          <div className={style.boCzJo}>
            <div className={style.kkwoZI}>Ventes</div>
          </div>
        </div>
        <div className={style.list}>
          {searchSales.map(e => (
            <Link
              className={style.link}
              onClick={handleRequestClose}
              to={PATH_SALE_PREFIX + '/' + e.id}
            >
              <span>{/* icon */}</span>
              <span className={style.content}>
                <span className={style.text}>
                  Vente <b>#{e.refNo + SALES_REF_NO_BASE}</b>
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

const searchSales = graphql(SearchSalesQuery, {
  options: ownProps => ({
    variables: { q: ownProps.q },
  }),
});

export default compose(searchSales)(Sales);
