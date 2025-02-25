<template>
  <div>
    <img
      v-if="props.isLoaded"
      :src="asset"
      :alt="props.alt"
      :height="props.height"
      :width="props.width"
      @error="handleImageError"
      class="rounded-xl w-[80px] h-[80px]"
    />
    <div
      v-else
      class="rounded-xl w-[80px] h-[80px] flex items-center justify-center bg-grey-5 rounded-xl"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  cachedImg: {
    type: String,
  },
  height: {
    type: Number,
    default: 80,
  },
  width: {
    type: Number,
    default: 80,
  },
  alt: String,
  isLoaded: {
    type: Boolean,
    default: false,
  },
})

const asset = computed(() => {
  if (props.isLoaded && props.cachedImg) {
    return props.cachedImg
  }
  //TODO: Add a placeholder image
  return ''
})

const handleImageError = () => {
  console.error('Error loading image: ', props.cachedImg)
}
</script>
