import { useGlobalStore } from '../../../core/store/global';
import { toPayload } from '../jsonrpc';
export default async ({ payload }, res, next) => {
  if (payload.method !== 'net_version') return next();
  const { network } = useGlobalStore();
  res(null, toPayload(payload.id, network.type.chainID));
};
