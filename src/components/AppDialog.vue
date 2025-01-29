<template>
  <!-- TODO: consider using Teleport to Body to ensure background does not scroll-->
  <div>
    <!-- The backdrop, rendered as an absolute sibling to the panel container -->
    <transition
      enter-active-class="transform ease-out duration-500 transition opacity-0 delay-100"
      enter-to-class="opacity-100"
      leave-active-class="opacity-0"
      leave-to-class="opacity-0"
      appear
    >
      <div
        v-if="isOpen"
        class="cursor-pointer fixed inset-0 bg-black/40 z-[99] h-screen w-screen overscroll-none overflow-hidden"
        @click="setIsOpen(false)"
        aria-hidden
      />
    </transition>
    <!-- Dialog Container -->
    <div
      v-if="isOpen"
      class="cursor-pointer fixed inset-0 h-full flex items-center justify-center p-9 z-[100] overscroll-none !overflow-y-scroll"
      @click="setIsOpen(false)"
    >
      <transition
        enter-active-class="transform ease-out duration-500 transition opacity-0 delay-100"
        enter-to-class="opacity-100"
        leave-active-class="opacity-0"
        leave-to-class="opacity-0"
        appear
      >
        <div
          v-if="isOpen"
          class="cursor-default fixed max-h-[95%] w-[95%] bg-white rounded-4xl sm:min-h-[512px] !overflow-y-scroll overflow-hidden"
          @click.stop
          :class="$attrs.class"
        >
          <div
            class="pb-8 px-6 sm:px-8 basis-full order-2 sm:order-1 flex justify-between bg-white sticky top-0 pb-5"
          >
            <slot name="title">
              <h1 v-if="title" class="title4 pr-2 pt-4 sm:pt-8">
                {{ title }}
              </h1>
            </slot>
            <app-btn-icon-close
              @click="setIsOpen(false)"
              class="pt-4 sm:pt-8"
            />
          </div>
          <div class="pt-2 pb-8 px-6 sm:px-8">
            <slot name="content" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import AppBtnIconClose from './AppBtnIconClose.vue'

defineProps({
  /**
   * @title The title of the dialog, not required
   * @type string | undefined
   */
  title: {
    default: '',
    type: String,
  },
})

const isOpen = defineModel('isOpen', {
  type: Boolean,
  required: true,
})

const setIsOpen = (_value: boolean = false) => {
  isOpen.value = _value
}
</script>
