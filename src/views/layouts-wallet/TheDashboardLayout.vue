<template>
  <the-wrapper-wallet
    :total-left-col-items="2"
    :has-draggable="false"
    :total-right-col-items="2"
  >
    <template #leftColItem1>
      <module-balance />
    </template>
    <template #leftColItem2>
      <module-tokens />
    </template>
    <template #rightColItem1>
      <module-swap-rates />
    </template>
    <template #rightColItem2>
      <app-carousel />
    </template>
  </the-wrapper-wallet>
</template>

<script>
export default {
  components: {
    AppCarousel: () => import('@/core/components/AppCarousel'),
    ModuleBalance: () => import('@/modules/balance/ModuleBalance'),
    ModuleTokens: () => import('@/modules/balance/ModuleTokens'),
    ModuleSwapRates: () => import('@/modules/swap/ModuleSwapRates'),
    TheWrapperWallet: () => import('@/core/components/TheWrapperWallet')
  }
};
</script>
