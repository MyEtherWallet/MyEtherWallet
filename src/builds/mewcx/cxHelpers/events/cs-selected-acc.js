/* eslint-disable no-undef */
import { SELECTED_MEW_CX_ACC } from '../cxEvents';

export default async ({ event, payload }, _, next) => {
  if (event !== SELECTED_MEW_CX_ACC) return next();
  window.dispatchEvent(
    new CustomEvent(WEB3_RECEIVE_ACC.replace('{{id}}', window.extensionID), {
      detail: {
        payload: payload
      }
    })
  );
};
