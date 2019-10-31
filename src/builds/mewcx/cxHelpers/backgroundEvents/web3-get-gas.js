/* eslint-disable no-undef */
import { CX_GET_GAS } from '../cxEvents';
import store from '@/store';
export default async ({ event, payload }, res, next) => {
  if (event !== CX_GET_GAS) return next();
  const gas = await store.state.web3.eth.estimateGas(payload.tx);
  res(gas);
};
