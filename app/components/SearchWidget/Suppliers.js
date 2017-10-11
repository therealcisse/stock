import React from 'react';

import Link from 'react-router-dom/Link';

import { PATH_SUPPLIER_PREFIX } from 'vars';

import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

import { graphql } from 'react-apollo';

import SearchSuppliersQuery from './searchSuppliers.query.graphql';

import compose from 'redux/lib/compose';

import style from './SearchWidget.scss';

import cx from 'classnames';

class Suppliers extends React.Component {
  render() {
    const { data, q, handleRequestClose } = this.props;
    const { searchSuppliers = [] } = data;

    if (searchSuppliers.length === 0) {
      return null;
    }

    return (
      <div className={cx(style.result, style.suppliers)}>
        <div className={style.eQxqTz}>
          <div className={style.boCzJo}>
            <div className={style.kkwoZI}>Fourniseurs</div>
          </div>
        </div>
        <div className={style.list}>
          {searchSuppliers.map(suggestion =>
            renderSuggestion(suggestion, { query: q, handleRequestClose }),
          )}
        </div>
      </div>
    );
  }
}

function renderSuggestion(suggestion, { query, handleRequestClose }) {
  const matches = match(suggestion.displayName, query);
  const parts = parse(suggestion.displayName, matches);

  return (
    <Link
      className={style.link}
      onClick={handleRequestClose}
      to={PATH_SUPPLIER_PREFIX + '/' + suggestion.id}
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
    </Link>
  );
}

const searchSuppliers = graphql(SearchSuppliersQuery, {
  options: ownProps => ({
    variables: { q: ownProps.q },
  }),
});

export default compose(searchSuppliers)(Suppliers);
