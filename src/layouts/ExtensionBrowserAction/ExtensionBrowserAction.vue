<template>
  <div class="cx-container">
    <wallet-side-menu class="side-menu" />
    <div class="max-width-limit">
      <keep-alive>
        <router-view
          :eth-price="ethPrice"
          :token-prices="tokenPrices"
          :wallets="wallets"
        />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import WalletSideMenu from './components/WalletSideMenu';
import { Toast, ExtensionHelpers } from '@/helpers';
import { mapState, mapActions } from 'vuex';
import { isAddress, toChecksumAddress } from '@/helpers/addressUtils';

export default {
  components: {
    'wallet-side-menu': WalletSideMenu
  },
  data() {
    return {
      ethPrice: 0,
      tokenPrices: {},
      wallets: []
    };
  },
  computed: {
    ...mapState('main', ['web3', 'network'])
  },
  created() {
    window.chrome.storage.onChanged.addListener(this.storageListener);
  },
  mounted() {
    this.getEthPrice();
    this.getTokenPrices();
    this.fetchAccountFromStore();
  },
  destroyed() {
    window.chrome.storage.onChanged.addListener(this.storageListener);
  },
  methods: {
    ...mapActions('main', ['switchNetwork', 'setWeb3Instance']),
    fetchAccountFromStore() {
      ExtensionHelpers.getAccounts(this.getAccountsCb);
    },
    storageListener(changed) {
      if (changed && changed.hasOwnProperty('defNetwork')) {
        const networkProps = JSON.parse(changed['defNetwork'].newValue);
        const network = this.$store.state.main.Networks[networkProps.key].find(
          actualNetwork => {
            return actualNetwork.service === networkProps.service;
          }
        );
        this.switchNetwork(
          !network ? this.$store.state.Networks[networkProps.key][0] : network
        ).then(() => {
          this.setWeb3Instance();
        });
      } else {
        this.setWeb3Instance();
      }

      if (isAddress(Object.keys(changed)[0])) {
        this.fetchAccountFromStore();
      }
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
      this.wallets = accounts.slice();
    },
    getEthPrice() {
      fetch('https://cryptorates.mewapi.io/ticker?filter=ETH')
        .then(res => {
          res.json().then(response => {
            this.ethPrice = response.data.ETH.quotes.USD.price;
          });
        })
        .catch(e => {
          Toast.responseHandler(e, Toast.ERROR);
        });
    },
    getTokenPrices() {
      fetch('https://cryptorates.mewapi.io/ticker')
        .then(res => {
          res.json().then(response => {
            this.tokenPrices = Object.assign({}, response.data);
          });
        })
        .catch(e => {
          Toast.responseHandler(e, Toast.ERROR);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.cx-container {
  background-color: #f2f4fa;
  min-height: calc(100vh - 64px);
  min-width: 960px;
  position: relative;
  width: 100%;
}

.max-width-limit {
  max-width: 1055px;
  margin: 0 auto;
  height: 100%;
}

.side-menu {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  z-index: 1;
}
</style>
