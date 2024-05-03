import { useGlobalStore } from '../../../core/store/global';
import { toPayload } from '../jsonrpc';
export default async ({ payload }, res, next) => {
  const { network } = useGlobalStore();
  if (payload.method !== 'net_version') return next();
  res(null, toPayload(payload.id, network.type.chainID));
};
