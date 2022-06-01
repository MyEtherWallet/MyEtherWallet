import { toPayload } from '../jsonrpc';
export default async ({ payload, store }, res, next) => {
  if (payload.method !== 'eth_accounts') return next();
  if (!store.state.wallet) return next();
  try {
    res(
      null,
      toPayload(payload.id, [store.state.wallet.instance.getAddressString()])
    );
  } catch (err) {
    return next(err);
  }
};
