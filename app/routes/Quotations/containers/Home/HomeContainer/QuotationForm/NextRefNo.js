import React from 'react';

import compose from 'redux/lib/compose';

import * as DataLoader from 'routes/Quotations/DataLoader';

function NextRefNo({ data }) {
  return data.loading ? null : `nº ${data.getQuotationsNextRefNo}`;
}

export default compose(DataLoader.nextRefNo)(NextRefNo);
