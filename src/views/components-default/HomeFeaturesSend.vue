<template>
  <white-sheet
    class="mew-component--features-send pa-6 pa-md-10 no-pointer-events"
    max-width="700px"
  >
    <div class="mew-heading-1 mb-3">
      {{ $t('home.features.eth.title') }}
    </div>
    <div class="mt-10">
      <v-row>
        <v-col cols="12" md="6">
          <mew-select label="Type" :items="tokens" />
        </v-col>
        <v-col cols="12" md="6">
          <mew-input
            v-model="data"
            placeholder="0x..."
            :label="$t('sendTx.amount')"
          />
        </v-col>
        <v-col cols="12" class="mt-n5">
          <ModuleAddressBook is-home-page />
        </v-col>
      </v-row>
    </div>
  </white-sheet>
</template>

<script setup>
import { computed, defineAsyncComponent, ref } from 'vue';

const ModuleAddressBook = defineAsyncComponent(() =>
  import('@/modules/address-book/ModuleAddressBook')
);

import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';

// injections/use

const { balance, tokensList } = useWalletStore();
const { network } = useGlobalStore;

// data
const data = ref('1337');

const tokens = computed(() => {
  const eth = {
    name: network.value.type.name,
    symbol: network.value.type.name,
    subtext: network.value.type.name_long,
    value: network.value.type.name_long,
    balance: balance.value,
    img: network.value.type.icon,
    decimals: 18,
    market_cap: null,
    price_change_percentage_24h: null
  };

  const copiedTokens = tokensList.value.slice();
  copiedTokens.unshift(eth);
  return copiedTokens;
});
</script>

<style lang="scss" scoped></style>
