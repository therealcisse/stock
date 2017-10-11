import Store from 'Store';

import React from 'react';
import T from 'prop-types';

import Typography from 'material-ui/Typography';

import Link from 'react-router-dom/Link';

import * as DataLoader from 'routes/Client/DataLoader';

import compose from 'redux/lib/compose';

import { withStyles } from 'material-ui/styles';

import Empty from './Empty';

import { SALES_REF_NO_BASE, PATH_SALE_PREFIX } from 'vars';

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';

import { injectIntl } from 'react-intl';

import Paper from 'material-ui/Paper';

import Loading from 'components/Loading';

import style from 'routes/Client/styles';

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
    id: 'sale.dateCreated',
    numeric: false,
    disablePadding: false,
    label: 'DATE',
  },
  {
    id: 'sale.refNo',
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
                padding={column.disablePadding ? 'none' : 'default'}
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

class ClientSales extends React.Component {
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
        'client.sales.order': order,
        'client.sales.orderBy': orderBy,
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

    const { loading, error, getClientSales: n, variables: { query } } = data;

    if (n.sales.length === 0) {
      return <Empty />;
    }

    return (
      <div className={style.pageBody}>
        {/* <Typography type='title'> */}
        {/*   Factures de vente */}
        {/* </Typography> */}
        {/* <br/> */}
        {/* <br/> */}
        <Table>
          <EnhancedTableHead
            order={query.order}
            orderBy={query.orderBy}
            onRequestSort={this.handleRequestSort}
          />
          <TableBody>
            {n.sales.map(n => {
              return (
                <TableRow hover tabIndex={-1} key={n.sale.id}>
                  <TableCell padding="none">{''}</TableCell>
                  <TableCell>
                    {intl.formatDate(n.sale.dateCreated, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <Link to={PATH_SALE_PREFIX + '/' + n.sale.id}>
                      <Typography color="inherit">
                        {n.sale.refNo + SALES_REF_NO_BASE}
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

export default compose(injectIntl, withStyles(styles), DataLoader.sales)(
  ClientSales,
);
