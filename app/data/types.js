// @flow

import { Record } from 'immutable';

export class User extends Record({
  loading: false,
  changePasswordAtNextLogin: false,
  id: undefined,
  displayName: null,
  email: null,
  username: null,
}) {
  get isEmpty(): boolean {
    return typeof this.id === 'undefined';
  }

  ////////////////////////////////////////////////////////////////

  static fromDatabase({ changePasswordAtNextLogin, password, ...props }) {
    return {
      changePasswordAtNextLogin: Boolean(changePasswordAtNextLogin),
      ...props,
    };
  }
}

export class Business extends Record({
  id: null,
  displayName: null,
  date: null,
  lastModified: null,
}) {
  static fromDatabase({ key, ...props }) {
    return {
      id: key,
      ...props,
    };
  }
}

export class Expense extends Record({
  id: null,
  beneficiaryId: null,
  dateCreated: null,
  state: null,
  date: null,
  lastModified: null,
}) {
  static TYPE = 'EXPENSE';

  static fromDatabase({ ...props }) {
    return {
      ...props,
    };
  }
}

export class Quotation extends Record({
  id: null,
  refNo: null,
  clientId: null,
  dateCreated: null,
  state: null,

  saleId: null,

  date: null,
  lastModified: null,
}) {
  static TYPE = 'QUOTATION';

  static fromDatabase({ ...props }) {
    return {
      ...props,
    };
  }
}

export class Sale extends Record({
  id: null,
  refNo: null,
  clientId: null,
  dateCreated: null,
  state: null,
  date: null,
  lastModified: null,
}) {
  static TYPE = 'SALE';

  static fromDatabase({ ...props }) {
    return {
      ...props,
    };
  }
}

export class Client extends Record({
  id: null,
  displayName: null,
  tel: null,
  email: null,
  address: null,
  taxId: null,

  date: null,
  lastModified: null,
}) {
  static TYPE = 'CLIENT';

  static isClient({ __typename }: { __typename: 'Client' | 'Supplier' }) {
    return __typename === 'Client';
  }

  static fromDatabase({ ...props }) {
    return {
      ...props,
    };
  }
}

export class Supplier extends Record({
  id: null,
  displayName: null,
  tel: null,
  email: null,
  address: null,
  taxId: null,

  date: null,
  lastModified: null,
}) {
  static TYPE = 'SUPPLIER';

  static fromDatabase({ ...props }) {
    return {
      ...props,
    };
  }
}

export class Product extends Record({
  id: null,
  displayName: null,
  unitPrice: null,
  ref: null,
  date: null,
  lastModified: null,
}) {
  static fromDatabase({ ...props }) {
    return {
      ...props,
    };
  }
}

export class Item extends Record({
  id: null,
  type: null,
  productId: null,
  foreignId: null,
  unitPrice: null,
  qty: null,
  date: null,
}) {
  static fromDatabase({ ...props }) {
    return {
      ...props,
    };
  }
}

export class Payment extends Record({
  id: null,
  type: null,
  state: null,
  foreignId: null,
  amount: null,
  date: null,
}) {
  static fromDatabase({ ...props }) {
    return {
      ...props,
    };
  }
}

export class Event extends Record({
  id: null,
  ns: null,
  type: null,
  timestamp: null,
  metadata: null,

  paymentId: null,

  saleId: null,

  expenseId: null,

  productId: null,

  clientId: null,

  supplierId: null,
}) {
  static NS_PRODUCTS = 'PRODUCTS';
  static NS_SUPPLIERS = 'SUPPLIERS';
  static NS_CLIENTS = 'CLIENTS';
  static NS_SALES = 'SALES';
  static NS_QUOTATIONS = 'QUOTATIONS';
  static NS_EXPENSES = 'EXPENSES';

  static TYPE_NEW_PRODUCT = 'NEW_PRODUCT';
  static TYPE_NEW_CLIENT = 'NEW_CLIENT';
  static TYPE_NEW_SUPPLIER = 'NEW_SUPPLIER';
  static TYPE_NEW_SALE = 'NEW_SALE';
  static TYPE_NEW_QUOTATION = 'NEW_QUOTATION';
  static TYPE_NEW_EXPENSE = 'NEW_EXPENSE';

  static TYPE_CLIENT_UPDATED = 'CLIENT_UPDATED';
  static TYPE_SUPPLIER_UPDATED = 'SUPPLIER_UPDATED';
  static TYPE_PRODUCT_UPDATED = 'PRODUCT_UPDATED';

  static TYPE_EXPENSE_PAYMENT = 'EXPENSE_PAYMENT';
  static TYPE_SALE_PAYMENT = 'SALE_PAYMENT';

  static TYPE_VOID_SALE = 'VOID_SALE';
  static TYPE_VOID_QUOTATION = 'VOID_QUOTATION';
  static TYPE_VOID_EXPENSE = 'VOID_EXPENSE';

  static TYPE_VOID_EXPENSE_PAYMENT = 'VOID_EXPENSE_PAYMENT';
  static TYPE_VOID_SALE_PAYMENT = 'VOID_SALE_PAYMENT';

  static TYPE_ACCEPT_QUOTATION = 'ACCEPT_QUOTATION';

  static fromDatabase({ ...props }) {
    return {
      ...props,
    };
  }
}

export class TransactionStatus {
  static CANCELLED = 'CANCELLED'; // 2
  static ACCEPTED = 'ACCEPTED'; // 3

  static fromDatabase(value: ?number) {
    if (value === 2) {
      return TransactionStatus.CANCELLED;
    }

    if (value === 3) {
      return TransactionStatus.ACCEPTED;
    }

    return null;
  }

  static toDatabase(value: typeof TransactionStatus.CANCELLED | null) {
    if (value === TransactionStatus.CANCELLED) {
      return 2;
    }

    if (value === TransactionStatus.ACCEPTED) {
      return 3;
    }

    return 1; // pending or valid
  }
}
