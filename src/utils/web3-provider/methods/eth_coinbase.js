import { useWalletStore } from '../../../core/store/wallet';
import { toPayload } from '../jsonrpc';
export default async ({ payload }, res, next) => {
  if (payload.method !== 'eth_coinbase') return next();
  const { instance } = useWalletStore();
  if (!instance.value) res(null, toPayload(payload.id, null));
  res(null, toPayload(payload.id, instance.value.getAddressString()));
};
