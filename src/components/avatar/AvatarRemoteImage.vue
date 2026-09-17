<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

/**
 * Remote logo with a symbol-initials fallback. The load/error/fallback flow
 * mirrors AppTokenLogo.vue (preload via `new Image()`), sized to fill the avatar
 * box instead of owning its own ring/box. Shared by the Stocks / Crypto / Perps
 * / Network types — their logos come from API URLs, not the repo.
 */
const props = defineProps<{
  url?: string | null
  /** Shown (first 2 chars, uppercased) when the URL is missing or fails. */
  fallbackText?: string
  /** Fallback text size class; caller scales it per avatar size. */
  fallbackTextClass?: string
}>()

const isLoading = ref(true)
const image = ref<string | null>(null)

// Guards against a superseded request's callback: when `url` changes fast, an
// older Image's onload/onerror can still fire and clobber the current result.
let activeRequest = 0

const resolve = () => {
  const url = props.url
  const request = ++activeRequest
  if (!url) {
    isLoading.value = false
    image.value = null
    return
  }
  const img = new Image()
  img.onload = () => {
    if (request !== activeRequest) return
    isLoading.value = false
    image.value = url
  }
  img.onerror = () => {
    if (request !== activeRequest) return
    isLoading.value = false
    image.value = null
  }
  img.src = url
}

onMounted(resolve)
watch(
  () => props.url,
  () => {
    isLoading.value = true
    resolve()
  },
)
</script>

<template>
  <div class="w-full h-full flex items-center justify-center overflow-hidden">
    <img
      v-if="image && !isLoading"
      :src="image"
      class="w-full h-full object-contain"
      alt=""
    />
    <span
      v-else-if="!isLoading && fallbackText"
      class="text-info font-medium uppercase leading-none"
      :class="fallbackTextClass ?? 'text-s-12'"
    >
      {{ fallbackText.substring(0, 2) }}
    </span>
  </div>
</template>
