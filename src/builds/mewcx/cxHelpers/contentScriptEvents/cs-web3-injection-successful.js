/* eslint-disable no-undef */
import { WEB3_INJECT_SUCCESS } from '../cxEvents';

export default async ({ event, id }, _, next) => {
  if (event !== WEB3_INJECT_SUCCESS.replace('{{id}}', 'internal'))
    return next();
  window.dispatchEvent(
    new CustomEvent(WEB3_INJECT_SUCCESS.replace('{{id}}', id))
  );
};
