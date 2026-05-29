<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[200] bg-black/40"
        @click="close"
      />
    </transition>
  </Teleport>
  <global-search-input />
</template>

<script setup lang="ts">
import { useGlobalSearch } from './composables/useGlobalSearch'
import GlobalSearchInput from './components/GlobalSearchInput.vue'

const { isOpen, close } = useGlobalSearch()
</script>
