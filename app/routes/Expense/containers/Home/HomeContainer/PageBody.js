import React from 'react';
import T from 'prop-types';

import Link from 'react-router-dom/Link';

import IconButton from 'material-ui/IconButton';
import Trash from 'material-ui-icons/Delete';

import compose from 'redux/lib/compose';

import { withStyles } from 'material-ui/styles';

import { injectIntl } from 'react-intl';

import { Client } from 'data/types';

import Typography from 'material-ui/Typography';

import { PATH_CLIENT_PREFIX, PATH_SUPPLIER_PREFIX } from 'vars';

import sort from 'lodash.orderby';

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';

import Paper from 'material-ui/Paper';

import Loading from 'components/Loading';

import style from 'routes/Expense/styles';

import cx from 'classnames';

import NotFound from './NotFound';

const styles = theme => ({
  paper: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },

  totalRow: {
    borderBottom: 'none',
  },
});

const paymentsColumnData = [
  {
    id: 'prefix',
    numeric: false,
    disableSorting: true,
    disablePadding: true,
    label: '',
  },
  {
    id: 'dateCreated',
    numeric: false,
    disablePadding: false,
    label: 'DATE',
  },
  {
    id: 'amount',
    numeric: true,
    disablePadding: false,
    label: 'MONTANT',
  },
  {
    id: 'suffix',
    numeric: true,
    disableSorting: true,
    disablePadding: true,
    label: '',
  },
];

const itemsColumnData = [
  {
    id: 'prefix',
    numeric: false,
    disableSorting: true,
    disablePadding: true,
    label: '',
  },
  {
    id: 'product.displayName',
    numeric: false,
    disablePadding: false,
    label: 'Produit',
  },
  {
    id: 'qty',
    numeric: true,
    disablePadding: false,
    label: 'QTÉ',
  },
  {
    id: 'unitPrice',
    numeric: true,
    disablePadding: false,
    label: 'PRIX UNIATIRE',
  },
  {
    id: 'total',
    numeric: true,
    disablePadding: false,
    label: 'TOTAL',
  },
  {
    id: 'suffix',
    numeric: true,
    disableSorting: true,
    disablePadding: true,
    label: '',
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
    const { order, orderBy, columnData } = this.props;

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
  render() {
    const { data, intl, classes } = this.props;
    const { loading, error, getExpense: n } = data;

    if (error) {
      return <NotFound error={error} />;
    }

    if (loading) {
      return (
        <div className={style.loading}>
          <Loading />
        </div>
      );
    }

    return (
      <div className={style.pageBody}>
        <BeneficiaryInfo n={n} />
        <Items classes={classes} intl={intl} n={n} />
        <Payments intl={intl} n={n} />
      </div>
    );
  }
}

function BeneficiaryInfo({ n }) {
  return (
    <div className={cx(style.entrySection, style.leftPadding10)}>
      <div>
        <div
          className={cx(
            style.stageAmountLabel,
            style.upperCase,
            style.alignTextLeft,
          )}
        >
          Bénéficier
        </div>
        <div className={style.amount}>
          <Link
            to={
              (Client.isClient(n.expense.beneficiary)
                ? PATH_CLIENT_PREFIX
                : PATH_SUPPLIER_PREFIX) +
              '/' +
              n.expense.beneficiary.id
            }
          >
            {n.expense.beneficiary.displayName}
          </Link>
        </div>
      </div>
    </div>
  );
}

class Payments extends React.PureComponent {
  state = {
    order: 'desc',
    orderBy: 'dateCreated',
  };

  handleRequestSort = (event, property) => {
    this.setState(prevState => {
      const orderBy = property;
      let order = 'desc';

      if (prevState.orderBy === property && prevState.order === 'desc') {
        order = 'asc';
      }

      if (prevState.order === order && prevState.orderBy === property) {
        return null;
      }

      return { order, orderBy };
    });
  };

  getItems = payments => {
    const { order, orderBy } = this.state;

    return sort(payments, [orderBy], [order]);
  };

  handleTrash = id => {};

  render() {
    const { classes, intl, n } = this.props;

    if (n.expense.payments.length === 0) {
      return null;
    }

    const items = this.getItems(n.expense.payments);

    return (
      <div className={cx(style.entrySection, style.leftPadding10)}>
        <div>
          <div
            className={cx(
              style.stageAmountLabel,
              style.upperCase,
              style.alignTextLeft,
            )}
          >
            Paiements
          </div>

          <br />

          <div>
            <Table>
              <EnhancedTableHead
                columnData={paymentsColumnData}
                order={this.state.order}
                orderBy={this.state.orderBy}
                onRequestSort={this.handleRequestSort}
              />
              <TableBody>
                {items.map(payment => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={payment.id}
                      className={style.payment}
                    >
                      <TableCell disablePadding>{''}</TableCell>
                      <TableCell>
                        <div className={style.dateCreated}>
                          <Typography>
                            {intl.formatDate(payment.dateCreated, {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </Typography>
                          {payment.isDeleted ? null : (
                            <div className={style.actions}>
                              <IconButton
                                aria-label="Actions"
                                onClick={this.handleTrash.bind(this, payment.id)}
                                width={24}
                                height={24}
                              >
                                <Trash />
                              </IconButton>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell numeric>
                        {intl.formatNumber(payment.amount, { format: 'MAD' })}
                      </TableCell>
                      <TableCell numeric disablePadding>
                        {''}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className={style.totalsRow}>
            <Table>
              <EnhancedTableHead
                columnData={paymentsColumnData}
                order={this.state.order}
                orderBy={this.state.orderBy}
                onRequestSort={this.handleRequestSort}
              />

              <TableBody>
                <TableRow tabIndex={-1}>
                  <TableCell disablePadding>{''}</TableCell>
                  <TableCell>
                    <Typography type="headline" noWrap>
                      {'TOTAL'}
                    </Typography>
                  </TableCell>
                  <TableCell numeric>
                    {intl.formatNumber(n.paid, { format: 'MAD' })} MAD
                  </TableCell>
                  <TableCell numeric disablePadding>
                    {''}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}
class Items extends React.PureComponent {
  state = {
    order: 'desc',
    orderBy: 'unitPrice',
  };

  handleRequestSort = (event, property) => {
    this.setState(prevState => {
      const orderBy = property;
      let order = 'desc';

      if (prevState.orderBy === property && prevState.order === 'desc') {
        order = 'asc';
      }

      if (prevState.order === order && prevState.orderBy === property) {
        return null;
      }

      return { order, orderBy };
    });
  };

  getItems = expenseItems => {
    const items = expenseItems.map(item => ({
      ...item,
      total: item.qty * item.unitPrice,
    }));

    const { order, orderBy } = this.state;

    return sort(items, [orderBy], [order]);
  };

  render() {
    const { classes, intl, n } = this.props;

    const items = this.getItems(n.expense.items);

    return (
      <div className={cx(style.entrySection, style.leftPadding10)}>
        <div>
          <div
            className={cx(
              style.stageAmountLabel,
              style.upperCase,
              style.alignTextLeft,
            )}
          >
            Lignes
          </div>

          <br />

          <div>
            <Table>
              <EnhancedTableHead
                columnData={itemsColumnData}
                order={this.state.order}
                orderBy={this.state.orderBy}
                onRequestSort={this.handleRequestSort}
              />
              <TableBody>
                {items.map(item => {
                  return (
                    <TableRow hover tabIndex={-1} key={item.id}>
                      <TableCell disablePadding>{''}</TableCell>
                      <TableCell>
                        <Typography type="body1" noWrap>
                          {item.product.displayName}
                        </Typography>
                      </TableCell>
                      <TableCell numeric>{item.qty}</TableCell>
                      <TableCell numeric>
                        {intl.formatNumber(item.unitPrice, { format: 'MAD' })}
                      </TableCell>
                      <TableCell numeric>
                        {intl.formatNumber(item.total, { format: 'MAD' })}
                      </TableCell>
                      <TableCell numeric disablePadding>
                        {''}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className={style.totalsRow}>
            <Table>
              <EnhancedTableHead
                columnData={itemsColumnData}
                order={this.state.order}
                orderBy={this.state.orderBy}
                onRequestSort={this.handleRequestSort}
              />

              <TableBody>
                <TableRow tabIndex={-1}>
                  <TableCell disablePadding>{''}</TableCell>
                  <TableCell>
                    <Typography type="headline" noWrap>
                      {'TOTAL'}
                    </Typography>
                  </TableCell>
                  <TableCell numeric>
                    <span className={style.invisible}>
                      {Math.max(...items.map(item => item.qty))}
                    </span>
                  </TableCell>
                  <TableCell numeric>
                    <span className={style.invisible}>
                      {intl.formatNumber(
                        Math.max(...items.map(({ unitPrice }) => unitPrice)),
                        { format: 'MAD' },
                      )}
                    </span>
                  </TableCell>
                  <TableCell numeric>
                    {intl.formatNumber(n.total, { format: 'MAD' })} MAD
                  </TableCell>
                  <TableCell numeric disablePadding>
                    {''}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(injectIntl, withStyles(styles))(PageBody);
