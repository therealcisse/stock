import React from 'react';

import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form/immutable';

import compose from 'redux/lib/compose';

import { Map } from 'immutable';

import IconButton from 'material-ui/IconButton';

import TrashIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';

import Typography from 'material-ui/Typography';

import style from 'routes/Expenses/styles';

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
    label: 'MONTANT',
  },
  {
    id: 'suffix',
    numeric: true,
    disablePadding: false,
    label: '',
  },
];

class Items extends React.PureComponent {
  state = {};

  getItems = i => {
    const items = i.map(item => ({
      ...item,
      total: item.qty * item.unitPrice,
    }));

    return items;
  };

  editItem = (item, e) => this.props.editItem(e, item);

  render() {
    const { classes, intl, items, removeItem } = this.props;

    const is = this.getItems(items);

    return (
      <div className={cx(style.entrySection, style.leftPadding10)}>
        <div>
          <br />

          <div>
            <Table>
              <EnhancedTableHead columnData={itemsColumnData} />
              <TableBody>
                {is.map((item, index) => {
                  const product = Map.isMap(item.product)
                    ? item.product.toJS()
                    : item.product;
                  return (
                    <TableRow hover tabIndex={-1} key={product.product.id}>
                      <TableCell padding="none">{''}</TableCell>
                      <TableCell>
                        <Typography type="body1" noWrap>
                          {product.product.displayName}
                        </Typography>
                      </TableCell>
                      <TableCell numeric>{item.qty}</TableCell>
                      <TableCell numeric>
                        {intl.formatNumber(item.unitPrice, { format: 'MAD' })}
                      </TableCell>
                      <TableCell numeric>
                        {intl.formatNumber(item.total, { format: 'MAD' })}
                      </TableCell>
                      <TableCell padding="none">
                        <IconButton
                          onClick={this.editItem.bind(this, {
                            index,
                            value: {
                              product: product,
                              unitPrice: intl.formatNumber(item.unitPrice, {
                                format: 'MAD',
                              }),
                              qty: item.qty,
                              id: product.product.id,
                            },
                          })}
                        >
                          <EditIcon />
                        </IconButton>{' '}
                        <IconButton onClick={removeItem.bind(null, index)}>
                          <TrashIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

const selector = formValueSelector('sale');

const mapPropsToState = state => {
  return {
    items: selector(state, 'items'),
  };
};

const ItemsWithInfo = connect(mapPropsToState);

export default compose(ItemsWithInfo)(Items);
