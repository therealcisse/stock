import Store from 'Store';

import React from 'react';
import T from 'prop-types';

import Link from 'react-router-dom/Link';

import * as DataLoader from 'routes/Supplier/DataLoader';

import compose from 'redux/lib/compose';

import { withStyles } from 'material-ui/styles';

import Typography from 'material-ui/Typography';

import { PATH_EXPENSE_PREFIX } from 'vars';

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';

import { injectIntl } from 'react-intl';

import Paper from 'material-ui/Paper';

import Empty from './Empty';

import Loading from 'components/Loading';

import style from 'routes/Supplier/styles';

const styles = theme => ({
  paper: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
});

const columnData = [
  {
    id: 'prefix',
    numeric: false,
    disableSorting: true,
    disablePadding: true,
    label: '',
  },
  {
    id: 'expense.dateCreated',
    numeric: false,
    disablePadding: false,
    label: 'DATE',
  },
  {
    id: 'expense.refNo',
    numeric: false,
    disablePadding: false,
    label: 'Nº',
  },
  {
    id: 'balanceDue',
    numeric: true,
    disablePadding: false,
    label: 'SOLDE',
  },
  {
    id: 'total',
    numeric: true,
    disablePadding: false,
    label: 'TOTAL',
  },
];

class EnhancedTableHead extends React.Component {
  static propTypes = {
    onRequestSort: T.func.isRequired,
    order: T.string.isRequired,
    orderBy: T.string.isRequired,
  };

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
          {columnData.map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                disablePadding={column.disablePadding}
              >
                {column.disableSorting ? (
                  column.label
                ) : (
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                )}
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

class Operations extends React.Component {
  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (
      this.props.data.variables.query.orderBy === property &&
      this.props.data.variables.query.order === 'desc'
    ) {
      order = 'asc';
    }

    if (
      this.props.data.variables.query.orderBy !== orderBy ||
      this.props.data.variables.query.order !== order
    ) {
      Store.set({
        'supplier.expenses.order': order,
        'supplier.expenses.orderBy': orderBy,
      });

      this.props.data.refetch({ query: { order, orderBy } });
    }
  };

  render() {
    const { data, intl, classes } = this.props;

    if (data.loading) {
      return (
        <div className={style.loading}>
          <Loading />
        </div>
      );
    }

    const { error, getSupplierExpenses: n, variables: { query } } = data;

    if (n.expenses.length === 0) {
      return <Empty />;
    }

    return (
      <div className={style.pageBody}>
        <Table>
          <EnhancedTableHead
            order={query.order}
            orderBy={query.orderBy}
            onRequestSort={this.handleRequestSort}
          />
          <TableBody>
            {n.expenses.map(n => {
              return (
                <TableRow hover tabIndex={-1} key={n.expense.id}>
                  <TableCell disablePadding>{''}</TableCell>
                  <TableCell>
                    {intl.formatDate(n.expense.dateCreated, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <Link to={PATH_EXPENSE_PREFIX + '/' + n.expense.id}>
                      <Typography color="inherit">
                        {n.expense.refNo || <span>&mdash;</span>}
                      </Typography>
                    </Link>
                  </TableCell>
                  <TableCell numeric>
                    {intl.formatNumber(n.balanceDue, { format: 'MAD' })}
                  </TableCell>
                  <TableCell numeric>
                    {intl.formatNumber(n.total, { format: 'MAD' })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default compose(injectIntl, withStyles(styles), DataLoader.expenses)(
  Operations,
);
