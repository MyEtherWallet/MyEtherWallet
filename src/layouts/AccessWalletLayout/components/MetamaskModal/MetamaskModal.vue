<template>
  <b-modal
    ref="metamask"
    :title="$t('accessWallet.accessByMetaMask')"
    hide-footer
    class="bootstrap-modal modal-metamask"
    centered>
    <div v-if="metamaskInstalled">
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
        <h4 v-show="!unlockMetamask">
          {{ $t("accessWallet.metaMaskModalDesc") }}
        </h4>
        <h4 v-show="unlockMetamask">
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
          v-show="!unlockMetamask"
          :disabled="accessMyWalletBtnDisabled"
          class="mid-round-button-green-filled close-button"
          @click="getMetamaskWallet">
          {{ $t("accessWallet.accessMyWallet") }}
        </b-btn>
        <b-btn
          v-show="unlockMetamask"
          class="mid-round-button-green-filled close-button"
          @click="getMetamaskWallet"
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
import { MetamaskWallet } from '@/wallets/software';

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
      unlockMetamask: false,
      metamaskInstalled: false,
      refreshPage: false
    };
  },
  mounted() {
    this.metamaskInstalled = this.checkWeb3();
  },
  methods: {
    reload() {
      window.location.reload();
    },
    getMetamaskWallet() {
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
          this.metamaskInstalled = false;
          return;
        }
        if (!accounts.length) {
          this.unlockMetamask = true;
          return;
        }
        const address = accounts[0];
        const wallet = new MetamaskWallet(address);
        this.$store.dispatch('setMetamaskWallet', wallet);
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
