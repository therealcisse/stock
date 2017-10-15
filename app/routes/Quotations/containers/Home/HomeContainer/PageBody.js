import Store from 'Store';

import React from 'react';
import T from 'prop-types';

import BatchRender from 'components/BatchRender';

import Typography from 'material-ui/Typography';

import Link from 'react-router-dom/Link';

import * as DataLoader from 'routes/Quotations/DataLoader';

import compose from 'redux/lib/compose';

import { withStyles } from 'material-ui/styles';

import { PATH_CLIENT_PREFIX, PATH_QUOTATION_PREFIX } from 'vars';

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

import style from 'routes/Quotations/styles';

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
    id: 'quotation.dateCreated',
    numeric: false,
    disablePadding: false,
    label: 'DATE',
  },
  {
    id: 'quotation.refNo',
    numeric: false,
    disablePadding: false,
    label: 'Nº',
  },
  {
    id: 'quotation.client.displayName',
    numeric: false,
    disablePadding: false,
    label: 'CLIENT',
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

    if (
      this.props.data.variables.query.orderBy !== orderBy ||
      this.props.data.variables.query.order !== order
    ) {
      Store.set({
        'quotations.order': order,
        'quotations.orderBy': orderBy,
      });

      this.props.data.refetch({ query: { order, orderBy } });
    }
  };

  renderItem = n => {
    const { intl } = this.props;
    return (
      <TableRow hover tabIndex={-1} key={n.quotation.id}>
        <TableCell padding="none">{''}</TableCell>
        <TableCell>
          {intl.formatDate(n.quotation.dateCreated, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </TableCell>
        <TableCell>
          <Link
            to={PATH_QUOTATION_PREFIX + '/' + n.quotation.id}
            className={style.displayNameLink}
          >
            <Typography color="inherit" type="body1" noWrap>
              {n.quotation.refNo}
            </Typography>
          </Link>
        </TableCell>
        <TableCell>
          <Link
            to={PATH_CLIENT_PREFIX + '/' + n.quotation.client.id}
            className={style.displayNameLink}
          >
            <Typography type="body1" noWrap>
              {n.quotation.client.displayName}
            </Typography>
          </Link>
        </TableCell>
        <TableCell numeric>
          {intl.formatNumber(n.total, { format: 'MAD' })}
        </TableCell>
      </TableRow>
    );
  };

  render() {
    const { data, intl, classes } = this.props;
    const { loading, error, quotations: n, variables: { query } } = data;

    if (loading) {
      return (
        <div className={style.loading}>
          <Loading />
        </div>
      );
    }

    if (n.quotations.length === 0) {
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
            <BatchRender items={n.quotations} renderItem={this.renderItem} />
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default compose(injectIntl, withStyles(styles), DataLoader.quotations)(
  PageBody,
);
