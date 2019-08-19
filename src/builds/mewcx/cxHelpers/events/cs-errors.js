/* eslint-disable no-undef */
import {
  REJECT_MEW_CX_ACC,
  REJECT_MEW_TX_SIGN,
  REJECT_MEW_SIGN_MSG,
  WEB3_REJECT
} from '../cxEvents';

export default async ({ event, id }, _, next) => {
  if (
    event !== REJECT_MEW_CX_ACC ||
    event !== REJECT_MEW_TX_SIGN ||
    event !== REJECT_MEW_SIGN_MSG
  )
    return next();
  window.dispatchEvent(new CustomEvent(WEB3_REJECT.replace('{{id}}', id), {}));
};
