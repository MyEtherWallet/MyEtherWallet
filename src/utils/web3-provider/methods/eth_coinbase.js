import { useWalletStore } from '../../../core/store/wallet';
import { toPayload } from '../jsonrpc';
export default async ({ payload }, res, next) => {
  const { wallet } = useWalletStore();
  if (payload.method !== 'eth_coinbase') return next();
  if (!wallet.instance) res(null, toPayload(payload.id, null));
  res(null, toPayload(payload.id, wallet.instance.getAddressString()));
};
