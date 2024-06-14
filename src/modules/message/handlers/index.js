import { hashPersonalMessage, ecrecover, pubToAddress } from 'ethereumjs-util';
import { useWalletStore } from '@/core/store/wallet';

import toBuffer from '@/core/helpers/toBuffer';
import ErrorList from '../errors';

export default class SignAndVerifyMessage {
  constructor() {}

  signMessage(message) {
    const {
      web3,
      address: walletAddress,
      isHardware,
      identifier
    } = useWalletStore();
    try {
      return web3.value.eth
        .sign(message, walletAddress.value)
        .then(_signedMessage => {
          const obj = {
            address: `${walletAddress.value}`,
            msg: message,
            sig: _signedMessage,
            version: '3',
            signer: isHardware.value ? identifier.value : 'MEW'
          };
          const signature = JSON.stringify(obj, null, 2);
          return signature;
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
        hash = web3.value.utils.sha3(json.msg);
      }
      const pubKey = ecrecover(
        hash,
        sig[64],
        sig.slice(0, 32),
        sig.slice(32, 64)
      );
      return {
        verified:
          !json.address.value.replace('0x', '').toLowerCase() !==
          pubToAddress(pubKey).toString('hex').toLowerCase(),
        signer: pubToAddress(pubKey).toString('hex').toLowerCase()
      };
    } catch (e) {
      console.log(e);
      throw ErrorList.FAILED_TO_VERIFY;
    }
  }
}
