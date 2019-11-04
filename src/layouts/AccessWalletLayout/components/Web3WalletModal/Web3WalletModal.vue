<template>
  <b-modal
    ref="metamask"
    :title="isMetaMask ? 'Access via MetaMask' : 'Access via MEWCX'"
    hide-footer
    static
    lazy
    class="bootstrap-modal nopadding modal-metamask"
    centered
  >
    <div class="modal-content">
      <div v-if="isSafari && isMetaMask" class="browser-catch">
        <h4>
          MetaMask is only available in these browsers:
        </h4>
        <div class="browser-logo-container">
          <a
            v-for="browser in browsers"
            :key="browser.name"
            :href="browser.link"
            rel="noopener noreferrer"
            target="_blank"
          >
            <img :src="browser.logo" alt />
          </a>
        </div>
      </div>
      <div v-if="isSafari && !isMetaMask" class="browser-catch">
        <h4>
          MEWCX is only available in these browsers:
        </h4>
        <div class="browser-logo-container">
          <a
            v-for="browser in mewSupportedBrowsers"
            :key="browser.name"
            :href="browser.link"
            rel="noopener noreferrer"
            target="_blank"
          >
            <img :src="browser.logo" />
          </a>
        </div>
      </div>
      <div v-else-if="web3WalletExists">
        <div class="modal-multi-icons">
          <img
            :src="
              isMetaMask
                ? require('@/assets/images/icons/button-metamask.svg')
                : require('@/assets/images/mew-cx-logo.png')
            "
            :class="[isMetaMask ? 'metamask' : 'mew', 'icon']"
            alt
          />
          <img alt class="icon" src="~@/assets/images/icons/clip.svg" />
          <img
            alt
            class="icon logo-small"
            src="~@/assets/images/logo-small.png"
          />
        </div>
        <div class="d-block content-container text-center">
          <h4 v-show="!unlockWeb3Wallet">
            {{ $t('accessWallet.web3WalletModalDesc') }}
          </h4>
          <h4 v-show="unlockWeb3Wallet">
            {{ $t('accessWallet.unlockWeb3Wallet') }}
          </h4>
        </div>
        <div class="accept-terms">
          <label class="checkbox-container">
            {{ $t('accessWallet.acceptTerms') }}
            <router-link to="/terms-and-conditions">
              {{ $t('common.terms') }} </router-link
            >.
            <input
              type="checkbox"
              @click="accessMyWalletBtnDisabled = !accessMyWalletBtnDisabled"
            />
            <span class="checkmark" />
          </label>
        </div>
        <div class="button-container">
          <b-btn
            v-show="!unlockWeb3Wallet"
            :disabled="accessMyWalletBtnDisabled"
            class="mid-round-button-green-filled close-button"
            @click="getWeb3Wallet"
            >{{ $t('common.accessMyWallet') }}</b-btn
          >
          <b-btn
            v-show="unlockWeb3Wallet"
            class="mid-round-button-green-filled close-button"
            @click="getWeb3Wallet"
            >{{ $t('accessWallet.tryAgain') }}</b-btn
          >
        </div>
      </div>
      <div v-else>
        <div class="modal-multi-icons">
          <img alt class="icon mew cx" src="@/assets/images/mew-cx-logo.png" />
        </div>
        <div class="d-block content-container text-center">
          <h4>{{ $t('accessWallet.installWeb3WalletModalDesc') }}</h4>
        </div>
        <div class="accept-terms hidden">
          <label class="checkbox-container">
            {{ $t('accessWallet.acceptTerms') }}
            <router-link to="/terms-and-conditions">
              {{ $t('common.terms') }} </router-link
            >. <input type="checkbox" /> <span class="checkmark" />
          </label>
        </div>
        <div class="button-container">
          <a
            v-show="!refreshPage"
            href="https://www.mewcx.com"
            target="_blank"
            rel="noopener noreferrer"
            class="mid-round-button-green-filled close-button"
            @click="refreshPage = true"
            >Install MEW CX</a
          >
          <b-btn
            v-show="refreshPage"
            class="mid-round-button-green-filled close-button"
            @click="reload"
            >{{ $t('accessWallet.refresh') }}</b-btn
          >
        </div>
      </div>
      <customer-support />
    </div>
    <!-- .modal-content -->
  </b-modal>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';
import { Web3Wallet } from '@/wallets/software';
import { Toast } from '@/helpers';
import Web3 from 'web3';
import { mapState } from 'vuex';
import platform from 'platform';
import brave from '@/assets/images/browser/brave.png';
import chrome from '@/assets/images/browser/chrome.png';
import firefox from '@/assets/images/browser/firefox.png';
import opera from '@/assets/images/browser/opera.png';

export default {
  components: {
    'customer-support': CustomerSupport
  },
  props: {
    networkAndAddressOpen: {
      type: Function,
      default: function() {}
    },
    isMetaMask: {
      type: Boolean,
      default: false
    },
    web3WalletExists: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      accessMyWalletBtnDisabled: true,
      unlockWeb3Wallet: false,
      refreshPage: false,
      isSafari: false,
      browsers: [
        {
          logo: brave,
          link: 'https://brave.com/',
          name: 'brave'
        },
        {
          logo: firefox,
          link: 'https://www.mozilla.org/en-US/firefox/?v=b',
          name: 'firefox'
        },
        {
          logo: opera,
          link: 'https://www.opera.com/',
          name: 'opera'
        },
        {
          logo: chrome,
          link: 'https://www.google.com/chrome/',
          name: 'chrome'
        }
      ],
      mewSupportedBrowsers: [
        {
          logo: brave,
          link: 'https://brave.com/',
          name: 'brave'
        },
        {
          logo: opera,
          link: 'https://www.opera.com/',
          name: 'opera'
        },
        {
          logo: chrome,
          link: 'https://www.google.com/chrome/',
          name: 'chrome'
        }
      ]
    };
  },
  computed: {
    ...mapState(['path'])
  },
  mounted() {
    this.isSafari = platform.name.toLowerCase() === 'safari';
  },
  methods: {
    reload() {
      window.location.reload();
    },
    async getWeb3Wallet() {
      if (!this.web3WalletExists) return;
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
        } catch (e) {
          Toast.responseHandler(e, Toast.WARN);

          if (e.stack.includes('Error: User denied account authorization')) {
            return (this.unlockWeb3Wallet = true);
          }

          return;
        }
        this.signIn(web3, 'ethereum');
      } else if (window.web3) {
        this.signIn(window.web3);
      }
    },
    async signIn(web3, type) {
      try {
        const newWeb3 = new Web3(web3.currentProvider);
        const acc = await newWeb3.eth.getAccounts();
        if (type === 'ethereum') {
          window.ethereum.autoRefreshOnNetworkChange = false;
        }
        if (!acc.length) return (this.unlockWeb3Wallet = true);
        const wallet = new Web3Wallet(acc[0]);
        this.$store.dispatch('decryptWallet', [
          wallet,
          newWeb3.currentProvider
        ]);
        this.$router.push({
          path: 'interface'
        });
      } catch (e) {
        if (e.stack.includes('Error: User denied account authorization')) {
          Toast.responseHandler(e.stack, Toast.ERROR);
          return (this.unlockWeb3Wallet = true);
        }
        Toast.responseHandler(e, Toast.ERROR);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'Web3WalletModal.scss';
</style>
