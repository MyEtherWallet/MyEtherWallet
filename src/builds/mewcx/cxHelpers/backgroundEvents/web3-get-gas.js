/* eslint-disable no-undef */
import { CX_GET_GAS } from '../cxEvents';
import store from '@/store';
export default async ({ event, payload }, res, next) => {
  if (event !== CX_GET_GAS) return next();
  const newTx = {
    to: payload.tx.to,
    data: payload.tx.data,
    from: payload.tx.from,
    value: payload.tx.value,
    nonce: payload.tx.nonce
  };

  const gas = await store.state.web3.eth.estimateGas(newTx);
  res(gas);
};
