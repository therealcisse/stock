import React from 'react';
import T from 'prop-types';

import pick from 'lodash.pick';

import * as DataLoader from 'routes/Products/DataLoader';

import Typography from 'material-ui/Typography';

import compose from 'redux/lib/compose';

import Button from 'material-ui/Button';

import { withStyles } from 'material-ui/styles';

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';

import { injectIntl } from 'react-intl';

import Empty from './Empty';

import Loading from 'components/Loading';

import style from 'routes/Products/styles';

import cx from 'classnames';

import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import MoreHorizIcon from 'material-ui-icons/MoreHoriz';

import ProductForm from './ProductForm';

const styles = theme => ({
  paper: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
});

const options = ['Modifier'];

const ITEM_HEIGHT = 48;

const columnData = [
  { id: 'name', numeric: false, disablePadding: true, label: 'NOM DU PRODUIT' },
  {
    id: 'ref',
    numeric: false,
    disablePadding: false,
    label: 'RÉFÉRENCE',
  },
  {
    id: 'unitPrice',
    numeric: true,
    disablePadding: false,
    label: 'PRIX UNITAIRE',
  },
  { id: 'stock', numeric: true, disablePadding: false, label: '# STOCK' },
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
  state = {
    anchorEls: {},
    open: {},
    dialogOpen: false,
    editing: null,
  };

  handleClickOpen = editing => {
    this.setState({ dialogOpen: true, editing, open: {}, anchorEls: {} });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false, editing: null });
  };

  handleClick = (id, event) => {
    const anchorEl = event.currentTarget;

    this.setState(state => ({
      open: { ...state.open, [id]: true },
      anchorEls: {
        ...state.anchorEls,
        [id]: anchorEl,
      },
    }));
  };

  handleRequestClose = id => {
    this.setState(state => ({
      open: { ...state.open, [id]: false },
    }));
  };

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
    const {
      loading,
      error,
      getAllProducts: products,
      variables: { query },
    } = data;

    if (loading) {
      return (
        <div className={style.loading}>
          <Loading />
        </div>
      );
    }

    if (products.length === 0) {
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
            {products.map(n => {
              return (
                <TableRow hover tabIndex={-1} key={n.product.id}>
                  <TableCell disablePadding>
                    <div className={style.displayName}>
                      <Typography type="body1" noWrap>
                        {n.product.displayName}
                      </Typography>
                      <div className={style.actions}>
                        <IconButton
                          aria-label="Actions"
                          aria-owns={
                            this.state.open[n.product.id] ? 'long-menu' : null
                          }
                          aria-haspopup="true"
                          onClick={this.handleClick.bind(this, n.product.id)}
                        >
                          <MoreHorizIcon />
                        </IconButton>
                        <Menu
                          id="long-menu"
                          anchorEl={this.state.anchorEls[n.product.id]}
                          open={this.state.open[n.product.id]}
                          onRequestClose={this.handleRequestClose.bind(
                            this,
                            n.product.id,
                          )}
                          PaperProps={{
                            style: {
                              maxHeight: ITEM_HEIGHT * 4.5,
                              width: 200,
                            },
                          }}
                        >
                          {options.map(option => (
                            <MenuItem
                              key={option}
                              onClick={this.handleClickOpen.bind(this, {
                                id: n.product.id,
                                displayName: n.product.displayName,
                                unitPrice: n.product.unitPrice
                                  ? intl.formatNumber(n.product.unitPrice, {
                                      format: 'MONEY',
                                    })
                                  : null,
                              })}
                            >
                              {option}
                            </MenuItem>
                          ))}
                        </Menu>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{n.product.ref || <span>&mdash;</span>}</TableCell>
                  <TableCell numeric>
                    {n.product.unitPrice ? (
                      intl.formatNumber(n.product.unitPrice, { format: 'MAD' })
                    ) : (
                      <span>&mdash;</span>
                    )}
                  </TableCell>
                  <TableCell
                    numeric
                    className={cx(
                      style.stockNumber,
                      n.stock <= 0 && style.negative,
                    )}
                  >
                    {Math.abs(n.stock)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {this.state.dialogOpen ? (
          <ProductForm
            onClose={this.handleDialogClose}
            initialValues={{
              ...pick(this.state.editing, ['displayName', 'unitPrice']),
            }}
            id={this.state.editing.id}
            title="Modifier le produit"
          />
        ) : null}
      </div>
    );
  }
}

export default compose(injectIntl, withStyles(styles), DataLoader.products)(
  PageBody,
);
