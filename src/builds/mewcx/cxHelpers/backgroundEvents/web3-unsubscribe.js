import { CX_UNSUBSCRIBE } from '../cxEvents';
import store from '@/store';

export default async ({ event, payload }, res, next) => {
  if (event !== CX_UNSUBSCRIBE) return next();
  const provider = store.state.web3.currentProvider;
  provider.send(payload, (e, response) => {
    const obj = {
      error: e,
      response: response
    };
    if (!e) {
      delete obj['error'];
    }
    res(obj);
  });
};
