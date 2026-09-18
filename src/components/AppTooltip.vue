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
          class="fixed p-3 text-s-12 font-semibold leading-[18px] tracking-[-0.24px] text-center shadow-button shadow-button-elevated w-max z-[2101]"
          :class="[
            theme === 'dark'
              ? 'bg-bgInfo text-white rounded-8 max-w-[240px]'
              : 'bg-white rounded-16 max-w-[300px]',
            {
              'right-top': position === 'top-right',
              'left-top': position === 'top-left',
              'right-bottom': position === 'bottom-right',
              'left-bottom': position === 'bottom-left',
              hidden: !visible,
            },
          ]"
        >
          {{ text }}
          <span
            v-if="hasArrow"
            :class="[
              position === 'top'
                ? [
                    'top-full left-1/2 -translate-x-1/2 border-t-[10px] border-x-[6px] border-x-transparent',
                    theme === 'dark' ? 'border-t-bgInfo' : 'border-t-white',
                  ]
                : [
                    'top-1/2 -translate-y-1/2 border-y-[6px] border-y-transparent',
                    position === 'left'
                      ? 'left-full border-l-[10px]'
                      : 'right-full border-r-[10px]',
                    position === 'left'
                      ? theme === 'dark'
                        ? 'border-l-bgInfo'
                        : 'border-l-white'
                      : theme === 'dark'
                        ? 'border-r-bgInfo'
                        : 'border-r-white',
                  ],
              'absolute h-0 w-0',
            ]"
          />
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { vElementHover } from '@vueuse/components'
import { InformationCircleIcon } from '@heroicons/vue/24/outline'
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
      | 'middle'
      | 'top'
      | 'left'
      | 'right',
    default: 'top-right',
  },
  theme: {
    type: String as () => 'light' | 'dark',
    default: 'light',
  },
})

const ARROW_SIZE = 10
const ARROW_GAP = 4

const isSidePosition = computed(
  () => props.position === 'left' || props.position === 'right',
)

const hasArrow = computed(
  () => isSidePosition.value || props.position === 'top',
)

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
    const rect0 = activator.getBoundingClientRect()

    if (props.position === 'top') {
      tooltipRef.value.style.top = `${rect0.top - ARROW_SIZE - ARROW_GAP}px`
      tooltipRef.value.style.left = `${center}px`
      tooltipRef.value.style.transform = 'translateX(-50%) translateY(-100%)'
      visible.value = true
      return
    }

    if (isSidePosition.value) {
      const rect = activator.getBoundingClientRect()
      tooltipRef.value.style.top = `${rect.top + rect.height / 2}px`
      tooltipRef.value.style.left =
        props.position === 'left'
          ? `${rect.left - ARROW_SIZE - ARROW_GAP}px`
          : `${rect.right + ARROW_SIZE + ARROW_GAP}px`
      tooltipRef.value.style.transform =
        props.position === 'left'
          ? 'translateX(-100%) translateY(-50%)'
          : 'translateY(-50%)'
      visible.value = true
      return
    }

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
