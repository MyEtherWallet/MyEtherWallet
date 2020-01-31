<template>
  <extension-browser-action-wrapper>
    <template v-if="hasFavorites" name="header">
      <wallet-title-and-search-component
        title="My Favorites"
        @search="e => (search = e)"
      />
    </template>
  </extension-browser-action-wrapper>
</template>

<script>
import WalletTitleAndSearchComponent from '../../components/WalletTitleAndSearchComponent';
import ExtensionBrowserActionWrapper from '../../wrappers/ExtensionBrowserActionWrapper';
import { isAddress, toChecksumAddress } from '@/helpers/addressUtils';
import { mapState, mapActions } from 'vuex';
import { Toast, ExtensionHelpers, Misc } from '@/helpers';
export default {
  components: {
    'wallet-title-and-search-component': WalletTitleAndSearchComponent,
    'extension-browser-action-wrapper': ExtensionBrowserActionWrapper
  },
  data() {
    return {
      search: ''
    };
  },
  created() {
    window.chrome.storage.onChanged.addListener(this.storageListener);
  },
  computed: {
    ...mapState('main', ['web3', 'network', 'Networks']),
    hasFavorites() {
      return false;
    }
  },
  mounted() {},
  destroyed() {
    window.chrome.storage.onChanged.removeListener(this.storageListener);
  },
  methods: {
    ...mapActions('main', [
      'switchNetwork',
      'setWeb3Instance',
      'decryptWallet'
    ]),
    storageListener(changed) {
      if (changed && changed.hasOwnProperty('defNetwork')) {
        const networkProps = JSON.parse(changed['defNetwork'].newValue);
        const network = this.Networks[networkProps.key].find(actualNetwork => {
          return actualNetwork.service === networkProps.service;
        });
        this.switchNetwork(
          !network ? this.Networks[networkProps.key][0] : network
        ).then(() => {
          this.setWeb3Instance();
        });
      } else {
        this.setWeb3Instance();
      }
      ExtensionHelpers.getAccounts(this.getAccountsCb);
    },
    getAccountsCb(res) {
      const accounts = Object.keys(res)
        .filter(item => {
          if (isAddress(item)) {
            return item;
          }
        })
        .map(item => {
          const newObj = Object.assign(
            {},
            { address: toChecksumAddress(item), wallet: res[item] }
          );

          return newObj;
        });
      if (accounts.length > 0) {
        this.hasAccounts = true;
        this.processAccounts(accounts);
      } else {
        this.hasAccounts = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ExtensionFavoritesContainer.scss';
</style>
