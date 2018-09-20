<template>
  <b-modal
    ref="metamask"
    :title="$t('accessWallet.accessByMetaMask')"
    hide-footer
    class="bootstrap-modal modal-metamask"
    centered>
    <div v-if="web3WalletExists">
      <div class="modal-multi-icons">
        <img
          class="icon"
          src="~@/assets/images/icons/button-metamask-fox.svg">
        <img
          class="icon"
          src="~@/assets/images/icons/clip.svg">
        <img
          class="icon logo-small"
          src="~@/assets/images/logo-small.png">
      </div>
      <div class="d-block content-container text-center">
        <h4 v-show="!unlockWeb3Wallet">
          {{ $t("accessWallet.metaMaskModalDesc") }}
        </h4>
        <h4 v-show="unlockWeb3Wallet">
          {{ $t("accessWallet.unlockMetamaskWallet") }}
        </h4>
      </div>
      <div class="accept-terms">
        <label class="checkbox-container">{{ $t("accessWallet.acceptTerms") }} <a href="/">{{ $t("common.terms") }}</a>.
          <input
            type="checkbox"
            @click="accessMyWalletBtnDisabled = !accessMyWalletBtnDisabled" >
          <span class="checkmark"/>
        </label>
      </div>
      <div class="button-container">
        <b-btn
          v-show="!unlockWeb3Wallet"
          :disabled="accessMyWalletBtnDisabled"
          class="mid-round-button-green-filled close-button"
          @click="getWeb3Wallet">
          {{ $t("accessWallet.accessMyWallet") }}
        </b-btn>
        <b-btn
          v-show="unlockWeb3Wallet"
          class="mid-round-button-green-filled close-button"
          @click="getWeb3Wallet"
        >

          {{ $t("accessWallet.tryAgain") }}
        </b-btn>
      </div>
    </div>
    <div v-else>
      <div class="modal-multi-icons">
        <img
          class="icon"
          src="~@/assets/images/icons/button-metamask-fox.svg">
      </div>
      <div class="d-block content-container text-center">
        <h4>
          {{ $t("accessWallet.installMetaMaskModalDesc") }}
        </h4>
      </div>
      <div class="accept-terms hidden">
        <label class="checkbox-container">{{ $t("accessWallet.acceptTerms") }} <a href="/">{{ $t("common.terms") }}</a>.
          <input type="checkbox" >
          <span class="checkmark"/>
        </label>
      </div>
      <div class="button-container">
        <a
          v-show="!refreshPage"
          href="https://metamask.io/"
          target="_blank"
          class="mid-round-button-green-filled close-button"
          @click="refreshPage=true">
          {{ $t("accessWallet.installMetamask") }}
        </a>
        <b-btn
          v-show="refreshPage"
          class="mid-round-button-green-filled close-button"
          @click="reload">
          Refresh
        </b-btn>
      </div>
    </div>
    <customer-support/>
  </b-modal>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';
import { Web3Wallet } from '@/wallets/software';

export default {
  components: {
    'customer-support': CustomerSupport
  },
  props: {
    networkAndAddressOpen: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      accessMyWalletBtnDisabled: true,
      unlockWeb3Wallet: false,
      web3WalletExists: false,
      refreshPage: false
    };
  },
  mounted() {
    this.web3WalletExists = this.checkWeb3();
  },
  methods: {
    reload() {
      window.location.reload();
    },
    getWeb3Wallet() {
      // NOTE: Uncomment code and debug when metamask's new version launches
      // if (window.web3 === undefined) {
      //   window.addEventListener('message', ({ data }) => {
      //     if (data && data.type && data.type === 'ETHEREUM_PROVIDER_SUCCESS') {
      //       window.web3 = new Web3(ethereum);
      //     }
      //   });
      //   window.postMessage(
      //     { type: 'ETHEREUM_PROVIDER_REQUEST', web3: true },
      //     '*'
      //   );
      // }

      if (this.checkWeb3() !== true) return;

      window.web3.eth.getAccounts((err, accounts) => {
        if (err) {
          this.web3WalletExists = false;
          return;
        }
        if (!accounts.length) {
          this.unlockWeb3Wallet = true;
          return;
        }
        const address = accounts[0];
        const wallet = new Web3Wallet(address);
        this.$store.dispatch('setWeb3Wallet', wallet);
        this.$store.dispatch('setWeb3Instance', window.web3.currentProvider);
        this.$router.push({ path: 'interface' });
      });
    },
    checkWeb3() {
      if (window.web3 !== undefined) return true;
      return false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MetamaskModal.scss';
</style>
