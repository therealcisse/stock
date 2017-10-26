import React from 'react';

import { graphql } from 'react-apollo';

import Link from 'react-router-dom/Link';

import { PATH_PRODUCT_PREFIX } from 'vars';

import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

import moment from 'moment';

import SearchProductsQuery from './searchProducts.query.graphql';

import compose from 'redux/lib/compose';

import style from './SearchWidget.scss';

import cx from 'classnames';

class Products extends React.Component {
  render() {
    const { data, q, handleRequestClose } = this.props;
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
          {searchProducts.map(suggestion =>
            renderSuggestion(suggestion, { query: q, handleRequestClose }),
          )}
        </div>
      </div>
    );
  }
}

function renderSuggestion(suggestion, { query, handleRequestClose }) {
  const matches = match(suggestion.product.displayName, query);
  const parts = parse(suggestion.product.displayName, matches);

  return (
    <Link
      className={style.link}
      onClick={handleRequestClose}
      to={PATH_PRODUCT_PREFIX + '/' + suggestion.product.id}
    >
      <span className={style.content}>
        <span className={style.text}>
          {parts.map((part, index) => {
            return part.highlight ? (
              <span key={index} style={{ fontWeight: 300 }}>
                {part.text}
              </span>
            ) : (
              <strong key={index} style={{ fontWeight: 700 }}>
                {part.text}
              </strong>
            );
          })}
        </span>
      </span>
      <span className={cx(style.stock, suggestion.stock > 0 || style.stockBad)}>
        <span className={style.text}>{suggestion.stock}</span>
      </span>
    </Link>
  );
}

const searchProducts = graphql(SearchProductsQuery, {
  options: ownProps => ({
    variables: { q: ownProps.q },
  }),
});

export default compose(searchProducts)(Products);
