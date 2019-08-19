/* eslint-disable no-undef */
import { SELECTED_MEW_CX_ACC, WEB3_RECEIVE_ACC } from '../cxEvents';

export default async ({ event, payload, id }, _, next) => {
  if (event !== SELECTED_MEW_CX_ACC) return next();
  window.dispatchEvent(
    new CustomEvent(WEB3_RECEIVE_ACC.replace('{{id}}', id), {
      detail: {
        payload: payload
      }
    })
  );
};
