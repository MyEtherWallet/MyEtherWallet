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
    if (receipt !== null) {
      if (receipt.contractAddress !== null) {
        if (receipt.contractAddress.substring(0, 2) !== "0x") {
          receipt.contractAddress = "0x" + receipt.contractAddress.substring(3)
        }
      } else {
        receipt.to = "0x" + receipt.to.substring(3)
        if (receipt.logs[0] !== undefined) {
          receipt.logs[0].address = "0x" + receipt.logs[0].address.substring(3)
        }
      }
      receipt.from = "0x" + receipt.from.substring(3)
    }
    memcache[txHash] = {
      timestamp: new Date().getTime(),
      receipt: JSON.stringify(receipt)
    };

    res(null, toPayload(payload.id, receipt));
  } else {
    res(
      null,
      toPayload(payload.id, JSON.parse(memcache[txHash].receipt) || null)
    );
  }
};
