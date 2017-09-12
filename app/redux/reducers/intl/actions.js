import { UPDATE } from './constants';

export const updateIntl = ({ locale, messages, formats = {} }) => ({
  type: UPDATE,
  payload: { locale, messages, formats },
});
