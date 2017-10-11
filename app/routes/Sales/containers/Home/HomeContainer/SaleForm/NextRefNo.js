import React from 'react';

import compose from 'redux/lib/compose';

import { SALES_REF_NO_BASE } from 'vars';

import * as DataLoader from 'routes/Sales/DataLoader';

function NextRefNo({ data }) {
  return data.loading ? null : `nº ${data.getNextRefNo + SALES_REF_NO_BASE}`;
}

export default compose(DataLoader.nextRefNo)(NextRefNo);
