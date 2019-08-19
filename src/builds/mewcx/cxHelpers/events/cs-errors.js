/* eslint-disable no-undef */
import {
  REJECT_MEW_CX_ACC,
  REJECT_MEW_TX_SIGN,
  REJECT_MEW_SIGN_MSG
} from '../cxEvents';

export default async ({ event }, _, next) => {
  if (
    event !== REJECT_MEW_CX_ACC ||
    event !== REJECT_MEW_TX_SIGN ||
    event !== REJECT_MEW_SIGN_MSG
  )
    return next();
  window.dispatchEvent(
    new CustomEvent(WEB3_REJECT.replace('{{id}}', window.extensionID), {})
  );
};
