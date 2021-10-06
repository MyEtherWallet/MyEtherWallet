import { hashPersonalMessage, ecrecover, pubToAddress } from 'ethereumjs-util';
import toBuffer from '@/core/helpers/toBuffer';
import vuexStore from '@/core/store';
import { mapState } from 'vuex';
import ErrorList from '../errors';

export default class SignAndVerifyMessage {
  constructor() {
    this.$store = vuexStore;
    Object.assign(
      this,
      mapState('wallet', ['web3', 'address', 'isHardware', 'identifier'])
    );
  }

  signMessage(message) {
    const _this = this;
    try {
      return this.web3()
        .eth.sign(message, this.address())
        .then(_signedMessage => {
          _this.signature = JSON.stringify(
            {
              address: _this.address(),
              msg: _this.message,
              sig: _signedMessage,
              version: '3',
              signer: _this.isHardware() ? _this.identifier() : 'MEW'
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
    try {
      const json = JSON.parse(message);
      let hash = hashPersonalMessage(toBuffer(json.msg));
      const sig = Buffer.from(json.sig.replace('0x', ''), 'hex');
      if (sig.length !== 65) {
        throw ErrorList.INVALID_LENGTH;
      }
      sig[64] = sig[64] === 0 || sig[64] === 1 ? sig[64] + 27 : sig[64];
      if (json.version === '1') {
        hash = this.web3().utils.sha3(json.msg);
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
