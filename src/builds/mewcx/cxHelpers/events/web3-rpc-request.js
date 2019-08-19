import { WEB3_RPC_REQUEST } from '../cxEvents';
import store from '@/store';
export default async ({ event, payload }, res, next) => {
  if (event !== WEB3_RPC_REQUEST) return next();
  const web3 = store.state.web3;
  const cb = (e, response) => {
    res({
      error: e,
      response: response
    });
  };
  web3.currentProvider.send(payload, cb);
};
