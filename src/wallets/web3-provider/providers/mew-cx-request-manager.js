import { Manager as Web3RequestManager } from 'web3-core-requestmanager';
import { WEB3_RPC_REQUEST } from '@/builds/mewcx/cxHelpers/cxEvents';
import eventHandler from '@/wallets/web3-provider/cx-web3-methods/eventHandler';
class MEWCXRequestManager {
  constructor() {
    return new Web3RequestManager(this);
  }
  send(payload, callback) {
    console.log(payload, callback);
    const obj = {
      detail: payload
    };
    const eventRes = `${WEB3_RPC_REQUEST}-${payload.id}-res`;
    const eventErr = `${WEB3_RPC_REQUEST}-${payload.id}-err`;
    eventHandler(WEB3_RPC_REQUEST, obj, eventRes, eventErr)
      .then(res => {
        callback(null, res);
      })
      .catch(e => {
        callback(e);
      });
  }
  disconnect() {}
}
export default MEWCXRequestManager;
