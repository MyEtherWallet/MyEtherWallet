<template>
  <div class="mt-10">
    <div class="text-center">
      <div>
        <mew-icon
          v-if="instance.meta.img.type === 'mew-icon'"
          class="border-radius--5px custom-icon-style"
          :icon-name="instance.meta.img.value"
          :img-height="100"
        />
        <img v-else :src="instance.meta.img.value" height="50px" />
      </div>
    </div>
    <div :class="[error !== '' ? 'redPrimary--text' : '', 'text-center mb-5']">
      <p>{{ bodyText }}</p>
    </div>
    <v-progress-linear
      v-if="error === '' && !signed"
      indeterminate
      color="greenPrimary"
      class="mb-3"
    ></v-progress-linear>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

import { wallet as useWalletStore } from '@/core/store/index.js';

// props
const props = defineProps({
  txLength: {
    type: Number,
    default: 1
  },
  signed: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
});

// injections/use
const { instance } = useWalletStore();

// computed
const bodyText = computed(() => {
  if (props.error !== '') return props.error;
  return `Approve ${props.txLength} ${
    props.txLength > 1 ? 'transactions' : 'transaction'
  } on ${instance.meta.name}.`;
});
</script>
<style lang="scss" scoped>
.custom-icon-style {
  border: 1px solid var(--v-greyMedium-base);
}
</style>
