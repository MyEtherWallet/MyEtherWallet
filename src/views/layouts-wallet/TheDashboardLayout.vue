<template>
  <the-wrapper-wallet
    :total-left-col-items="2"
    :has-draggable="false"
    :total-right-col-items="2"
  >
    <template #leftColItem1>
      <div>
        <module-balance />
        <prototype-layout-component class="mt-4" />
      </div>
    </template>
    <template #leftColItem2>
      <module-tokens />
    </template>
    <template #rightColItem1>
      <prototype-column class="mb-4" />
      <module-swap-rates />
    </template>
    <template #rightColItem2>
      <prototype-full-message />
    </template>
  </the-wrapper-wallet>
</template>

<script>
import PrototypeLayoutComponent from '@/core/components/PrototypeLayoutComponent.vue';
import PrototypeColumn from '@/core/components/PrototypeColumn.vue';
import PrototypeFullMessage from '@/core/components/PrototypeFullMessage.vue';
export default {
  components: {
    PrototypeLayoutComponent,
    PrototypeColumn,
    PrototypeFullMessage,
    AppCarousel: () => import('@/core/components/AppCarousel'),
    ModuleBalance: () => import('@/modules/balance/ModuleBalance'),
    ModuleTokens: () => import('@/modules/balance/ModuleTokens'),
    ModuleSwapRates: () => import('@/modules/swap/ModuleSwapRates'),
    TheWrapperWallet: () => import('@/core/components/TheWrapperWallet')
  }
};
</script>
