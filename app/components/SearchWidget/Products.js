import React from 'react';

import { graphql } from 'react-apollo';

import Link from 'react-router-dom/Link';

import { PATH_PRODUCT_PREFIX } from 'vars';

import moment from 'moment';

import SearchProductsQuery from './searchProducts.query.graphql';

import compose from 'redux/lib/compose';

import style from './SearchWidget.scss';

import cx from 'classnames';

class Products extends React.Component {
  render() {
    const { data, handleRequestClose } = this.props;
    const { searchProducts = [] } = data;

    if (searchProducts.length === 0) {
      return null;
    }

    return (
      <div className={cx(style.result, style.products)}>
        <div className={style.eQxqTz}>
          <div className={style.boCzJo}>
            <div className={style.kkwoZI}>Produits</div>
          </div>
        </div>
        <div className={style.list}>
          {searchProducts.map(e => (
            <Link
              className={style.link}
              onClick={handleRequestClose}
              to={PATH_PRODUCT_PREFIX + '/' + e.product.id}
            >
              <span>{/* icon */}</span>
              <span className={style.content}>
                <span className={style.text}>{e.product.displayName}</span>
                <span className={style.hint}>
                  {moment(e.product.dateCreated).format('d MMM YYYY')}
                </span>
              </span>
              <span className={cx(style.stock, e.stock > 0 || style.stockBad)}>
                <span className={style.text}>{e.stock}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    );
  }
}

const searchProducts = graphql(SearchProductsQuery, {
  options: ownProps => ({
    variables: { q: ownProps.q },
  }),
});

export default compose(searchProducts)(Products);
