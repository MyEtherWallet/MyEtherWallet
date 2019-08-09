import { Manager as Web3RequestManager } from 'web3-core-requestmanager';
import WEB3_RPC_REQUEST from '@/builds/mewcx/cxHelpers/events/web3-rpc-request';
const chrome = window.chrome;
class MEWCXRequestManager {
  constructor() {
    return new Web3RequestManager(this);
  }
  send(payload, callback) {
    chrome.runtime.sendMessage(
      window.extensionID,
      {
        event: WEB3_RPC_REQUEST,
        payload
      },
      {},
      callback
    );
  }
  disconnect() {}
}
export default MEWCXRequestManager;
