import EthCalls from '../web3Calls';
import { toPayload } from '../jsonrpc';
export default async ({ payload, requestManager }, res, next) => {
  if (payload.method !== 'eth_getBlockByNumber') return next();
  const ethCalls = new EthCalls(requestManager);
  const block = await ethCalls.getBlockByNumber(
    payload.params[0],
    payload.params[1]
  );
  res(null, toPayload(payload.id, block));
};
