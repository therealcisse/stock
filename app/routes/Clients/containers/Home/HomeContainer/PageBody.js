import Store from 'Store';

import React from 'react';
import T from 'prop-types';

import Typography from 'material-ui/Typography';

import Link from 'react-router-dom/Link';

import * as DataLoader from 'routes/Clients/DataLoader';

import compose from 'redux/lib/compose';

import { withStyles } from 'material-ui/styles';

import { PATH_CLIENT_PREFIX } from 'vars';

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

import style from 'routes/Clients/styles';

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
    id: 'client.displayName',
    numeric: false,
    disablePadding: false,
    label: 'NOM DU CLIENT',
  },
  {
    id: 'client.tel',
    numeric: false,
    disablePadding: false,
    label: 'TÉLÉPHONE',
  },
  {
    id: 'openCount',
    numeric: true,
    disablePadding: false,
    label: 'FACTURES EN ATTENTE',
  },
  {
    id: 'totalPaid',
    numeric: true,
    disablePadding: false,
    label: 'PAIEMENTS EFFECTUEÉS',
  },
  {
    id: 'balanceDue',
    numeric: true,
    disablePadding: false,
    label: 'SOLDE COURANT',
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
        'clients.order': order,
        'clients.orderBy': orderBy,
      });

      this.props.data.refetch({ query: { order, orderBy } });
    }
  };

  render() {
    const { data, intl, classes } = this.props;
    const {
      loading,
      error,
      getAllClients: clients,
      variables: { query },
    } = data;

    if (loading) {
      return (
        <div className={style.loading}>
          <Loading />
        </div>
      );
    }

    if (clients.length === 0) {
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
            {clients.map(n => {
              return (
                <TableRow hover tabIndex={-1} key={n.client.id}>
                  <TableCell disablePadding>{''}</TableCell>
                  <TableCell>
                    <Link
                      to={PATH_CLIENT_PREFIX + '/' + n.client.id}
                      className={style.displayNameLink}
                    >
                      <Typography color="inherit" type="body1" noWrap>
                        {n.client.displayName}
                      </Typography>
                    </Link>
                  </TableCell>
                  <TableCell>{n.client.tel || <span>&mdash;</span>}</TableCell>
                  <TableCell numeric>{n.openCount}</TableCell>
                  <TableCell numeric>
                    {intl.formatNumber(n.totalPaid, { format: 'MAD' })}
                  </TableCell>
                  <TableCell numeric>
                    {intl.formatNumber(n.balanceDue, { format: 'MAD' })}
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

export default compose(injectIntl, withStyles(styles), DataLoader.clients)(
  PageBody,
);
