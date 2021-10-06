import { toPayload } from '../jsonrpc';
export default async ({ payload, store }, res, next) => {
  if (payload.method !== 'net_version') return next();
  res(
    null,
    toPayload(payload.id, store.getters['global/network'].type.chainID)
  );
};
