<template>
  <div>
    <!--
    ===================================================
    My Blocks Tab
    ===================================================
    -->
    <div
      v-if="blockRef === ''"
      class="pt-5 pb-13 px-3 px-sm-15 pb-sm-15 pt-md-8"
    >
      <!--
    ===================================================
    Loading
    ===================================================
    -->
      <div v-if="loading">
        <blocks-loading />
      </div>
      <!--
    ===================================================
    Overview Header
    ===================================================
    -->
      <v-row
        v-else
        class="align-center justify-start overview-container-my-blocks mb-5 mb-md-0"
      >
        <!--
      ===================================================
        Block Count
        Order: 1st
      ===================================================
      -->
        <v-col
          cols="12"
          md="3"
          :class="['pt-3 pt-md-0 pb-0', { 'pt-2': hasBlocks }]"
        >
          <div class="mew-heading-3 textDark--text">
            My Blocks <span>({{ handlerMyBlocks.totalBlocks }})</span>
          </div>
        </v-col>
        <v-spacer class="d-none d-md-flex" order="2" />
        <!--
      ===================================================
        Search Blocks
      ===================================================
      -->
        <v-col v-if="hasBlocks" cols="12" md="3" class="pt-0 pb-2 pb-md-0">
          <mew-search
            placeholder="Find my block"
            is-compact
            :value="filterBlock"
            :error-messages="filterErrorMessage"
            @input="setFilter"
          />
        </v-col>
        <!--
      ===================================================
        Sort
        Order: xs-2nd, md-3rd
      ===================================================
      -->
        <v-col v-if="hasBlocks" cols="12" md="3" class="py-0 pb-md-0">
          <blocks-sort @setSort="setActiveSort" />
        </v-col>
      </v-row>
      <!--
      ===================================================
        Alert: No Blocks Owned
      ===================================================
      -->
      <v-row v-if="!hasBlocks && !loading" class="mt-0">
        <v-col cols="12" class="pb-md-16 mb-md-16">
          <mew-alert
            title="You do not have any ETH Blocks"
            description="If you recently minted or purchased an ETH Block, please wait until the transaction has been minted and come back. If you haven’t minted one, what are you waiting for? Mint a block!"
            theme="info"
            hide-close-icon
          />
        </v-col>
      </v-row>
      <!--
    ===================================================
      Owned Blocks
    ===================================================
    -->
      <v-row
        v-if="hasBlocks && !loading"
        class="align-top justify-center justify-sm-start mt-0"
      >
        <v-col
          v-for="block in blocks"
          :key="block.blockNumber"
          cols="9"
          sm="6"
          md="3"
        >
          <div
            class="border-container px-5 pt-5 pb-8 fill-height"
            @click="routeTo(block.blockNumber)"
          >
            <v-img
              :src="block.image"
              lazy-src="../assets/loading-block.svg"
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
            <div class="my-2 mew-heading-2 textDark--text">
              Block #{{ formatBlockNumber(block.blockNumber) }}
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
    <module-eth-block-info v-else :block-ref="blockRef" :has-search="false" />
  </div>
</template>

<script setup>
import {
  defineAsyncComponent,
  defineProps,
  ref,
  computed,
  watch,
  onMounted
} from 'vue';

import { ETH_BLOCKS_ROUTE } from '../configsRoutes';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { formatIntegerToString } from '@/core/helpers/numberFormatHelper';
import { validBlockNumber } from '../handlers/helpers/common';
import HandlerMyBlocks from '../handlers/handlerMyBlocks';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';

import { useRouter } from 'vue-router/composables';
import { useEthBlocksTxsStore } from '../store';

const BlocksLoading = defineAsyncComponent(() =>
  import('../components/BlocksLoading.vue')
);
const BlocksSort = defineAsyncComponent(() =>
  import('../components/BlocksSort.vue')
);
const ModuleEthBlockInfo = defineAsyncComponent(() =>
  import('./ModuleEthBlockInfo.vue')
);

// injections
const router = useRouter();
const { web3, address } = useWalletStore();
const { network } = useGlobalStore();
const { getAllEthBlocksTxs } = useEthBlocksTxsStore();

// props
defineProps({
  blockRef: {
    type: String,
    default: ''
  }
});

// data
const handlerMyBlocks = ref({});
const activeSort = ref(0);
const filterBlock = ref('');

// computed
/**
 * @returns {boolean}:
 * if HandelrMyBlocks.loading equals false,  returns false, otherwise returns true
 */
const loading = computed(() => {
  return handlerMyBlocks.value && handlerMyBlocks.value.loading === false
    ? false
    : true;
});
/**
 * Returns filtered array based on the user input
 * @returns {Array}
 */
const blocks = computed(() => {
  if (!loading.value) {
    switch (activeSort.value) {
      case 0:
        return filter(handlerMyBlocks.value.blocks.newest);
      case 1:
        return filter(handlerMyBlocks.value.blocks.oldest);
      case 2:
        return filter(handlerMyBlocks.value.blocks.ascend);
      case 3:
        return filter(handlerMyBlocks.value.blocks.dscend);
      default:
        return filter(handlerMyBlocks.value.blocks.newest);
    }
  }
  return [];
});
/**
 * Returns whether or not you own any blocks
 * Used to hide/show search components, as well as styling adjustments
 * @returns {boolean}:
 *
 */
const hasBlocks = computed(() => {
  return handlerMyBlocks.value.totalBlocks > 0;
});
/**
 * Property returns an error message based onthe filter input
 * @returns {string}
 */
const filterErrorMessage = computed(() => {
  if (filterBlock.value && filterBlock.value !== '') {
    if (!validBlockNumber(filterBlock)) {
      return 'value must be a positive  integer';
    }
    if (!handlerMyBlocks.value.checkHasBlock(filterBlock.value)) {
      return `You do not own block #${filterBlock.value}`;
    }
  }
  return '';
});

// watch
/**
 * WATCH: Update HandelrMyBlocks on network change and fetch data
 *  @param {Object} newVal - current address
 */
watch(
  () => network.value,
  newVal => {
    if (newVal) {
      handlerMyBlocks.value.setNetwork(newVal);
      handlerMyBlocks.value.getBlocks();
    }
  }
);
/**
 * WATCH: Update HandelrMyBlocks on address change and fetch data
 * @param {string} newVal - current address
 */
watch(
  () => address.value,
  newVal => {
    if (newVal) {
      handlerMyBlocks.value.setAddress(newVal);
      handlerMyBlocks.value.getBlocks();
    }
  }
);
/**
 * WATCH: Update HandelrMyBlocks on pending txs resolution
 * @param {Array} newVal - current address
 */
watch(
  () => getAllEthBlocksTxs.value,
  newVal => {
    if (newVal) {
      handlerMyBlocks.value.getBlocks();
    }
  }
);

// mounted
onMounted(() => {
  /**
   * Initiate My Blocks Handler
   */
  handlerMyBlocks.value = new HandlerMyBlocks(
    web3.value,
    network.value,
    address.value
  );
  handlerMyBlocks.value.getBlocks();
});

/**
 * Routes to block info page, based on block number
 * Used in block containers
 * @param {number} block
 */
const routeTo = block => {
  try {
    router.push({
      name: ETH_BLOCKS_ROUTE.MY_BLOCKS.NAME,
      query: { block: block.toString() }
    });
  } catch (e) {
    Toast(e, {}, ERROR);
  }
};
/**
 * Formats block number
 * @param {number} block
 * @returns {string}
 */
const formatBlockNumber = block => {
  return formatIntegerToString(block);
};
/**
 * Sets Active sort, invoked by emit from BlockSort component
 * @param {number} value
 */
const setActiveSort = value => {
  activeSort.value = value;
};
/**
 * Methods sets filterBlock based on the use input in search block component
 * @param {any}
 * If value is undefined or null sets filter block to empry string
 */
const setFilter = block => {
  if (block) {
    filterBlock.value = block;
  } else {
    filterBlock.value = '';
  }
};
/**
 * Methods filters array based on the search input provided by user
 * @param {Array} blocks
 * @return {Array}
 */
const filter = blocks => {
  if (filterBlock.value !== '' && filterErrorMessage.value === '') {
    return blocks.filter(value =>
      value.blockNumber
        .toString()
        .toLowerCase()
        .includes(filterBlock.value.toLowerCase())
    );
  }
  return blocks;
};
</script>

<style lang="scss" scoped>
.border-container {
  border: 1px solid var(--v-greyMedium-base);
  border-radius: 12px;
  cursor: pointer;
}

.overview-container-my-blocks {
  @media (min-width: 960px) {
    min-height: 74px;
  }
}
</style>
