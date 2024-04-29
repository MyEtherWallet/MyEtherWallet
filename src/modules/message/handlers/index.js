import { hashPersonalMessage, ecrecover, pubToAddress } from 'ethereumjs-util';
import { wallet as useWalletStore } from '@/core/store/index.js';

import toBuffer from '@/core/helpers/toBuffer';
import ErrorList from '../errors';

export default class SignAndVerifyMessage {
  constructor() {}

  signMessage(message) {
    const { web3, address, isHardware, identifier } = useWalletStore();
    const _this = this;
    try {
      return web3.eth.sign(message, address).then(_signedMessage => {
        _this.signature = JSON.stringify(
          {
            address: address,
            msg: _this.message,
            sig: _signedMessage,
            version: '3',
            signer: isHardware ? identifier : 'MEW'
          },
          null,
          2
        );
        return _this.signature;
      });
    } catch (e) {
      throw ErrorList.SIGN_FAILED;
    }
  }

  verifyMessage(message) {
    const { web3 } = useWalletStore();
    try {
      const json = JSON.parse(message);
      let hash = hashPersonalMessage(toBuffer(json.msg));
      const sig = Buffer.from(json.sig.replace('0x', ''), 'hex');
      if (sig.length !== 65) {
        throw ErrorList.INVALID_LENGTH;
      }
      sig[64] = sig[64] === 0 || sig[64] === 1 ? sig[64] + 27 : sig[64];
      if (json.version === '1') {
        hash = web3.utils.sha3(json.msg);
      }
      const pubKey = ecrecover(
        hash,
        sig[64],
        sig.slice(0, 32),
        sig.slice(32, 64)
      );
      return {
        verified:
          !json.address.replace('0x', '').toLowerCase() !==
          pubToAddress(pubKey).toString('hex').toLowerCase(),
        signer: pubToAddress(pubKey).toString('hex').toLowerCase()
      };
    } catch (e) {
      throw ErrorList.FAILED_TO_VERIFY;
    }
  }
}
