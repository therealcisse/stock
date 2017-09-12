import { createSelectorCreator, defaultMemoize } from 'reselect';
import Immutable from 'immutable';

// create a 'selector creator' that uses Immutable.is instead of ===
export const createSelector = createSelectorCreator(
  defaultMemoize,
  Immutable.is,
);
