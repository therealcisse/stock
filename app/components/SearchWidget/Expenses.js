import React from 'react';

import { graphql } from 'react-apollo';

import Link from 'react-router-dom/Link';

import moment from 'moment';

import { PATH_EXPENSE_PREFIX } from 'vars';

import SearchExpensesQuery from './searchExpenses.query.graphql';

import compose from 'redux/lib/compose';

import style from './SearchWidget.scss';

import cx from 'classnames';

class Expenses extends React.Component {
  render() {
    const { data, handleRequestClose } = this.props;
    const { searchExpenses = [] } = data;

    if (searchExpenses.length === 0) {
      return null;
    }

    return (
      <div className={cx(style.result, style.expenses)}>
        <div className={style.eQxqTz}>
          <div className={style.boCzJo}>
            <div className={style.kkwoZI}>Dépenses</div>
          </div>
        </div>
        <div className={style.list}>
          {searchExpenses.map(e => (
            <Link
              className={style.link}
              onClick={handleRequestClose}
              to={PATH_EXPENSE_PREFIX + '/' + e.id}
            >
              <span>{/* icon */}</span>
              <span className={style.content}>
                <span className={style.text}>
                  Dépense <b>{e.refNo || <span>&mdash;</span>}</b>
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

const searchExpenses = graphql(SearchExpensesQuery, {
  options: ownProps => ({
    variables: { q: ownProps.q },
  }),
});

export default compose(searchExpenses)(Expenses);
