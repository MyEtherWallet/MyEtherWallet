<template>
  <div
    ref="tooltipActivatorRef"
    class="tooltip"
    v-element-hover="[onHover, { delayLeave: 300 }]"
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
          class="fixed bg-white rounded-16 p-3 text-s-12 shadow-button shadow-button-elevated w-max max-w-[300px] z-[2101]"
          :class="{
            'right-top': position === 'top-right',
            'left-top': position === 'top-left',
            'right-bottom': position === 'bottom-right',
            'left-bottom': position === 'bottom-left',
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
  position: {
    type: String as () =>
      | 'top-right'
      | 'top-left'
      | 'bottom-right'
      | 'bottom-left'
      | 'middle',
    default: 'top-right',
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
    const topPosition = activator.getBoundingClientRect().top - 4
    const bottom = activator.getBoundingClientRect().bottom + 4
    const center =
      activator.getBoundingClientRect().x +
      activator.getBoundingClientRect().width / 2
    tooltipRef.value.style.left = `${center}px`
    if (props.position.includes('top') || props.position === 'middle') {
      tooltipRef.value.style.top = `${topPosition}px`
    }
    if (props.position.includes('bottom')) {
      tooltipRef.value.style.top = `${bottom}px`
    }

    if (props.position === 'top-right') {
      tooltipRef.value.style.transform = 'translateY(-100%)'
    } else if (props.position === 'top-left') {
      tooltipRef.value.style.transform = 'translateX(-100%) translateY(-100%)'
    } else if (props.position === 'bottom-left') {
      tooltipRef.value.style.transform = 'translateX(-100%)'
    } else if (props.position === 'middle') {
      tooltipRef.value.style.transform = 'translateX(-50%) translateY(-100%)'
    }
  }
  visible.value = true
}
</script>
