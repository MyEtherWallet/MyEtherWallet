<template>
  <div class="pa-6">
    <v-sheet color="transparent" max-width="550px" class="mb-7 locale-config">
      <mew-select
        ref="mewSelect"
        label="Currency"
        class="testing"
        filter-placeholder="Search currency"
        :items="currencies"
        :value="currency"
        :is-custom="true"
        @input="setCurrencyType"
      />
    </v-sheet>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';

import currencyList from './currencyList';
import {
  global as useGlobalStore,
  extenral as useExternalStore
} from '@/core/store/index.js';

// injections/use
const { preferredCurrency, setPreferredCurrency } = useGlobalStore();
const { setCurrency } = useExternalStore();

// data
const currency = ref({});

// computed
const currencies = computed(() => {
  const imgs = currencyList.map(c => c.img);
  return [
    {
      imgs,
      divider: true
    },
    ...currencyList
  ];
});

const currentCurrency = computed(() => {
  return currencyList.find(c => c.value === preferredCurrency);
});

// mounted
onMounted(() => {
  currency.value = currentCurrency;
});

// methods
const setCurrencyType = val => {
  setPreferredCurrency(val.value);
  setCurrency(val.value);
};
</script>

<style lang="scss" scoped>
.locale-config >>> .v-menu__content .align-end {
  display: none !important;
}
</style>
