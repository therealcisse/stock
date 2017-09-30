import React from 'react';
import T from 'prop-types';

import Typography from 'material-ui/Typography';

import Link from 'react-router-dom/Link';

import * as DataLoader from 'routes/Sales/DataLoader';

import compose from 'redux/lib/compose';

import { withStyles } from 'material-ui/styles';

import { PATH_CLIENT_PREFIX, PATH_SALE_PREFIX, SALE_REF_NO_BASE } from 'vars';

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

import style from 'routes/Sales/styles';

const styles = theme => ({
  paper: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
});

const columnData = [
  {
    id: 'sale.dateCreated',
    numeric: false,
    disablePadding: true,
    label: 'DATE',
  },
  {
    id: 'sale.refNo',
    numeric: false,
    disablePadding: false,
    label: 'Nº',
  },
  {
    id: 'sale.client.displayName',
    numeric: false,
    disablePadding: false,
    label: 'CLIENT',
  },

  // {
  //   id: 'paid',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Paiement',
  // },
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
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={order}
                  onClick={this.createSortHandler(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

class PageBody extends React.Component {
  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (
      this.props.data.variables.query.orderBy === property &&
      this.props.data.variables.query.order === 'desc'
    ) {
      order = 'asc';
    }

    this.props.data.refetch({ query: { order, orderBy } });
  };

  render() {
    const { data, intl, classes } = this.props;
    const { loading, error, sales: n, variables: { query } } = data;

    if (loading) {
      return (
        <div className={style.loading}>
          <Loading />
        </div>
      );
    }

    if (n.sales.length === 0) {
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
            {n.sales.map(n => {
              return (
                <TableRow hover tabIndex={-1} key={n.sale.id}>
                  <TableCell disablePadding>
                    {intl.formatDate(n.sale.dateCreated, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <Link
                      to={PATH_SALE_PREFIX + '/' + n.sale.id}
                      className={style.displayNameLink}
                    >
                      <Typography type="body1" noWrap>
                        {n.sale.refNo + SALE_REF_NO_BASE}
                      </Typography>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={PATH_CLIENT_PREFIX + '/' + n.sale.client.id}
                      className={style.displayNameLink}
                    >
                      <Typography type="body1" noWrap>
                        {n.sale.client.displayName}
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
  PageBody,
);
