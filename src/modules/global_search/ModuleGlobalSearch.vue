<template>
  <global-search-input v-if="isDesktop" />
  <global-search-trigger v-else />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import GlobalSearchInput from './components/GlobalSearchInput.vue'
import GlobalSearchTrigger from './components/GlobalSearchTrigger.vue'

const { isXLMinAndUp } = useAppBreakpoints()
const isDesktop = computed(() => isXLMinAndUp.value)
</script>
