import EventNames from '../events';
import { toPayload } from '../jsonrpc';
import { EventBus } from '@/core/plugins/eventBus';
export default async ({ payload }, res, next) => {
  if (payload.method !== 'eth_sign') return next();
  const msg = payload.params[1];
  EventBus.$emit(EventNames.SHOW_MSG_CONFIRM_MODAL, msg, _response => {
    res(null, toPayload(payload.id, _response.toString('hex')));
  });
};
