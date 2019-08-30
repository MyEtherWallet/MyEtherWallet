<template>
  <div class="sign-message-container">
    <div class="sign-message-header">
      <p>Confirmation</p>
    </div>
    <div class="sign-message-address">
      <p>Signing Address</p>
      <div class="signing-address">
        <blockie :address="address" width="30px" height="30px" />
        <p>
          {{ address | concatAddr }}
        </p>
      </div>
    </div>
    <div class="sign-message-content">
      <p>Message</p>
      <div class="message-container">
        {{ message }}
      </div>
    </div>
    <accept-cancel-buttons
      :func-one="openPasswordModal"
      :func-two="rejectAction"
      text-one="Sign"
      text-two="Reject"
    />
    <password-modal-component
      ref="passwordModal"
      :func="unlockWallet"
      :action-name="'Sign Message'"
      :loading="loading"
      :error="error"
      @passwordChange="updatePassword"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex';
import utils from 'web3-utils';
import { KEYSTORE as keyStoreType } from '@/wallets/bip44/walletTypes';
import { WalletInterface } from '@/wallets';
import walletWorker from 'worker-loader!@/workers/wallet.worker.js';
import { Misc } from '@/helpers';
import Blockie from '@/components/Blockie';
import PasswordModalComponent from '../../components/PasswordModalComponent';
import AcceptCancelButtons from '../../components/AcceptCancelButtons';
import {
  MEW_SIGNED_MSG,
  REJECT_MEW_SIGN_MSG
} from '@/builds/mewcx/cxHelpers/cxEvents';
export default {
  components: {
    blockie: Blockie,
    'accept-cancel-buttons': AcceptCancelButtons,
    'password-modal-component': PasswordModalComponent
  },
  data() {
    return {
      address: '',
      message: '',
      password: '',
      signingKeystore: {},
      loading: false,
      error: {}
    };
  },
  computed: {
    ...mapState(['linkQuery'])
  },
  mounted() {
    const _self = this;
    const { address, msgToSign } = _self.linkQuery;
    _self.address = address;
    _self.message = utils.hexToAscii(msgToSign);
    window.chrome.storage.sync.get(address, function(res) {
      _self.signingKeystore = JSON.parse(res[address]).priv;
    });
  },
  methods: {
    updatePassword(e) {
      this.error = {
        msg: '',
        errored: false
      };
      this.password = e;
    },
    unlockWallet() {
      this.loading = true;
      const worker = new walletWorker();
      const _self = this;
      worker.postMessage({
        type: 'unlockWallet',
        data: [JSON.parse(this.signingKeystore), this.password]
      });
      worker.onmessage = function(e) {
        _self.loading = false;
        _self.signMsg(e.data._privKey);
      };

      worker.onerror = function(e) {
        e.preventDefault();
        _self.loading = false;
        _self.error = {
          msg: 'Unlock failed: Wrong password!',
          errored: true
        };
      };
    },
    async signMsg(priv) {
      const wallet = new WalletInterface(
        Buffer.from(priv),
        false,
        keyStoreType
      );
      const _self = this;
      const signedMsg = await wallet.signMessage(this.message);
      window.chrome.tabs.query(
        { url: `*://*.${Misc.getService(_self.linkQuery.url)}/*` },
        function(tab) {
          const obj = {
            event: MEW_SIGNED_MSG,
            payload: '0x' + signedMsg.toString('hex')
          };
          window.chrome.tabs.sendMessage(tab[0].id, obj);
          window.close();
        }
      );
    },
    openPasswordModal() {
      this.$refs.passwordModal.$refs.passwordModal.show();
    },
    rejectAction() {
      const _self = this;
      window.chrome.tabs.query(
        { url: `*://*.${Misc.getService(_self.linkQuery.url)}/*` },
        function(tab) {
          const obj = {
            event: REJECT_MEW_SIGN_MSG
          };
          window.chrome.tabs.sendMessage(tab[0].id, obj);
          window.close();
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'SignMsgContainer.scss';
</style>
