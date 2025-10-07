<template>
  <div
    :class="[
      { 'bg-surface rounded-2xl md:rounded-32 p-1': variant === 'default' },
      'flex justify-start  gap-1 max-w-fit',
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
            { 'min-h-10 min-w-[110px]': size === 'large' },
            { 'min-h-8 min-w-[95px] !text-s-15': size === 'medium' },
            { 'min-h-7 min-w-[80px] !text-s-14': size === 'small' },
            { 'min-h-6 min-w-[46px] !text-s-12': size === 'xs' },
            {
              'bg-white shadow-container hover:bg-white':
                variant === 'default' && areEqual(selected, btn),
            },
            {
              'border border-grey-outline ':
                variant === 'outline' && !areEqual(selected, btn),
            },
            {
              'border-2 border-primary !bg-primary text-white':
                variant === 'outline' && areEqual(selected, btn),
            },
            'text-s-17 px-2 leading-p-140  rounded-full bg-transparent font-medium hoverNoBG ',

            variant === 'outline' ? '' : '',
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
        class="animate-pulse bg-white rounded-full p-2 gap-1 flex items-center min-w-[110px]"
        :class="[
          { 'min-h-10': size === 'large' },
          { 'min-h-8': size === 'medium' },
          { 'min-h-7 ': size === 'small' },
          { 'min-h-6 min-w-[46px]': size === 'xs' },
        ]"
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
   * @size - The size of the buttons. Can be 'small', 'medium', or 'large'. Default is 'medium'.
   */
  size: {
    type: String as PropType<'xs' | 'small' | 'medium' | 'large'>,
    default: 'medium',
  },
  /**
   * @variant - The variant of the buttons. Can be 'default' or 'outline'. Default is 'default'.
   */
  variant: {
    type: String as PropType<'default' | 'outline'>,
    default: 'default',
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
