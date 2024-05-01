<template>
  <!-- ======================================================================================= -->
  <!-- Side APR -->
  <!-- ======================================================================================= -->
  <div
    class="mew-component--module-side-apr bgWalletBlockDark pa-5 border-radius--10px"
  >
    <div class="d-flex align-center justify-space-between mb-1">
      <div class="textLight--text text-uppercase mew-label font-weight-medium">
        Current APR
      </div>
      <div class="textLight--text greenPrimary--text">{{ validatorApr }}%</div>
    </div>
    <div class="d-flex align-center justify-space-between">
      <div class="textLight--text text-uppercase mew-label font-weight-medium">
        ETH in pool
      </div>
      <div>{{ formattedPoolValue }} {{ networkName }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import {
  global as useGlobalStore,
  stakewise as useStakewiseStore
} from '@/core/store/index.js';

// injections
const { network } = useGlobalStore();
const { validatorApr, getPoolSupply } = useStakewiseStore();

import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';

// computed
const networkName = computed(() => {
  return network.type.currencyName;
});
const formattedPoolValue = computed(() => {
  return formatFloatingPointValue(getPoolSupply).value;
});
</script>
