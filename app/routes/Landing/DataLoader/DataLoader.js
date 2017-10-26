import { graphql } from 'react-apollo';

import ExpensesReportQuery from './getExpensesReport.query.graphql';

import ResultQuery from './getResult.query.graphql';

import find from 'lodash.findindex';

import { Dates } from 'routes/Landing/utils';

const expensesReport = graphql(ExpensesReportQuery, {
  options: ownProps => {
    const dates = Dates();
    const index = find(dates, ({ id }) => id === ownProps.date);
    const d = dates[index];

    return {
      variables: {
        ...d.getValue(),
      },
    };
  },
});

const result = graphql(ResultQuery, {
  options: ownProps => {
    const dates = Dates();
    const index = find(dates, ({ id }) => id === ownProps.date);
    const d = dates[index];

    return {
      variables: {
        ...d.getValue(),
      },
    };
  },
});

export default { expensesReport, result };
