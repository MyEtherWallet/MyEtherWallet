import { Manager as Web3RequestManager } from 'web3-core-requestmanager';
import { WEB3_RPC_REQUEST } from '@/builds/mewcx/cxHelpers/cxEvents';
import eventHandler from '@/wallets/web3-provider/cx-web3-methods/eventHandler';
const chrome = window.chrome;
class MEWCXRequestManager {
  constructor() {
    return new Web3RequestManager(this);
  }
  send(payload, callback) {
    const obj = {
      detail: payload
    };
    eventHandler(
      WEB3_RPC_REQUEST,
      obj,
      `${WEB3_RPC_REQUEST}-res`,
      `${WEB3_RPC_REQUEST}-err`
    );
    // chrome.runtime.sendMessage(
    //   window.extensionID,
    //   {
    //     event: WEB3_RPC_REQUEST,
    //     payload
    //   },
    //   {},
    //   callback
    // );
  }
  disconnect() {}
}
export default MEWCXRequestManager;
