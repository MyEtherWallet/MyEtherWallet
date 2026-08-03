<script setup lang="ts">
/**
 * Underline-style tab bar (design-library "TabBar"): left-aligned text tabs
 * over a full-width divider; the active tab is bold with a dark underline.
 * Index-based v-model; the consumer renders the panel content itself.
 */
defineProps<{ modelValue: number; tabs: string[] }>()
defineEmits<{ 'update:modelValue': [index: number] }>()
</script>

<template>
  <div role="tablist" class="flex gap-6 border-b border-grey-10">
    <button
      v-for="(tab, index) in tabs"
      :key="index"
      type="button"
      role="tab"
      :aria-selected="modelValue === index"
      data-test="tab-bar-item"
      class="relative pb-3 text-s-16 transition-colors"
      :class="
        modelValue === index
          ? 'font-semibold text-black'
          : 'font-normal text-[#575757] hover:text-black'
      "
      @click="$emit('update:modelValue', index)"
    >
      {{ tab }}
      <span
        v-if="modelValue === index"
        class="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-black"
      />
    </button>
  </div>
</template>
