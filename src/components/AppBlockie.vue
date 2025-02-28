<template>
  <div>
    <div
      v-show="address"
      :class="['relative w-8 h-8 rounded-full ', { 'shadow-token': !isFlat }]"
    >
      <img
        v-if="blockieImg"
        :src="blockieImg"
        :alt="`${address} blockie image`"
        class="rounded-full"
      />

      <!--
      =====================================================================
      Inset shadow on edge of blockie image
      =====================================================================
      -->
      <!-- <div v-if="!flat" class="inset-shadow" /> -->
    </div>
    <img
      v-if="currency"
      alt="icon"
      class="w-3 h-2 absolute top-2 left-2"
      :src="currency"
    />
  </div>
</template>

<script setup lang="ts">
import Blockies from '@/utils/blockies'
import { ref, onMounted, watch } from 'vue'
const props = defineProps({
  /**
   * @address - valid address
   */
  address: {
    type: String,
    required: true,
  },
  /**
   * @isFlat Remove inset shadow
   */
  isFlat: {
    type: Boolean,
    default: false,
  },
  /**
   * @currency image url of the currency
   */
  currency: {
    type: String,
  },
  scale: {
    type: Number,
    default: 16,
  },
  size: {
    type: Number,
    default: 8,
  },
})

const blockieImg = ref<string | null>(null)

const createBlockie = () => {
  blockieImg.value = Blockies({
    seed: props.address ? props.address.toLowerCase() : '',
    size: props.size,
    scale: props.scale,
  }).toDataURL()
}

onMounted(() => {
  createBlockie()
})

watch(
  () => props.address,
  () => {
    createBlockie()
  },
)
watch(
  () => props.scale,
  () => {
    createBlockie()
  },
)
watch(
  () => props.size,
  () => {
    createBlockie()
  },
)
</script>
