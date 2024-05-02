<template>
  <div class="dapps--eth-blocks--data-search pt-8 px-3 px-lg-12 pb-12 px-md-12">
    <block-search />
    <div class="pt-12">
      <div v-if="foundBlocks.length > 0">
        <block-result-component
          v-for="(block, idx) in foundBlocks"
          :key="block.blockNumber"
          :block-handler="block"
          :is-loading="false"
          :has-border="idx != foundBlocks.length - 1"
        />
      </div>
      <div v-else>
        <block-result-component
          v-for="(block, idx) in 3"
          :key="`loadingBlockResult` + block"
          is-loading
          :has-border="idx != 2"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent, computed, watch, ref, onMounted } from 'vue';
import { toBN } from 'web3-utils';
import EthDater from 'ethereum-block-by-date';
import moment from 'moment';
import { uniqBy } from 'lodash';
import { useRoute } from 'vue-router/composables';

import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import handlerBlock from '../handlers/handlerBlock';
import {
  global as useGlobalStore,
  wallet as useWalletStore
} from '@/core/store/index.js';

const BlockSearch = defineAsyncComponent(() =>
  import('../components/BlockSearch')
);
const BlockResultComponent = defineAsyncComponent(() =>
  import('../components/BlockResultComponent')
);

// injections/use
const { network } = useGlobalStore();
const { web3, address, blockNumber } = useWalletStore();
const route = useRoute();

// data
const foundBlocks = ref([]);
const totalResult = ref(0);

// computed
const maxBlock = computed(() => {
  const max = toBN(blockNumber).sub(toBN(50));
  const ZERO = toBN(0);
  return max.gt(ZERO) ? max.toNumber() : 0;
});

// watch
watch(
  route.params,
  () => {
    fetchBlocksByDate();
  },
  { deep: true }
);

// mounted
onMounted(() => {
  fetchBlocksByDate();
});

// methods
// initializes the block searcher
// loops through the result and fetch the
// block meta before pushing to empty array
const fetchBlocksByDate = async () => {
  const newResultArray = [];
  foundBlocks.value = [];
  const dater = new EthDater(web3.eth);
  const startTimeString = route.params.dateString;
  const endTimeString = startTimeString + 1000 * 60; // adds a minute to starting range
  try {
    const blocks = await dater.getEvery(
      'seconds',
      moment(startTimeString),
      moment(endTimeString),
      1,
      true
    );
    const filterBlocks = uniqBy(blocks, 'block');
    totalResult.value = filterBlocks.length;
    for (let index = 0; index < filterBlocks.length; index++) {
      if (filterBlocks[index].block <= maxBlock.value) {
        const block = new handlerBlock(
          web3,
          network,
          filterBlocks[index].block,
          address
        );

        newResultArray.push(
          block.getBlock().then(() => {
            return block;
          })
        );
      }
    }
    Promise.all(newResultArray).then(values => {
      foundBlocks.value = values.sort((a, b) => {
        return a.blockNumber < b.blockNumber
          ? -1
          : a.blockNumber > b.blockNumber
          ? 1
          : 0;
      });
    });
  } catch (e) {
    Toast(e, {}, ERROR);
  }
};
</script>

<style lang="scss" scoped></style>
