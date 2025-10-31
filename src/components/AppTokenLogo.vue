<template>
  <div
    :class="[
      width,
      height,
      { 'bg-white': image && !isLoading },
      {
        'border bg-surface border-1 border-grey-10 box-border flex items-center justify-center':
          !image || isLoading,
      },
      isLoading ? 'animate-pulse' : 'shadow-token',
    ]"
    class="rounded-full overflow-hidden flex-none"
  >
    <p v-if="!image" class="text-info font-medium text-center uppercase">
      {{ getSymbol() }}
    </p>
    <img
      v-else
      class="object-contain w-full h-full"
      :src="image"
      width="28"
      height="28"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
const props = defineProps({
  url: {
    type: [String, null],
    required: false,
  },
  symbol: {
    type: String,
    required: false,
  },
  width: {
    type: String,
    default: 'w-6 xs:w-8',
  },
  height: {
    type: String,
    default: 'h-6 xs:h-8',
  },
})

const getSymbol = (): string => {
  if (props.symbol) {
    return props.symbol.substring(0, 2)
  }
  return 'MN'
}

const isLoading = ref<boolean>(true)
const image = ref<string | null>(null)

const resolveImage = () => {
  if (props.url) {
    const img = new Image()
    img.src = props.url
    img.onload = () => {
      isLoading.value = false
      image.value = props.url || null
    }
    img.onerror = () => {
      isLoading.value = false
      image.value = null
    }
  } else {
    isLoading.value = false
    image.value = null
  }
}
onMounted(() => {
  resolveImage()
})

watch(
  () => props.url,
  () => {
    isLoading.value = true
    resolveImage()
  },
)
</script>
