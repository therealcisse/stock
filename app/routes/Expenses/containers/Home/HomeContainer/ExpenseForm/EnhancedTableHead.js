import React from 'react';
import T from 'prop-types';

import style from 'routes/Sales/styles';

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'material-ui/Table';

export default class EnhancedTableHead extends React.Component {
  static propTypes = {};

  render() {
    const { columnData } = this.props;

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
                {column.label}
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}
