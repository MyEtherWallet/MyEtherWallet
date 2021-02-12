import { hashPersonalMessage, ecrecover, pubToAddress } from 'ethereumjs-util';
import toBuffer from '@/core/helpers/toBuffer';

export default class SignAndVerifyMessage {
  constructor(web3, address) {
    this.web3 = web3;
    this.address = address;
  }

  signMessage(message) {
    const _this = this;
    try {
      return this.web3.eth
        .sign(message, this.address)
        .then(_signedMessage => {
          _this.signature = JSON.stringify(
            {
              address: _this.account.address,
              msg: _this.message,
              sig: _signedMessage,
              version: '3',
              signer: _this.account.isHardware
                ? _this.account.identifier
                : 'MEW'
            },
            null,
            2
          );
          return _this.signature;
          // _this.$refs.signatureModal.$refs.signatureModal.show();
        })
        .catch(e => {
          // eslint-disable-next-line
          console.log(e); // todo remove dev item
          // Toast.responseHandler(e, Toast.ERROR);
        });
    } catch (e) {
      // Toast.responseHandler(e, Toast.ERROR);
    }
  }

  verifyMessage(message) {
    try {
      const json = JSON.parse(message);
      let hash = hashPersonalMessage(toBuffer(json.msg));
      const sig = Buffer.from(json.sig.replace('0x', ''), 'hex');
      if (sig.length !== 65) {
        // Toast.responseHandler(
        //   `${this.$t('errorsGlobal.something-went-wrong')}`,
        //   Toast.ERROR
        // );
        return;
      }
      sig[64] = sig[64] === 0 || sig[64] === 1 ? sig[64] + 27 : sig[64];
      if (json.version === '1') {
        hash = this.web3.utils.sha3(json.msg);
      }
      const pubKey = ecrecover(
        hash,
        sig[64],
        sig.slice(0, 32),
        sig.slice(32, 64)
      );

      return (
        !json.address.replace('0x', '').toLowerCase() !==
        pubToAddress(pubKey).toString('hex').toLowerCase()
      );
    } catch (e) {
      // this.deleteInput();
      // Toast.responseHandler(e, Toast.ERROR);
    }
  }
}
