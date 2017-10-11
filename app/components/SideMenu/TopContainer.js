import React from 'react';

import { connect } from 'react-redux';

import { compose, bindActionCreators } from 'redux';

import { toggleSearch } from 'redux/reducers/app/actions';

import { withStyles } from 'material-ui/styles';
import Tooltip from 'material-ui/Tooltip';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';

import SearchButtonIcon from 'material-ui-icons/Search';

import style from './SideMenu.scss';

import cx from 'classnames';

import moment from 'moment';

import { DATE_FORMAT } from 'vars';

import SaleForm from 'routes/Sales/containers/Home/HomeContainer/SaleForm';
import ExpenseForm from 'routes/Expenses/containers/Home/HomeContainer/ExpenseForm';

import ClientForm from 'routes/Clients/containers/Home/HomeContainer/ClientForm';
import SupplierForm from 'routes/Suppliers/containers/Home/HomeContainer/SupplierForm';

import ProductForm from 'routes/Products/containers/Home/HomeContainer/ProductForm';

const styles = theme => ({});

class TopContainer extends React.Component {
  state = {
    dialogOpen: null,
  };

  handleClick = dialogOpen => this.setState({ dialogOpen });

  handleRequestClose = () => this.setState({ dialogOpen: null });

  render() {
    const { classes, actions } = this.props;
    return (
      <div className={style['kfFTAe']}>
        {(() => {
          switch (this.state.dialogOpen) {
            case 'sales':
              return (
                <SaleForm
                  onClose={this.handleRequestClose}
                  initialValues={{
                    dateCreated: moment().format(DATE_FORMAT),
                    items: [],
                  }}
                />
              );

            case 'expenses':
              return (
                <ExpenseForm
                  onClose={this.handleRequestClose}
                  initialValues={{
                    dateCreated: moment().format(DATE_FORMAT),
                    items: [],
                  }}
                />
              );

            case 'clients':
              return (
                <ClientForm
                  onClose={this.handleRequestClose}
                  initialValues={{}}
                  title="Nouveau client"
                />
              );

            case 'suppliers':
              return (
                <SupplierForm
                  onClose={this.handleRequestClose}
                  initialValues={{}}
                  title="Nouveau fournisseur"
                />
              );

            case 'products':
              return (
                <ProductForm
                  onClose={this.handleRequestClose}
                  initialValues={{}}
                  title="Nouveau produit"
                />
              );

            default:
              return null;
          }
        })()}
        <Tooltip title="Rechercher" placement="right">
          <div onClick={actions.toggleSearch} className={style['fSDZOA']}>
            <span className={style['fcnKTg']}>
              <span
                style={{
                  display: 'inline-block',
                  lineHeight: 1,
                  width: 24,
                  height: 24,
                  color: 'currentcolor',
                  fill: 'white',
                }}
              >
                <SearchButtonIcon width={24} height={24} />
              </span>
            </span>
          </div>
        </Tooltip>

        <Dropdown onSelect={this.handleClick}>
          <Dropdown.Toggle componentClass={AddButton} />
          <Dropdown.Menu className={style.addMenu}>
            <MenuItem eventKey="sales" key="sales">
              Vente
            </MenuItem>
            <MenuItem eventKey="expenses" key="expenses">
              Dépense
            </MenuItem>
            <MenuItem key="0" divider />
            <MenuItem eventKey="products" key="products">
              Produit
            </MenuItem>
            <MenuItem key="1" divider />
            <MenuItem eventKey="clients" key="clients">
              Client
            </MenuItem>
            <MenuItem eventKey="suppliers" key="suppliers">
              Fournisseur
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}

function AddButton({ onClick, tabIndex, role }) {
  return (
    <Tooltip title="Créer" placement="right">
      <div
        onClick={onClick}
        tabIndex={tabIndex}
        role={role}
        className={style['fSDZOA']}
      >
        <span className={style['fcnKTg']}>
          <span
            style={{
              display: 'inline-block',
              lineHeight: 1,
              width: 24,
              height: 24,
              color: 'currentcolor',
              fill: 'white',
            }}
          >
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              focusable="false"
              role="img"
              style={{
                height: 24,
                maxHeight: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                verticalAlign: 'right',
                width: 24,
              }}
            >
              <g fill="currentColor" fillRule="evenodd">
                <path d="M11 3h2v18h-2z" role="presentation" />
                <path
                  d="M3.993 11A.997.997 0 0 0 3 12c0 .557.445 1 .993 1h16.014A.997.997 0 0 0 21 12c0-.556-.445-1-.993-1H3.993z"
                  role="presentation"
                />
              </g>
            </svg>
          </span>
        </span>
      </div>
    </Tooltip>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        toggleSearch,
      },
      dispatch,
    ),
  };
}

const Connect = connect(null, mapDispatchToProps);

export default compose(withStyles(styles), Connect)(TopContainer);
