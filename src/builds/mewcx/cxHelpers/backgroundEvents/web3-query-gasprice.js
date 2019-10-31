/* eslint-disable no-undef */
import { CX_GET_GASPRICE } from '../cxEvents';
import store from '@/store';
import unit from 'ethjs-unit';
export default async ({ event }, res, next) => {
  if (event !== CX_GET_GASPRICE) return next();
  const gasPrice = store.state.gasPrice;
  const convertedGasPrice = unit.toWei(gasPrice, 'gwei').toString();
  res(convertedGasPrice);
};
