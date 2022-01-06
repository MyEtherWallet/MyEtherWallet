<template>
  <the-wrapper-wallet :total-left-col-items="1" :total-right-col-items="2">
    <template #leftColItem1>
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
    <template #rightColItem1> </template>
  </the-wrapper-wallet>
</template>

<script>
import TheWrapperWallet from '@/core/components/TheWrapperWallet';
import TheWrapperDapp from '@/core/components/TheWrapperDapp';
import { ETH_BLOCKS_ROUTE } from './configsRoutes';
import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: 'TheEthBlocksLayout',
  components: {
    TheWrapperDapp,
    TheWrapperWallet
  },
  data() {
    return {
      header: {
        title: 'Stakewise',
        subtext: 'Stake any amount of ETH and begin earning rewards.'
      },
      activeTab: 0,
      tabs: [
        {
          name: 'Stake ETH',
          route: { name: ETH_BLOCKS_ROUTE.CORE.NAME },
          id: 0
        },
        {
          name: 'Compound Rewards',
          route: {
            name: ETH_BLOCKS_ROUTE.MY_BLOCKS.NAME
          },
          id: 1
        }
      ],
      headerImg: require('@/assets/images/icons/icon-dapp-stakewise.svg'),
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
