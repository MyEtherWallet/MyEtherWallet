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
        <h4>
          {{ $t("accessWallet.metaMaskModalDesc") }}
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
          :disabled="accessMyWalletBtnDisabled"
          class="mid-round-button-green-filled close-button"
          @click="getMetamaskWallet">
          {{ $t("accessWallet.accessMyWallet") }}
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
        <h4 v-if="unlockMetamask">
          {{ $t("accessWallet.installMetaMaskModalDesc") }}
        </h4>
        <h4 v-else>
          {{ $t("accessWallet.unlockMetamaskWallet") }}
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
          v-if="unlockMetamask"
          href="https://metamask.io/"
          target="_blank"
          class="mid-round-button-green-filled close-button">
          {{ $t("accessWallet.installMetamask") }}
        </a>
        <b-btn
          v-else
          class="mid-round-button-green-filled close-button"
          @click="getMetamaskWallet"
        >

          {{ $t("accessWallet.tryAgain") }}
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
      unlockMetamask: true
    };
  },
  computed: {
    metamaskInstalled() {
      if (window.web3 !== undefined) return true;
      return false;
    }
  },
  methods: {
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

      window.web3.eth.getAccounts((err, accounts) => {
        if (err) this.metamaskInstalled = false;
        if (!accounts.length) this.unlockMetamask = true;
        const address = accounts[0];
        // const addrBuffer = Buffer.from(address.slice(2), 'hex');
        const wallet = new MetamaskWallet(address);
        // eslint-disable-next-line no-console
        this.$store.dispatch('setMetamaskWallet', wallet);
        this.$router.push({ path: 'interface' });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MetamaskModal.scss';
</style>
