import { Manager as Web3RequestManager } from 'web3-core-requestmanager';
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
