import { WEB3_RPC_REQUEST } from '../cxEvents';
import store from '@/store';
export default async ({ event, payload }, res, next) => {
  if (event !== WEB3_RPC_REQUEST) return next();
  const parsedPayload = Object.assign(payload);
  const newParams = JSON.parse(parsedPayload.params);
  delete parsedPayload.params;
  parsedPayload['params'] = newParams;
  const web3 = store.state.main.web3;
  const cb = (e, response) => {
    const obj = {
      error: e ? e.message : e,
      response: response
    };
    if (!e) {
      delete obj['error'];
    }

    res(obj);
  };
  web3.currentProvider.send(parsedPayload, cb);
};
