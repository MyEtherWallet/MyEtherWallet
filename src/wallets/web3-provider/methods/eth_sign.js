import EventNames from '../events';
import { toPayload } from './jsonrpc';
import utils from 'web3-utils';
export default async ({ payload, eventHub }, res, next) => {
  if (payload.method !== 'eth_sign') return next();
  let msg;
  try {
    msg = utils.hexToUtf8(payload.params[1]);
  } catch (e) {
    msg = payload.params[1];
  }
  eventHub.$emit(EventNames.SHOW_MSG_CONFIRM_MODAL, msg, _response => {
    res(null, toPayload(payload.id, _response.toString('hex')));
  });
};
