import { useWalletStore } from '../../../core/store/wallet';
import { toPayload } from '../jsonrpc';
export default async ({ payload }, res, next) => {
  if (payload.method !== 'eth_accounts') return next();
  try {
    const { instance } = useWalletStore();
    res(null, toPayload(payload.id, [instance.value.getAddressString()]));
  } catch (err) {
    res(err);
  }
};
