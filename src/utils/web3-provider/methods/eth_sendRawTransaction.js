// eslint-disable-next-line
import { toPayload } from '../jsonrpc';
export default async ({ payload, store }, res, next) => {
  if (payload.method !== 'eth_sendRawTransaction') return next();
  if (store.state['global/testing']) {
    res();
    return;
  }
  res();
};
