<template>
  <div
    :class="[
      isTall ? 'p-2' : 'p-1',
      'flex justify-start bg-surface rounded-2xl md:rounded-32 gap-1 max-w-fit',
    ]"
  >
    <div v-if="isLoaded">
      <div class="flex flex-row gap-1 flex-wrap">
        <button
          v-for="(btn, index) in btnList"
          :key="index"
          role="tab"
          :aria-selected="areEqual(selected, btn)"
          :class="[
            {
              'bg-white shadow-container hover:bg-white': areEqual(
                selected,
                btn,
              ),
            },
            'text-s-17 px-2 leading-p-140 min-h-10 rounded-full bg-transparent font-medium hoverNoBG min-w-[110px]',
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
  /**
   * @btnList - An array of tab objects.
   */
  btnList: {
    type: Array as PropType<T[]>,
    default: () => [],
  },
  /**
   * @isLoaded - A boolean to indicate if buttons need to be in the loading state.
   */
  isLoaded: {
    type: Boolean,
    default: true,
  },
  /**
   * @totalPlaceholders - Total number of placeholders to show while state isLoaded = false. Default is 4.
   */
  totalPlaceholders: {
    type: Number,
    default: 4,
  },
  /**
   * @useEmitOnly - A boolean to indicate if the selected value should be set only through emit. Default is false. Used in AppSelectChain.
   */
  useEmitOnly: {
    type: Boolean,
    default: false,
  },
  /**
   * @isTall - A boolean to indicate if the button group should be tall. Default is false. Adds extra padding.
   */
  isTall: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits<{
  (e: 'onUpdate:selected', btn: T): void
}>()

/**
 * @selected - The v-model for the selected button.
 * use <v-model:selected> to bind the selected button to a parent component.
 */
const selected = defineModel<T | undefined | null>('selected')

const setSelected = (btn: T) => {
  if (!props.useEmitOnly) {
    selected.value = btn
  }

  emit('onUpdate:selected', btn)
}

/**
 * @description Compares two objects and returns true if they are equal, false otherwise. Used in the button class to determine if the button is selected.
 * @param obj1 T | undefined | null
 * @param obj2 T
 * @returns boolean
 */
const areEqual = (obj1: T | undefined | null, obj2: T): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}
</script>
