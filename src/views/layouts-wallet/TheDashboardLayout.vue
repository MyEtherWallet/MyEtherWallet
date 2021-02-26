<template>
  <v-row>
    <v-col cols="12" md="8">
      <module-balance v-if="!showBuyEth" />
      <module-no-balance v-else />
      <module-tokens />
    </v-col>
    <v-col cols="12" md="4">
      <module-network />
      <app-swap class="mt-3" />
      <app-carousel class="mt-3" />
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
import AppCarousel from '@/core/components/AppCarousel';
import ModuleNetwork from '@/modules/network/ModuleNetwork';
import ModuleBalance from '@/modules/balance/ModuleBalance';
import ModuleTokens from '@/modules/balance/ModuleTokens';
import ModuleNoBalance from '@/modules/balance/ModuleNoBalance';
import AppSwap from '@/core/components/AppSwap';

export default {
  components: {
    AppCarousel,
    ModuleBalance,
    ModuleNoBalance,
    ModuleNetwork,
    ModuleTokens,
    AppSwap
  },
  computed: {
    ...mapGetters('wallet', ['balanceInETH']),
    showBuyEth() {
      return this.balanceInETH <= 0;
    }
  }
};
</script>
