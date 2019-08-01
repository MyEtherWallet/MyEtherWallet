import { toPayload } from '../jsonrpc';
import EthCalls from '../web3Calls';
export default async ({ payload, requestManager }, res, next) => {
  if (payload.method !== 'net_version') return next();
  const ethCalls = new EthCalls(requestManager);
  try {
    const netVersion = await ethCalls.getId();
    res(null, toPayload(payload.id, netVersion));
  } catch (e) {
    res(null, toPayload(payload.id, null));
  }
};
