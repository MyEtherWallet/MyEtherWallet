<template>
  <div
    ref="tooltipActivatorRef"
    class="tooltip"
    v-element-hover="[onHover, { delayLeave: 500 }]"
  >
    <slot>
      <information-circle-icon class="h-6 w-6 p-1 cursor-pointer text-info" />
    </slot>
    <teleport to="#app">
      <transition name="fade" mode="out-in">
        <div
          ref="tooltipRef"
          role="tooltip"
          v-show="show"
          class="fixed bg-white rounded-16 p-3 text-s-12 shadow-button w-max max-w-[200px] z-10"
          :class="{
            'right-top': isTopRight,
            'left-top': isTopLeft,
            'right-bottom': isBottomRight,
            'left-bottom': isBottomLeft,
            hidden: !visible,
          }"
        >
          {{ text }}
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { vElementHover } from '@vueuse/components'
import { InformationCircleIcon } from '@heroicons/vue/24/solid'
const show = ref(false)
const visible = ref(false)

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  isTopRight: {
    type: Boolean,
    default: true,
  },
  isTopLeft: {
    type: Boolean,
    default: false,
  },
  isBottomRight: {
    type: Boolean,
    default: false,
  },
  isBottomLeft: {
    type: Boolean,
    default: false,
  },
})

const tooltipRef = ref<HTMLElement | null>(null)
const tooltipActivatorRef = ref<HTMLElement | null>(null)
const onHover = (hovered: boolean) => {
  if (hovered) {
    show.value = true
    onHoverActive()
  } else {
    show.value = false
  }
}
const onHoverActive = () => {
  if (tooltipRef.value && tooltipActivatorRef.value) {
    const activator = tooltipActivatorRef.value
    const topPosition = activator.getBoundingClientRect().top + 2
    const bottom = activator.getBoundingClientRect().bottom - 1
    if (props.isTopRight) {
      const rightTopPosition =
        activator.getBoundingClientRect().width +
        activator.getBoundingClientRect().x -
        10
      tooltipRef.value.style.top = `${topPosition}px`
      tooltipRef.value.style.left = `${rightTopPosition}px`
      tooltipRef.value.style.transform = 'translateX(0) translateY(-100%)'
    } else if (props.isBottomRight) {
      const rightBottomPosition =
        activator.getBoundingClientRect().width +
        activator.getBoundingClientRect().x -
        4
      tooltipRef.value.style.top = `${bottom}px`
      tooltipRef.value.style.left = `${rightBottomPosition}px`
    } else if (props.isTopLeft) {
      const left =
        activator.getBoundingClientRect().x -
        activator.getBoundingClientRect().width +
        10
      tooltipRef.value.style.left = `${left}px`
      tooltipRef.value.style.top = `${topPosition}px`
      tooltipRef.value.style.transform = 'translateX(0) translateY(-100%)'
    } else if (props.isBottomLeft) {
      const left =
        activator.getBoundingClientRect().x -
        activator.getBoundingClientRect().width +
        10
      tooltipRef.value.style.left = `${left}px`
      tooltipRef.value.style.top = `${bottom}px`
    } else {
      const tooltipMiddle = tooltipRef.value.getBoundingClientRect().width / 2
      const middle =
        activator.getBoundingClientRect().left +
        activator.getBoundingClientRect().width / 2 -
        tooltipMiddle
      tooltipRef.value.style.top = `${bottom}px`
      tooltipRef.value.style.left = `${middle}px`
    }
  }
  visible.value = true
}
</script>
