<template>
  <div
    data-testid="scroll-fade"
    :class="[
      'pointer-events-none absolute z-1',
      SCROLL_FADE_SIDE_CLASS[side].position,
    ]"
  >
    <div
      aria-hidden="true"
      :class="[
        'size-full',
        SCROLL_FADE_SIDE_CLASS[side].gradient,
        SCROLL_FADE_VARIANT_CLASS[variant],
      ]"
    />
    <AppBtnIcon
      v-if="showButton"
      :icon="SCROLL_FADE_SIDE_CLASS[side].icon"
      :label="label"
      :class="[
        'pointer-events-auto absolute bg-background-alternative text-icon-default shadow-button',
        SCROLL_FADE_SIDE_CLASS[side].button,
      ]"
      @click="emit('click')"
    />
  </div>
</template>

<script setup lang="ts">
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import {
  SCROLL_FADE_SIDE_CLASS,
  SCROLL_FADE_VARIANT_CLASS,
  type ScrollFadeSide,
  type ScrollFadeVariant,
} from './types'

/**
 * ScrollFade (design library, Figma 1080:702). Gradient over one edge of a
 * scroll container, with an optional round chevron button. The parent must be
 * `relative`, and should render it only while it can scroll toward `side`
 * (see useScrollEdges). Clicks pass through the gradient to the content.
 *
 * The button is Button Icon M on a white fill with the "buttons and cards"
 * shadow. It uses the naked style so hover/pressed are the white-surface ones.
 *
 * @example <AppScrollFade v-if="canScrollEnd" side="right" :label="t('common.next_page')" @click="scrollNext" />
 */
withDefaults(
  defineProps<{
    side: ScrollFadeSide
    variant?: ScrollFadeVariant
    showButton?: boolean
    /** Accessible name of the button. */
    label: string
  }>(),
  { variant: 'base', showButton: true },
)

const emit = defineEmits<{ click: [] }>()
</script>
