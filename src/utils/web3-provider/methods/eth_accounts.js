import { useWalletStore } from '../../../core/store/wallet';
import { toPayload } from '../jsonrpc';
export default async ({ payload }, res, next) => {
  if (payload.method !== 'eth_accounts') return next();
  try {
    const { wallet } = useWalletStore();
    res(null, toPayload(payload.id, [wallet.instance.getAddressString()]));
  } catch (err) {
    res(err);
  }
};
