import { toPayload } from '../jsonrpc';
import EthCalls from '../web3Calls';
const WAIT_TIME = 10 * 1000; //10 seconds
const memcache = {};
export default async ({ payload, requestManager }, res, next) => {
  if (payload.method !== 'eth_getBlockByNumber') return next();
  const ethCalls = new EthCalls(requestManager);
  const blockNumber = payload.params[0];
  const returnTxs = payload.params[1] ? payload.params[1] : false;
  if (
    !memcache[blockNumber] ||
    (memcache[blockNumber] &&
      memcache[blockNumber].timestamp < new Date().getTime() - WAIT_TIME)
  ) {
    try {
      const receipt = await ethCalls.getBlockByNumber(blockNumber, returnTxs);
      memcache[blockNumber] = {
        timestamp: new Date().getTime(),
        receipt: JSON.stringify(receipt)
      };
      res(null, toPayload(payload.id, receipt));
    } catch (e) {
      res(null, toPayload(payload.id, null));
    }
  } else {
    res(
      null,
      toPayload(payload.id, JSON.parse(memcache[blockNumber].receipt) || null)
    );
  }
};
