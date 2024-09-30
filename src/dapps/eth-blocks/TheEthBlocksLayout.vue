<template>
  <!--
    ===================================================
    The Staked Layout
    ===================================================
    -->
  <the-wrapper-dapp
    :is-new-header="true"
    :dapp-img="headerImg"
    :banner-text="header"
    :tab-items="tabs"
    :active-tab="activeTab"
    :valid-networks="validNetworks"
    top-strip
  >
  </the-wrapper-dapp>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { ETH_BLOCKS_ROUTE } from './configsRoutes';
import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';

export default {
  name: 'TheEthBlocksLayout',
  components: {
    TheWrapperDapp: () => import('@/dapps/TheWrapperDapp.vue')
  },
  data() {
    return {
      header: {
        title: 'ETH Blocks',
        subtext: 'Mint generative art NFTs of Ethereum blocks. ',
        dappLink:
          'https://help.myetherwallet.com/en/articles/5708663-how-to-mint-eth-blocks'
      },
      activeTab: 0,
      headerImg: require('@/assets/images/icons/dapps/icon-dapp-ethblocks.svg'),
      validNetworks: SUPPORTED_NETWORKS,
      checkPendingInterval: false
    };
  },
  computed: {
    ...mapState('wallet', ['web3']),
    ...mapState('ethBlocksTxs', ['cart']),
    ...mapGetters('global', ['network', 'isTestNetwork']),
    ...mapGetters('ethBlocksTxs', ['getAllEthBlocksTxs']),

    /**
     * Checks if there are pending txs in the dapp
     * @returns {boolean}
     */
    hasPendingTxs() {
      return this.getAllEthBlocksTxs.length > 0;
    },
    identifyNetwork() {
      return this.cart.ETH;
    },
    tabs() {
      return [
        {
          name: 'Mint a New block',
          route: { name: ETH_BLOCKS_ROUTE.CORE.NAME },
          id: 0,
          hasBadge: false
        },
        {
          name: 'My Blocks',
          route: {
            name: ETH_BLOCKS_ROUTE.MY_BLOCKS.NAME
          },
          id: 1,
          hasBadge: false
        },
        {
          name: `Bulk Minting `,
          route: {
            name: ETH_BLOCKS_ROUTE.BATCH_MINTING.NAME
          },
          id: 2,
          hasBadge: this.identifyNetwork.length > 0 ? true : false,
          badgeContent:
            this.identifyNetwork.length > 0
              ? `${this.identifyNetwork.length}`
              : ''
        }
      ];
    }
  },
  watch: {
    /**
     * Starts interval on new pending txs
     */
    hasPendingTxs(newVal) {
      if (newVal) {
        this.setCheckPendingInterval();
      }
    },
    $route(to) {
      if (to.name === ETH_BLOCKS_ROUTE.MY_BLOCKS.NAME) {
        this.activeTab = this.tabs[1].id;
      } else if (to.name === ETH_BLOCKS_ROUTE.BATCH_MINTING.NAME) {
        this.activeTab = this.tabs[2].id;
      } else {
        this.activeTab = this.tabs[0].id;
      }
    }
  },
  mounted() {
    if (this.hasPendingTxs) {
      this.setCheckPendingInterval();
    }
    if (this.$route.name === ETH_BLOCKS_ROUTE.MY_BLOCKS.NAME) {
      this.activeTab = this.tabs[1].id;
    }
    if (this.$route.name === ETH_BLOCKS_ROUTE.BATCH_MINTING.NAME) {
      this.activeTab = this.tabs[2].id;
    }
  },
  beforeDestroy() {
    clearInterval(this.checkPendingInterval);
  },
  methods: {
    ...mapActions('ethBlocksTxs', ['deleteEthBlockTx']),
    /**
     * Sets interval to start checking pending transactions
     */
    setCheckPendingInterval() {
      clearInterval(this.checkPendingInterval);
      this.checkPendingInterval = setInterval(() => {
        if (this.hasPendingTxs) {
          this.getAllEthBlocksTxs
            .filter(i => i.network === this.network.type.name)
            .forEach(i => {
              this.checkTx(i.hash);
            });
        } else {
          clearInterval(this.checkPendingInterval);
        }
      }, 5000);
    },

    /**
     * Checks web3 Transaction hash.
     * If receipt is defined, removes transaction hash from
     * @param {string} txHash - transaction hash of the
     */
    checkTx(txHash) {
      if (txHash) {
        this.web3.eth.getTransactionReceipt(txHash).then(receipt => {
          if (receipt) {
            const _block = {
              hash: txHash
            };
            this.deleteEthBlockTx(_block);
            if (this.getAllEthBlocksTxs.length === 0) {
              clearInterval(this.checkPendingInterval);
            }
          }
        });
      }
    }
  }
};
</script>
