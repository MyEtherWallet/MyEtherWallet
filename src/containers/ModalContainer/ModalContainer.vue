<template>
  <div>
    <logout-modal ref="logout" />
    <logout-warning-modal ref="logoutWarning" />

    <issue-log-modal ref="issueLog" :stack-trace="issueTrace" />
    <settings-modal
      v-if="wallet !== null"
      ref="settingsModal"
      :gas-price="gasPrice"
    />
    <enter-pin-modal
      ref="enterPin"
      :callback="callback"
      :device-info="deviceInfo"
    />
    <wallet-passphrase-modal
      ref="walletPassword"
      :callback="callback"
      :device-info="deviceInfo"
    />
    <reveal-json-modal ref="revealJson" :update-json-string="callback" />
    <error-modal ref="errorModal" :message="errorMsg" />
    <print-modal
      ref="printModal"
      :print-type="printType"
      :print-data="printData"
    />
  </div>
</template>
<script>
import IssueLogModal from './components/IssueLogModal';
import ErrorModal from './components/ErrorModal';
import PrintModal from './components/PrintModal';
import SettingsModal from './components/SettingsModal';
import RevealJsonModal from './components/RevealJsonModal';
import EnterPinModal from './components/EnterPinModal';
import WalletPassphraseModal from './components/WalletPassphraseModal';
import LogoutModal from './components/LogoutModal';
import LogoutWarningModal from './components/LogoutWarningModal';

import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { PRINT_ENS, LOGOUT_WARNING } from './modalTypes.js';
import { Messages } from '@keepkey/keepkey.js';
const { MessageType } = Messages;
const {
  MESSAGETYPE_PINMATRIXREQUEST,
  MESSAGETYPE_PASSPHRASEREQUEST
} = MessageType;

export default {
  name: 'ModalContainer',
  components: {
    'issue-log-modal': IssueLogModal,
    'error-modal': ErrorModal,
    'print-modal': PrintModal,
    'settings-modal': SettingsModal,
    'reveal-json-modal': RevealJsonModal,
    'enter-pin-modal': EnterPinModal,
    'wallet-passphrase-modal': WalletPassphraseModal,
    'logout-modal': LogoutModal,
    'logout-warning-modal': LogoutWarningModal
  },
  data() {
    return {
      errorMsg: '',
      issueTrace: '',
      printType: '',
      printData: {},
      callback: () => {},
      deviceInfo: {},
      gasPrice: '0'
    };
  },
  computed: {
    ...mapGetters({
      wallet: 'wallet',
      web3: 'web3'
    })
  },
  watch: {
    wallet() {
      this.web3.eth
        .getGasPrice()
        .then(res => {
          this.gasPrice = new BigNumber(res).toString();
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
    }
  },
  mounted() {
    this.$eventHub.$on(
      'showKeepKeyInput',
      (deviceInfo, requestType, callback) => {
        this.callback = callback;
        this.deviceInfo = deviceInfo;
        switch (requestType) {
          case String(MESSAGETYPE_PINMATRIXREQUEST):
            this.$refs.enterPin.$refs.enterpin.show();
            break;
          case String(MESSAGETYPE_PASSPHRASEREQUEST):
            this.$refs.walletPassword.$refs.walletPassword.show();
            break;
          default:
            return '';
        }
      }
    );
    this.$eventHub.$on('logoutModal', (type, resolve) => {
      type === LOGOUT_WARNING
        ? this.$refs.logoutWarning.$refs.logoutWarning.show()
        : this.$refs.logout.$refs.logout.show();

      if (type !== LOGOUT_WARNING) {
        this.$refs.logout.$refs.logout.$on('hidden', resolve);
      }
    });
    this.$eventHub.$on('settingsModal', resolve => {
      this.$refs.settingsModal.$refs.settings.show();
      this.$refs.settingsModal.$refs.settings.$on('hidden', resolve);
    });
    this.$eventHub.$on('issueOccured', issueTrace => {
      this.issueTrace = issueTrace;
      this.$refs.issueLog.$refs.issuelog.show();
    });
    this.$eventHub.$on('errorOccured', errorMsg => {
      this.errorMsg = errorMsg;
      this.$refs.errorModal.$refs.errorModal.show();
    });
    this.$eventHub.$on('revealJsonModal', callback => {
      this.callback = callback;
      this.$refs.revealJsonModal.$refs.errorModal.show();
    });
    this.$eventHub.$on('printModal', (type, printData, resolve) => {
      this.printData = printData ? printData : {};
      this.printType = type;
      this.$refs.printModal.$refs.print.show();
      if (type === PRINT_ENS) {
        this.$refs.printModal.$refs.print.$on('hidden', resolve);
      }
    });
  }
};
</script>
<style lang="scss" scoped>
@import 'ModalContainer.scss';
</style>
