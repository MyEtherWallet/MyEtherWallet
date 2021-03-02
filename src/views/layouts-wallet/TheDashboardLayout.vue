<template>
  <the-layout-wallet-grid :total-left-col-items="2" :total-right-col-items="2">
    <template #leftColItem1>
      <module-balance />
    </template>
    <template #leftColItem2>
      <module-tokens />
    </template>
    <template #rightColItem1>
      <app-swap />
    </template>
    <template #rightColItem2>
      <app-carousel />
    </template>
  </the-layout-wallet-grid>
</template>

<script>
import TheLayoutWalletGrid from '@/core/components/TheLayoutWalletGrid';
import AppCarousel from '@/core/components/AppCarousel';
import ModuleBalance from '@/modules/balance/ModuleBalance';
import ModuleTokens from '@/modules/balance/ModuleTokens';
import AppSwap from '@/core/components/AppSwap';

export default {
  components: {
    AppCarousel,
    ModuleBalance,
    ModuleTokens,
    AppSwap,
    TheLayoutWalletGrid
  }
};
</script>
