import { WEB3_RPC_REQUEST } from '../cxEvents';
import store from '@/store';
export default async ({ event, payload }, res, next) => {
  if (event !== WEB3_RPC_REQUEST) return next();
  const web3 = store.state.web3;
  web3.currenProvider.send(payload, res);
};
