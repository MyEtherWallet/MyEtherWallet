/* eslint-disable no-undef */
import { CX_GET_GAS } from '../cxEvents';
import store from '@/store';
export default async ({ event, payload }, res, next) => {
  if (event !== CX_GET_GAS) return next();
  const newTx = Object.assign({}, payload.tx);
  delete newTx.chainId;
  delete newTx.tokenSymbol;
  delete newTx.tokenTransferTo;
  delete newTx.tokenTransferVal;
  delete newTx.gasLimit;
  delete newTx.r;
  delete newTx.s;
  delete newTx.v;
  const gas = await store.state.main.web3.eth.estimateGas(newTx);
  res(gas);
};
