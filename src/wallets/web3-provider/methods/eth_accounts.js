import { toPayload } from '../jsonrpc';
export default async ({ payload, store }, res, next) => {
  if (payload.method !== 'eth_accounts') return next();
  res(
    null,
    toPayload(payload.id, [store.state.main.wallet.getAddressString()])
  );
};
