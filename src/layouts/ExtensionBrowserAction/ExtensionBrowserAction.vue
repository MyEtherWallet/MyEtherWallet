<template>
  <div class="cx-container">
    <wallet-side-menu class="side-menu" />
    <div class="max-width-limit">
      <keep-alive>
        <router-view :eth-price="ethPrice" :token-prices="tokenPrices" />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import WalletSideMenu from './components/WalletSideMenu';
import { Toast } from '@/helpers';
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    'wallet-side-menu': WalletSideMenu
  },
  data() {
    return {
      ethPrice: 0,
      tokenPrices: {}
    };
  },
  computed: {
    ...mapState('main', ['web3', 'network', 'Networks'])
  },
  mounted() {
    window.chrome.storage.sync.get(null, this.setupState);
    this.getEthPrice();
    this.getTokenPrices();
  },
  methods: {
    ...mapActions('main', ['switchNetwork', 'setWeb3Instance']),
    ...mapActions('mewcx', ['setState']),
    setupState(obj) {
      const stateVal = [
        'accounts',
        'defChainID',
        'defNetwork',
        'favorites',
        'sites'
      ];
      const newState = {};
      stateVal.forEach(item => {
        if (obj[item]) {
          newState[item] =
            item !== 'defChainID' ? JSON.parse(obj[item]) : obj[item];
        }
      });

      this.setState(newState).then(() => {
        const defNetwork = newState['defNetwork']
          ? this.Networks[newState['defNetwork'].key][0]
          : this.Networks['ETH'][0];
        this.switchNetwork(defNetwork).then(() => {
          this.setWeb3Instance(defNetwork);
        });
      });
    },
    getEthPrice() {
      try {
        fetch('https://cryptorates.mewapi.io/ticker?filter=ETH')
          .then(res => {
            res
              .json()
              .then(response => {
                if (response.error) {
                  this.ethPrice = 0;
                } else {
                  this.ethPrice = response.data.ETH.quotes.USD.price;
                }
              })
              .catch(() => {
                Toast.responseHandler(
                  this.$t('mewcx.trouble-fetching-eth'),
                  Toast.ERROR
                );
              });
          })
          .catch(e => {
            Toast.responseHandler(e, Toast.ERROR);
          });
      } catch (e) {
        Toast.responseHandler(this.$t('mewcx.trouble-fetching'), Toast.ERROR);
      }
    },
    getTokenPrices() {
      try {
        fetch('https://cryptorates.mewapi.io/ticker')
          .then(res => {
            res
              .json()
              .then(response => {
                if (response.error) {
                  this.tokenPrices = {};
                } else {
                  this.tokenPrices = Object.assign({}, response.data);
                }
              })
              .catch(() => {
                Toast.responseHandler(
                  this.$t('mewcx.trouble-fetching'),
                  Toast.ERROR
                );
              });
          })
          .catch(e => {
            Toast.responseHandler(e, Toast.ERROR);
          });
      } catch (e) {
        Toast.responseHandler(this.$t('mewcx.trouble-fetching'), Toast.ERROR);
      }
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
