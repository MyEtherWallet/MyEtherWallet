<template>
  <the-wrapper-wallet :total-left-col-items="2" :total-right-col-items="2">
    <template #leftColItem1>
      <module-balance />
    </template>
    <template #leftColItem2>
      <module-tokens />
    </template>
    <template #rightColItem1>
      <module-swap-rates />
    </template>
    <template #rightColItem2> </template>
  </the-wrapper-wallet>
</template>

<script>
import TheWrapperWallet from '@/core/components/TheWrapperWallet';
import ModuleBalance from '@/modules/balance/ModuleBalance';
import ModuleTokens from '@/modules/balance/ModuleTokens';
import ModuleSwapRates from '@/modules/swap/ModuleSwapRates.vue';

export default {
  components: {
    ModuleBalance,
    ModuleTokens,
    ModuleSwapRates,
    TheWrapperWallet
  }
};
</script>
