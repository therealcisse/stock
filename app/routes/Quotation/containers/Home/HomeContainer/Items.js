import Store from 'Store';

import React from 'react';

import Typography from 'material-ui/Typography';

import style from 'routes/Quotation/styles';

import cx from 'classnames';

import sort from 'lodash.orderby';

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';

import EnhancedTableHead from './EnhancedTableHead';

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
    label: 'PRODUIT',
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

export default class Items extends React.PureComponent {
  state = {
    order: Store.get(
      `quotation.items.${this.props.n.quotation.id}.order`,
      'desc',
    ),
    orderBy: Store.get(
      `quotation.items.${this.props.n.quotation.id}.orderBy`,
      'unitPrice',
    ),
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
        [`quotation.items.${this.props.n.quotation.id}.order`]: order,
        [`quotation.items.${this.props.n.quotation.id}.orderBy`]: orderBy,
      });

      return { order, orderBy };
    });
  };

  getItems = quotationItems => {
    const items = quotationItems.map(item => ({
      ...item,
      total: item.qty * item.unitPrice,
    }));

    const { order, orderBy } = this.state;

    return sort(items, [orderBy], [order]);
  };

  render() {
    const { classes, intl, n } = this.props;

    const items = this.getItems(n.quotation.items);

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
                      <TableCell padding="none">{''}</TableCell>
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
                      <TableCell padding="none">{''}</TableCell>
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
                  <TableCell padding="none">{''}</TableCell>
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
                  <TableCell padding="none">{''}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}
