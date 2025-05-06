<template>
  <div
    class="flex justify-start bg-surface rounded-2xl md:rounded-32 p-2 gap-1 max-w-fit"
  >
    <div v-if="isLoaded">
      <div class="flex flex-row gap-1 flex-wrap">
        <button
          v-for="(btn, index) in btnList"
          :key="index"
          :class="[
            {
              'bg-white shadow-button-group hover:bg-white':
                selected && selected === btn,
            },
            'min-h-12 text-s-17 p-2 rounded-full bg-transparent font-medium hoverNoBG min-w-[110px]',
          ]"
          @click="setSelected(btn)"
        >
          <slot name="btn-content" :data="btn">
            {{ index }}
          </slot>
        </button>
        <slot name="custom" />
      </div>
    </div>
    <!-- Loading -->
    <div v-else class="flex flex-row gap-1">
      <div
        v-for="n in totalPlaceholders"
        :key="n"
        class="animate-pulse bg-white rounded-full p-2 gap-1 flex items-center min-w-[110px] min-h-12"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
/**
 * AppBtnGroup component
 *
 * @example
 * <app-btn-group
 *   v-model:selected="selectedOption"
 *   :btn-list="options"
 *   :is-loaded="isLoaded"
 *   :total-placeholders="4"
 * >
 *   <template #btn-content="{ data }">
 *     {{ data.label }}
 *   </template>
 * </app-btn-group>
 */
import { type PropType } from 'vue'

const props = defineProps({
  btnList: {
    type: Array as PropType<T[]>,
    default: () => [],
  },
  isLoaded: {
    type: Boolean,
    default: true,
  },
  totalPlaceholders: {
    type: Number,
    default: 4,
  },
  useEmitOnly: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits<{
  (e: 'onUpdate:selected', btn: T): void
}>()

const selected = defineModel<T | undefined | null>('selected')

const setSelected = (btn: T) => {
  if (!props.useEmitOnly) {
    selected.value = btn
  }

  emit('onUpdate:selected', btn)
}
</script>
