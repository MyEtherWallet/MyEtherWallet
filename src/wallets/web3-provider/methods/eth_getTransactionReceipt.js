import { toPayload } from './jsonrpc';
import EthCalls from '../web3Calls';
const WAIT_TIME = 30 * 1000; //30 seconds
const memcache = {};
export default async ({ payload, requestManager }, res, next) => {
  if (payload.method !== 'eth_getTransactionReceipt') return next();
  const ethCalls = new EthCalls(requestManager);
  const txHash = payload.params[0];
  if (
    !memcache[txHash] ||
    (memcache[txHash] &&
      memcache[txHash].timestamp < new Date().getTime() - WAIT_TIME)
  ) {
    const receipt = await ethCalls.getTransactionReceipt(txHash);
    memcache[txHash] = {
      timestamp: new Date().getTime(),
      receipt
    };
    res(null, toPayload(payload.id, receipt));
  } else {
    res(null, toPayload(payload.id, memcache[txHash].receipt || null));
  }
};
