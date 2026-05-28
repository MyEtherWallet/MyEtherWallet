<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="isOpen && isDesktop"
        class="fixed inset-0 z-[200] bg-black/40"
        @click="close"
      />
    </transition>
  </Teleport>
  <global-search-input v-if="isDesktop" />
  <global-search-trigger v-else />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { useGlobalSearch } from './composables/useGlobalSearch'
import GlobalSearchInput from './components/GlobalSearchInput.vue'
import GlobalSearchTrigger from './components/GlobalSearchTrigger.vue'

const { isXLMinAndUp } = useAppBreakpoints()
const isDesktop = computed(() => isXLMinAndUp.value)
const { isOpen, close } = useGlobalSearch()
</script>
