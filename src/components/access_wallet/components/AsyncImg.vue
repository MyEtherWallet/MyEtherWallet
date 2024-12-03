<template>
  <img
    :src="asset"
    :alt="props.alt"
    :height="props.height"
    :width="props.width"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  asyncImg: {
    type: [String, Function] as PropType<string | (() => Promise<string>)>,
    required: true,
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
})

const resolvedImg = ref('')
const isLoaded = ref(false)

if (typeof props.asyncImg === 'function') {
  props.asyncImg().then((url: string) => {
    isLoaded.value = true
    resolvedImg.value = url
  })
} else {
  isLoaded.value = true
  resolvedImg.value = props.asyncImg
}

const asset = computed(() => {
  if (isLoaded.value) {
    return resolvedImg.value
  }
  //TODO: Add a placeholder image
  return ''
})
</script>
