import Store from 'Store';

import React from 'react';

import IconButton from 'material-ui/IconButton';
import Trash from 'material-ui-icons/Delete';

import { TransactionStatus } from 'data/types';

import Typography from 'material-ui/Typography';

import style from 'routes/Expense/styles';

import cx from 'classnames';

import sort from 'lodash.orderby';

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';

import DelExpensePayment from './DelExpensePayment';

import EnhancedTableHead from './EnhancedTableHead';

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

class Payments extends React.PureComponent {
  state = {
    order: Store.get(
      `expense.payments.${this.props.n.expense.id}.order`,
      'desc',
    ),
    orderBy: Store.get(
      `expense.payments.${this.props.n.expense.id}.orderBy`,
      'dateCreated',
    ),

    dialogOpen: false,
    payment: null,
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false, payment: null });
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

      Store.set({
        [`expense.payments.${this.props.n.expense.id}.order`]: order,
        [`expense.payments.${this.props.n.expense.id}.orderBy`]: orderBy,
      });

      return { order, orderBy };
    });
  };

  getItems = payments => {
    const { order, orderBy } = this.state;

    return sort(payments, [orderBy], [order]);
  };

  handleTrash = id => this.setState({ dialogOpen: true, payment: { id } });

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
                          {payment.status ===
                          TransactionStatus.CANCELLED ? null : (
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

        {(() => {
          const { dialogOpen, payment } = this.state;

          if (!dialogOpen) {
            return null;
          }

          return (
            <DelExpensePayment
              id={payment.id}
              handleRequestClose={this.handleDialogClose}
            />
          );
        })()}
      </div>
    );
  }
}

export default Payments;
