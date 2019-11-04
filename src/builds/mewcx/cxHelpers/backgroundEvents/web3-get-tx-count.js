/* eslint-disable no-undef */
import { CX_GET_TX_COUNT } from '../cxEvents';
import store from '@/store';
export default async ({ event, payload }, res, next) => {
  if (event !== CX_GET_TX_COUNT) return next();
  const { from } = payload;
  const nonce = await store.state.web3.eth.getTransactionCount(from);
  res(nonce);
};
