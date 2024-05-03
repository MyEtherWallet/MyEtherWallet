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

<script setup>
import {
  defineAsyncComponent,
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount
} from 'vue';
import { ETH_BLOCKS_ROUTE } from './configsRoutes';
import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';
import { useRoute } from 'vue-router/composables';

import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useEthBlocksTxsStore } from './store';

const TheWrapperDapp = defineAsyncComponent(() =>
  import('@/dapps/TheWrapperDapp.vue')
);

// injections
const route = useRoute();
const { network } = useGlobalStore();
const { web3 } = useWalletStore();
const { cart, getAllEthBlocksTxs, deleteEthBlockTx } = useEthBlocksTxsStore();

// data
const header = {
  title: 'ETH Blocks',
  subtext: 'Mint generative art NFTs of Ethereum blocks. '
};
const headerImg = require('@/assets/images/icons/dapps/icon-dapp-ethblocks.svg');
const validNetworks = SUPPORTED_NETWORKS;
const activeTab = ref(0);
const checkPendingInterval = ref(false);

// computed
/**
 * Checks if there are pending txs in the dapp
 * @returns {boolean}
 */
const hasPendingTxs = computed(() => {
  return getAllEthBlocksTxs.length > 0;
});
const identifyNetwork = computed(() => {
  return cart.ETH;
});
const tabs = computed(() => {
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
      hasBadge: identifyNetwork.value.length > 0 ? true : false,
      badgeContent:
        identifyNetwork.value.length > 0
          ? `${identifyNetwork.value.length}`
          : ''
    }
  ];
});

// watch
/**
 * Starts interval on new pending txs
 */
watch(hasPendingTxs, newVal => {
  if (newVal) {
    setCheckPendingInterval();
  }
});
watch(route, to => {
  if (to.name === ETH_BLOCKS_ROUTE.MY_BLOCKS.NAME) {
    activeTab.value = tabs.value[1].id;
  } else if (to.name === ETH_BLOCKS_ROUTE.BATCH_MINTING.NAME) {
    activeTab.value = tabs.value[2].id;
  } else {
    activeTab.value = tabs.value[0].id;
  }
});

// onMounted
onMounted(() => {
  if (hasPendingTxs.value) {
    setCheckPendingInterval();
  }
  if (route.name === ETH_BLOCKS_ROUTE.MY_BLOCKS.NAME) {
    activeTab.value = tabs.value[1].id;
  }
  if (route.name === ETH_BLOCKS_ROUTE.BATCH_MINTING.NAME) {
    activeTab.value = tabs.value[2].id;
  }
});

// beforeDestroy
onBeforeUnmount(() => {
  clearInterval(checkPendingInterval.value);
});

// methods
/**
 * Sets interval to start checking pending transactions
 */
const setCheckPendingInterval = () => {
  clearInterval(checkPendingInterval.value);
  checkPendingInterval.value = setInterval(() => {
    if (hasPendingTxs.value) {
      getAllEthBlocksTxs
        .filter(i => i.network === network.type.name)
        .forEach(i => {
          checkTx(i.hash);
        });
    } else {
      clearInterval(checkPendingInterval.value);
    }
  }, 5000);
};

/**
 * Checks web3 Transaction hash.
 * If reciept is defined, removes transaction hash from
 * @param {string} txHash - transaction hash of the
 */
const checkTx = txHash => {
  if (txHash) {
    web3.eth.getTransactionReceipt(txHash).then(receipt => {
      if (receipt) {
        const _block = {
          hash: txHash
        };
        deleteEthBlockTx(_block);
        if (getAllEthBlocksTxs.length === 0) {
          clearInterval(checkPendingInterval.value);
        }
      }
    });
  }
};
</script>
