<template>
  <label class="inline-flex !cursor-pointer hoverOpacityHasBG">
    <span v-if="!isRight" class="text8 pr-2">{{ label }}</span>
    <button
      :class="[
        model ? 'bg-primary' : 'bg-info',
        ' w-11 h-6  rounded-full px-1 ',
      ]"
      @click="model = !model"
    >
      <div
        aria-hidden="true"
        :class="[
          { 'translate-x-[125%]': model },
          'h-4 w-4 rounded-full bg-white transition-transform',
        ]"
      ></div>
    </button>
    <span v-if="isRight" class="text8 pl-2">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
/**
 * Toggle Button Component
 *
 * @example
 * <app-toggle v-model="model" label="Label" />
 *
 * @example label on the right
 * <app-toggle v-model="model" label="Label" is-right />
 */
defineProps({
  /** @label Label of the toggle button */
  label: {
    type: String,
    required: true,
  },
  /** @isRight position of the label is set to be on the right */
  isRight: {
    type: Boolean,
    default: false,
  },
})
const model = defineModel<boolean>({ required: true })
</script>
