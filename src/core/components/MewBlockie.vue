<template>
  <div>
    <div
      v-show="address"
      style="position: relative"
      :style="`width: ${width}; height: ${height}`"
    >
      <img
        ref="blockie"
        :src="blockieImg"
        alt="Blockie Image"
        style="display: block; border-radius: 50%"
      />

      <!--
      =====================================================================
      Inset shadow on edge of blockie image
      =====================================================================
      -->
      <div v-if="!flat" class="inset-shadow" />
    </div>
    <img v-if="currency" alt="icon" class="currency-icon" :src="currency" />
  </div>
</template>

<script setup>
import { watch, ref } from 'vue';

import Blockies from '@/core/helpers/blockies.js';

// props
const props = defineProps({
  currency: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '64px'
  },
  height: {
    type: String,
    default: '64px'
  },
  flat: {
    type: Boolean,
    default: false
  }
});

// data
const scale = 16;
const size = 8;
const blockieImg = ref(null);
const blockie = ref(null);

// watch
watch(
  () => props.address,
  () => {
    createBlockie();
  }
);

watch(
  () => props.width,
  () => {
    createBlockie();
  }
);

watch(
  () => props.height,
  () => {
    createBlockie();
  }
);

watch(
  () => props.scale,
  () => {
    createBlockie();
  }
);

watch(
  () => props.size,
  () => {
    createBlockie();
  }
);

// methods
const createBlockie = () => {
  blockieImg.value = Blockies({
    seed: props.address ? props.address.toLowerCase() : '',
    size: size,
    scale: scale
  }).toDataURL();
  blockie.value.style.width = props.width;
  blockie.value.style.height = props.height;
};
</script>

<style lang="scss" scoped>
.inset-shadow {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  box-shadow: inset 0px 0px 4px #939393;
  height: 100%;
  width: 100%;
}
</style>
