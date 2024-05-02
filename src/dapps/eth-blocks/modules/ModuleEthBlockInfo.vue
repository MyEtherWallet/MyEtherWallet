<template>
  <!--
    ===================================================
    Blocks Mint Tab
    ===================================================
    -->
  <v-container
    class="dapps--module-eth-block-info px-3 pb-13 pt-5 px-md-15 pb-md-15 pt-md-8"
  >
    <!--
        ===================================================
          Block Search or BlockInfo
        ===================================================
        -->
    <block-search v-if="hasSearch" class="mb-8 mb-md-5 mt-md-7" />
    <router-link
      v-else
      :to="{ name: ROUTES.MY_BLOCKS.NAME }"
      class="blue500--text"
    >
      <v-row class="align-center mt-3 mb-7 mb-md-8" no-gutters>
        <v-icon class="bluePrimary--text" size="20"> mdi-chevron-left</v-icon>
        <div>Back to all My blocks</div>
      </v-row>
    </router-link>
    <!--
      ===================================================
        NFT Image: XS AND SM
      ===================================================
      -->
    <v-row
      v-if="!loading"
      no-gutters
      class="justify-center mb-4 d-flex d-md-none align-center"
    >
      <a
        :href="blockHandler.rawImg"
        target="_blank"
        class="border-container d-block pa-1 mx-auto cursor-image"
      >
        <v-img
          lazy-src="../assets/loading-block.svg"
          :src="blockHandler.img"
          :max-width="$vuetify.breakpoint.xs ? '160' : '240'"
          contain
        >
          <template #placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="disabledPrimary"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </a>
    </v-row>
    <v-row v-if="!loading" no-gutters class="justify-center mt-md-5">
      <!--
        ===================================================
          NFT Image: MD AND UP
        ===================================================
        -->
      <div class="d-block">
        <a
          :href="blockHandler.rawImg"
          target="_blank"
          class="border-container d-none d-md-flex pa-1 mr-md-10 cursor-image"
        >
          <v-img
            lazy-src="../assets/loading-block.svg"
            :src="blockHandler.img"
            max-width="332"
            contain
          >
            <template #placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="disabledPrimary"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </a>
        <!----- * BELOW IS COMMENTED OUT FOR NOW * ------->
        <!-- <div v-if="isReserved">
          <h3 class="text-center text-md-left mt-5 ml-1">Owners Comment:</h3>
          <p class="ml-1">
            {{ blockHandler.description }}
          </p>
        </div> -->
      </div>

      <v-col>
        <!--
        ===================================================
          NFT Title
        ===================================================
        -->
        <div
          class="d-flex flex-row align-center justify-space-between mb-4 mb-md-5"
        >
          <h2 class="text-center text-md-left">
            Block #{{ blockNumberFormatted }}
          </h2>
          <div class="d-flex align-center">
            <share-network
              network="twitter"
              :url="`https://www.ethvm.com/block/number/${blockRef}`"
              title="Twitter message"
              hashtags="MyEtherWallet,MEW,EthBlocks"
            >
              <mew-button class="mr-1" btn-style="light" color-theme="basic">
                <div class="d-flex align-center">
                  <v-icon left>mdi-twitter</v-icon>
                  <div>Share</div>
                </div>
              </mew-button>
            </share-network>
            <!-------------* Below is commented out for now * ------------------->
            <!-------------* Below is commented out for now * ------------------->
            <!-- <share-network
              network="twitter"
              :url="`https://www.ethvm.com/block/number/${props.blockRef}`"
              title="Eth Museum"
              hashtags="MyEtherWallet,MEW,EthBlocks"
            > -->
            <mew-button
              class="ml-4"
              btn-style="light"
              color-theme="basic"
              disabled
            >
              <div class="d-flex align-center">
                <v-icon left>mdi-launch</v-icon>
                <div>View in Museum</div>
              </div>
            </mew-button>
            <!-- </share-network> -->
          </div>
        </div>
        <!--
        ===================================================
          Block Info alert.value component
        ===================================================
        -->
        <block-info
          :block-alert="alert"
          :block-number="blockRef"
          :owner="alertOwner"
          :price="alertMintPrice"
          :disable-action="isActionInProgress"
          :estimated-total-wei="estimatedTotal"
          :is-pending="hasPendingTx"
          :has-enough-eth="hasEnoughEth"
          @mint="mintBlock"
          @openSend="openSendBlockOverlay"
        />
        <!--
        ===================================================
          Block Description
        ===================================================
        -->
        <div class="mt-10 mt-md-5">
          <div :class="['textMedium--text', { 'mb-2': !isTestNetwork }]">
            {{ blockHandler.description }}
          </div>
        </div>
        <!--
        ===================================================
          NFT Properties
          XS12
        ===================================================
        -->
        <div class="table-properties mt-10">
          <div
            class="table-properties--header py-3 px-5 textLight--text mew-caption"
          >
            properties
          </div>
          <div
            v-for="(item, index) in properties"
            :key="index"
            :class="[
              { 'table-properties--row-colored': isEven(index) },
              {
                'table-properties--last-row': index + 1 === properties.length
              },
              'd-flex flex-row justify-space-between py-3 px-5 textDark--text '
            ]"
          >
            <div>{{ item.text }}</div>
            <div>{{ item.value }}</div>
          </div>
        </div>
      </v-col>
    </v-row>
    <a
      v-if="!loading"
      class="d-flex flex-row-reverse mt-3"
      :href="`https://www.ethvm.com/block/number/${props.blockRef}`"
      target="_blank"
      @click="trackToEthVM"
    >
      View block info on EthVM
    </a>
    <blocks-loading v-else />
    <block-send
      :open="openSendOverlay"
      :close="closeSendOverlay"
      :block-number="blockNumberFormatted"
      :is-sending="isSending"
      @send="sendBlock"
    />
  </v-container>
</template>

<script>
const MIN_GAS_TRANSFER = 150000;
const MIN_GAS_MINT = 350000;
</script>
<script setup>
import { defineAsyncComponent, ref, computed, onMounted, watch } from 'vue';
import { toBN } from 'web3-utils';

import { BLOCK_ALERT } from '../handlers/helpers/blockAlertType';
import { formatIntegerToString } from '@/core/helpers/numberFormatHelper';
import { ETH_BLOCKS_ROUTE } from '../configsRoutes';
import { validBlockNumber } from '../handlers/helpers/common';

import handlerBlock from '../handlers/handlerBlock';
import { useAmplitude } from '@/core/composables/amplitude';
import {
  global as useGlobalStore,
  wallet as useWalletStore,
  ethBlocksTxs as useEthBlocksTxsStore
} from '@/core/store/index.js';
import { useRouter } from 'vue-router/composables';

const BlockInfo = defineAsyncComponent(() =>
  import('../components/BlockInfo.vue')
);
const BlockSearch = defineAsyncComponent(() =>
  import('../components/BlockSearch.vue')
);
const BlockSend = defineAsyncComponent(() =>
  import('../components/BlockSend.vue')
);
const BlocksLoading = defineAsyncComponent(() =>
  import('../components/BlocksLoading.vue')
);

// injections/use
const { trackDapp } = useAmplitude();
const { network, isTestNetwork, gasPrice } = useGlobalStore();
const { web3, address, balanceInWei } = useWalletStore();
const { getEthBlockTx } = useEthBlocksTxsStore();
const router = useRouter();

// props
const props = defineProps({
  blockRef: {
    type: String,
    required: true
  },
  hasSearch: {
    type: Boolean,
    default: true
  }
});

// data
const ROUTES = ETH_BLOCKS_ROUTE;
const blockHandler = ref({});
const openSendOverlay = ref(false);

// computed
/**
 * Deteremines if you have default min eth to pay
 * @returns {boolean}
 */
const hasEnoughEth = computed(() => {
  if (
    alert.value === BLOCK_ALERT.OWNED ||
    alert.value === BLOCK_ALERT.AVAILABLE
  ) {
    return !toBN(balanceInWei).sub(toBN(estimatedTotal.value)).isNeg();
  }
  return true;
});
const estimatedTotal = computed(() => {
  if (
    alert.value === BLOCK_ALERT.OWNED ||
    alert.value === BLOCK_ALERT.AVAILABLE
  ) {
    const gasLimit =
      alert.value === BLOCK_ALERT.OWNED ? MIN_GAS_TRANSFER : MIN_GAS_MINT;
    const txFee = toBN(gasLimit).mul(toBN(gasPrice));
    return alert.value === BLOCK_ALERT.OWNED
      ? txFee.toString()
      : txFee.add(toBN(blockHandler.value.mintPrice)).toString();
  }
  return '0';
});

/**
 * @returns {string}:
 * formatted string of the block number
 */
const blockNumberFormatted = computed(() => {
  return formatIntegerToString(props.blockRef);
});
/**
 * @returns {boolean}:
 * if HandelrBlockInfo.loading equals false,  returns false, otherwise returns true
 */
const loading = computed(() => {
  return blockHandler.value && blockHandler.value.loading === false
    ? false
    : true;
});
/**
 * @returns allert type based on the owner of the block:
 * - null -> available
 * - adrees === wallet address -> owned
 * - address !== wallet address -> not available
 */
const alert = computed(() => {
  if (isReserved.value) {
    return BLOCK_ALERT.RESERVED;
  }
  if (!loading.value && blockHandler.value.hasOwner) {
    return address === blockHandler.value.owner
      ? BLOCK_ALERT.OWNED
      : BLOCK_ALERT.NOT_AVAILABLE;
  }
  return BLOCK_ALERT.AVAILABLE;
});
/**
 * @returns {string} block owner
 */
const alertOwner = computed(() => {
  return loading.value ? '' : blockHandler.value.owner;
});
/**
 * @returns {string} block mint price
 */
const alertMintPrice = computed(() => {
  return loading.value ? '' : blockHandler.value.mintPrice;
});

/**
 * @returns array of block properties
 */
const properties = computed(() => {
  if (!loading.value) {
    const author = `${blockHandler.value.author.substr(
      0,
      6
    )}...${blockHandler.value.author.substr(
      blockHandler.value.author.length - 4,
      4
    )}`;

    const _data = [
      { text: 'Number', value: blockNumberFormatted.value },
      { text: 'Date Created', value: blockHandler.value.date },
      { text: 'Author', value: author },
      {
        text: 'Transactions',
        value: formatIntegerToString(blockHandler.value.transactions)
      },
      {
        text: 'Gas Used',
        value: formatIntegerToString(blockHandler.value.gasUsed)
      },
      {
        text: 'Uncles',
        value: formatIntegerToString(blockHandler.value.transactions)
      }
    ];
    if (blockHandler.value.extra.length > 0) {
      blockHandler.value.extra.forEach(item => {
        _data.push({
          text: 'Extra',
          value: item.value
        });
      });
    }
    return _data;
  }
  return [];
});
/**
 * @returns {boolean}:
 */
const isSending = computed(() => {
  return loading.value ? false : blockHandler.value.isSending;
});
/**
 * Used in alert.value ui, disals button after user clicks send/mint to show that soemthign is happening
 * @returns {boolean}
 */
const isActionInProgress = computed(() => {
  return loading.value
    ? false
    : blockHandler.value.isMinting || blockHandler.value.isSending;
});
/**
 * Determines whether or not there is a pending transaction in the current chain for current block
 * @returns {boolean}
 */
const hasPendingTx = computed(() => {
  const _block = {
    blockNumber: props.blockRef.toString(),
    hash: blockHandler.value.pendingTxHash,
    network: network.type.name
  };
  return getEthBlockTx(_block) ? true : false;
});
/**
 * Determines whether or not this block is reserved 1-10
 * @returns {boolean}
 */
const isReserved = computed(() => {
  const _currBlock = toBN(props.blockRef);
  const RESERVED = toBN(10);
  return !_currBlock.isZero() && _currBlock.lte(RESERVED);
});

// watch
/**
 * Update HandelrBlockInfo on block number change and fetch data
 */
watch(props.blockRef, newVal => {
  if (validBlockNumber(newVal)) {
    blockHandler.value.setBlockNumber(newVal);
    resetBlock();
  } else {
    router.push({ name: ETH_BLOCKS_ROUTE.CORE.NAME });
  }
});
/**
 * Update HandelrBlockInfo on network change and fetch data
 */
watch(network, newVal => {
  if (newVal) {
    blockHandler.value.setNetwork(newVal);
    resetBlock();
  }
});

/**
 * Update HandelrBlockInfo on network change and fetch data
 */
watch(address, newVal => {
  if (newVal) {
    blockHandler.value.setAddress(newVal);
    resetBlock();
  }
});

/**
 * Watch hasPending txs
 * if newVal - close send overlay
 * if !newVal - refetch block info
 */
watch(hasPendingTx, (newVal, oldVal) => {
  /* New Hash was asigned */ {
    if (newVal && newVal !== oldVal) {
      if (openSendOverlay.value) {
        closeSendOverlay();
      }
    }
    if (newVal === false) {
      resetBlock();
    }
  }
});

onMounted(() => {
  /**
   * Initiate Block Info Handler
   * if valid block number --> fetch block info
   * if !valid block number --> reroute to default eth blocks route
   */
  if (validBlockNumber(props.props.blockRef)) {
    blockHandler.value = new handlerBlock(
      web3,
      network,
      props.props.blockRef,
      address
    );
    resetBlock();
  } else {
    router.push({ name: ETH_BLOCKS_ROUTE.CORE.NAME });
  }
});

// methods
/**
 * tracks when user clicks ethvm from ethblocks
 */
const trackToEthVM = () => {
  trackDapp('ethBlocksToEthVM');
};
const resetBlock = () => {
  blockHandler.value.getBlock();
};

/**
 * Method returns whether or no number is even.
 * Used in table component, to determine row color
 * @param {number} _value
 * @returns {boolean}
 */
const isEven = _value => {
  return _value % 2 == 0;
};
/**
 * Method mints a blocks.
 * Responds, to child alert.value component on emit 'mint' event
 */
const mintBlock = () => {
  trackDapp('ethBlocksMint');
  blockHandler.value.mintBlock(balanceInWei, gasPrice);
};

/**
 * Method opens send overlay .
 * Responds, to child alert.value component on emit 'openSend' event
 */
const openSendBlockOverlay = () => {
  openSendOverlay.value = true;
};
/**
 * Method closes send overlay .
 * Responds, to child alert.value component on emit 'close' event
 */
const closeSendOverlay = () => {
  openSendOverlay.value = false;
};
/**
 * Method sends EthBlock .
 * Responds, to child alert.value component on emit 'send' event
 * @param {string} value - to address
 */
const sendBlock = value => {
  trackDapp('ethBlocksSendBlock');
  blockHandler.value.transferBlock(value, balanceInWei, gasPrice);
};
</script>

<style lang="scss" scoped>
.border-container {
  border: 1px solid var(--v-greyMedium-base);
  border-radius: 12px;
}

.table-properties {
  border: 1px solid var(--v-greyMedium-base);
  border-radius: 10px;
  .table-properties--header {
    background-color: var(--v-backgroundWallet-base);
    border-radius: 10px 10px 0% 0%;
  }
  .table-properties--row-colored {
    background-color: var(--v-backgroundGrey-base);
  }
  .table-properties--last-row {
    border-radius: 0% 0% 10px 10px;
  }
}
.cursor-image {
  cursor: -moz-zoom-in;
  cursor: -webkit-zoom-in;
  cursor: zoom-in;
}
</style>
