<template>
  <div class="sign-message-container">
    <div class="sign-message-header">
      <p>{{ $t('common.confirmation') }}</p>
    </div>
    <div class="sign-message-address">
      <p>{{ $t('confirmation.signing-addr') }}</p>
      <div class="signing-address">
        <blockie :address="address" width="30px" height="30px" />
        <p>
          {{ address | concatAddr }}
        </p>
      </div>
    </div>
    <div class="sign-message-content">
      <p>{{ $t('interface.menu.message') }}</p>
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
import utils from 'web3-utils';
import { mapState } from 'vuex';
import { Misc } from '@/helpers';
import Blockie from '@/components/Blockie';
import PasswordModalComponent from '../../components/PasswordModalComponent';
import AcceptCancelButtons from '../../components/AcceptCancelButtons';
import {
  MEW_SIGNED_MSG,
  REJECT_MEW_SIGN_MSG,
  WEB3_SIGN_MSG
} from '@/builds/mewcx/cxHelpers/cxEvents';
export default {
  components: {
    blockie: Blockie,
    'accept-cancel-buttons': AcceptCancelButtons,
    'password-modal-component': PasswordModalComponent
  },
  data() {
    return {
      password: '',
      loading: false,
      error: {}
    };
  },
  computed: {
    ...mapState('main', ['linkQuery']),
    message() {
      const { msgToSign } = this.linkQuery;
      return utils.hexToAscii(msgToSign);
    },
    address() {
      const { address } = this.linkQuery;
      return address;
    }
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
      const _self = this;
      const { address, msgToSign, url } = _self.linkQuery;
      const id = window.chrome.runtime.id;
      const chrome = window.chrome;
      const payload = {
        signer: address,
        msg: msgToSign,
        password: this.password
      };

      chrome.runtime.sendMessage(
        id,
        {
          event: WEB3_SIGN_MSG,
          payload: payload
        },
        {},
        res => {
          _self.loading = false;
          if (res.hasOwnProperty('error')) {
            _self.error = {
              msg: res.error,
              errored: true
            };

            return;
          }
          window.chrome.tabs.query(
            { url: `*://*.${Misc.getService(url)}/*` },
            function(tab) {
              const obj = {
                event: MEW_SIGNED_MSG,
                payload: res.data
              };
              window.chrome.tabs.sendMessage(tab[0].id, obj);
              window.parent.close();
            }
          );
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
            event: REJECT_MEW_SIGN_MSG,
            payload: 'User rejected action!'
          };
          window.chrome.tabs.sendMessage(tab[0].id, obj);
          window.parent.close();
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'SignMsgContainer.scss';
</style>
