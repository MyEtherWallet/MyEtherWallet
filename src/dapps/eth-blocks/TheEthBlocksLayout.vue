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
import TheWrapperDapp from '@/core/components/TheWrapperDapp';
import { ETH_BLOCKS_ROUTE } from './configsRoutes';
import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: 'TheEthBlocksLayout',
  components: {
    TheWrapperDapp
  },
  data() {
    return {
      header: {
        title: 'ETH Blocks',
        subtext: 'Mint generative art NFTs of Ethereum blocks. '
      },
      activeTab: 0,
      tabs: [
        {
          name: 'Mint a new block',
          route: { name: ETH_BLOCKS_ROUTE.CORE.NAME },
          id: 0
        },
        {
          name: 'My blocks',
          route: {
            name: ETH_BLOCKS_ROUTE.MY_BLOCKS.NAME
          },
          id: 1
        }
      ],
      headerImg: require('@/assets/images/icons/icon-dapp-eth-blocks.svg'),
      validNetworks: SUPPORTED_NETWORKS,
      checkPendingInterval: false
    };
  },
  computed: {
    ...mapState('wallet', ['web3']),
    ...mapGetters('global', ['network']),
    ...mapGetters('ethBlocksTxs', ['getAllEthBlocksTxs']),

    /**
     * Checks if there are pending txs in the dapp
     * @returns {boolean}
     */
    hasPendingTxs() {
      return this.getAllEthBlocksTxs.length > 0;
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
      } else {
        this.activeTab = this.tabs[1].id;
      }
    }
  },
  mounted() {
    if (this.hasPendingTxs) {
      this.setCheckPendingInterval();
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
     * If reciept is defined, removes transaction hash from
     * @param {string} txHash - transaction hash of the
     */
    checkTx(txHash) {
      if (txHash) {
        this.web3.eth.getTransactionReceipt(txHash).then(receipt => {
          if (receipt && receipt.status) {
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
