<template>
  <teleport to="#app">
    <div>
      <!-- The backdrop, rendered as an absolute sibling to the panel container -->
      <transition
        enter-active-class="transform ease-out duration-400 transition opacity-0 delay-100"
        enter-to-class="opacity-100"
        leave-active-class="opacity-0"
        leave-to-class="opacity-0"
        appear
      >
        <div
          v-if="isOpen"
          class="cursor-pointer fixed inset-0 bg-black/40 w-screen overscroll-none overflow-hidden min-w-[320px] min-h-lvh"
          :class="zIndexOverlay"
          @click="!persistent ? setIsOpen(false) : () => {}"
          aria-hidden
        />
      </transition>
      <!-- Dialog Container -->
      <div
        v-if="isOpen"
        :class="zIndexContainer"
        class="cursor-pointer fixed inset-0 h-full flex items-center justify-center p-9 overscroll-none !overflow-y-scroll"
        @click="!persistent ? setIsOpen(false) : () => {}"
      >
        <transition
          enter-active-class="transform ease-out duration-400 transition opacity-0 delay-100"
          enter-to-class="opacity-100"
          leave-active-class="opacity-0"
          leave-to-class="opacity-0"
          appear
        >
          <div
            v-if="isOpen"
            class="cursor-default fixed max-h-[95%] w-[95%] bg-white rounded-32 sm:min-h-[512px] !overflow-y-scroll overflow-hidden"
            @click.stop
            v-bind="$attrs"
          >
            <div
              class="z-10 pb-2 sm:pb-5 px-6 sm:px-8 basis-full order-2 sm:order-1 flex justify-between bg-white sticky top-0"
            >
              <slot name="title">
                <h1 v-if="title" class="title4 pr-2 pt-4 sm:pt-8 capitalize">
                  {{ title }}
                </h1>
              </slot>
              <app-btn-icon-close
                v-if="!persistent"
                @click="setIsOpen(false)"
                class="mt-4 sm:-mr-4 min-w-[32px]"
              />
            </div>
            <div :class="{ 'pt-2 px-6 sm:px-8': hasContentGutter }">
              <slot name="content" />
            </div>
          </div>
        </transition>
      </div>
    </div>
  </teleport>
</template>
<script setup lang="ts">
/**
 * @description AppDialog component, used to display a dialog with a title and content. Can also take incustom title and content slots.
 *
 * @example 1 Simple Dialog
 * <app-dialog v-model:is-open="openDialog" title="Dialog Title">
 *  <template #content>
 *   <div>Dialog Content</div>
 * </template>
 * </app-dialog>
 *
 * @example 2 Dialog with custom title and content slots
 * <app-dialog v-model:is-open="openDialog" >
 *  <template #title>
 *    <h1>Dialog Title</h1>
 *  </template>
 *  <template #content>
 *   <div>Dialog Content</div>
 * </template>
 * </app-dialog>
 *
 * @example 3 Dialog with custom width
 * <app-dialog v-model:is-open="openDialog" title="Dialog Title" class="sm:max-w-[800px] sm:mx-auto">
 *  <template #content>
 *   <div>Dialog Content</div>
 * </template>
 * </app-dialog>
 */
import AppBtnIconClose from './AppBtnIconClose.vue'
import { computed } from 'vue'
defineOptions({
  inheritAttrs: false,
})
const props = defineProps({
  /**
   * @title The title of the dialog, not required
   * @type string | undefined
   */
  title: {
    default: '',
    type: String,
  },
  /**
   * @hasContentGutter - boolean to remove the default padding from the content slot
   * @type boolean
   */
  hasContentGutter: {
    default: false,
    type: Boolean,
  },
  /**
   * @persistent - boolean to remove the close button and title from the dialog.
   * @type: boolean
   */
  persistent: {
    default: false,
    type: Boolean,
  },
  zIndex: {
    default: 100,
    type: Number,
  },
})

/**
 * @isOpen - v-model controls the state of the dialog.
 */
const isOpen = defineModel('isOpen', {
  type: Boolean,
  required: true,
})

/**
 * @setIsOpen - function to set the dialog state
 * @param _value - boolean value to set the dialog state
 */
const setIsOpen = (_value: boolean = false) => {
  isOpen.value = _value
}

const zIndexOverlay = computed(() => {
  return `z-${props.zIndex}`
})

const zIndexContainer = computed(() => {
  return `z-${props.zIndex + 1}`
})
</script>
