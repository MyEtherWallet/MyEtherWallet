<!-- Expand Transition.vue -->
<template>
  <Transition
    name="expand-transition"
    @enter="onEnter"
    @after-enter="resetStyles"
    @leave="onLeave"
    @after-leave="resetStyles"
  >
    <!-- pass down slot content -->
    <slot />
  </Transition>
</template>
<script setup lang="ts">
/**
 * Expand/Collapse transition
 *
 * NOTES:
 * - ensure that if you are putting a flex box inside the transition, you need to ensure it has a height or min hieght
 * - if you need to provide padding use another div inside the transition. see example bellow
 * - its missing group transition
 *
 * Usage:
 * <expand-transition name="expand-transition">
 *  <div>
 *    <div class='py-7'>Content</div>
 *  </div>
 * </expand-transition>
 */
import { ref } from 'vue'

const height = ref<string | null>(null)
const overflow = ref('')
const onEnter = (_element: Element) => {
  const element = _element as HTMLElement
  const offset = `${element.offsetHeight}px`
  // Set the height to the scroll height to allow for expanding
  height.value = getComputedStyle(element).height
  overflow.value = getComputedStyle(element).overflow

  // Hide overflow to account for collapsed margins in the calculated height
  element.style.transition = 'height 0.3s ease'
  element.style.overflow = 'hidden'
  element.style.height = '0'

  void element.offsetHeight // force reflow
  // Set the height to the scroll height to allow for expanding
  if (height.value) {
    requestAnimationFrame(() => {
      element.style.height = offset
    })
  }
}

const onLeave = (_element: Element) => {
  const element = _element as HTMLElement
  //Save current values
  height.value = getComputedStyle(element).height
  overflow.value = getComputedStyle(element).overflow
  //set new values
  element.style.overflow = 'hidden'
  element.style.transition = 'height 0.3s ease'
  const offset = `${element.offsetHeight}px`
  element.style.height = offset
  void element.offsetHeight // force reflow

  requestAnimationFrame(() => {
    element.style.height = '0px'
  })
}
const resetStyles = (_element: Element) => {
  if (!height.value) return
  const element = _element as HTMLElement
  element.style.overflow = overflow.value
  if (height.value != null) element.style.height = height.value
  height.value = null
  overflow.value = ''
}
</script>
