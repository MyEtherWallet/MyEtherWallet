import { toPayload } from '../jsonrpc';
export default async ({ payload, store }, res, next) => {
  if (payload.method !== 'eth_coinbase') return next();
  if (!store.state.wallet) res(null, toPayload(payload.id, null));
  res(null, toPayload(payload.id, store.state.wallet.getAddressString()));
};
