<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppBtnIcon from '@components/AppBtnIcon.vue'

/**
 * Cell watchlist toggle (design library, Figma `_watchlist toggle` 2290:39411).
 * A naked Button Icon S with the Heroicons star: stroke in `icon/default` when
 * off, filled in `icon/brand` when on. Built for AppCell's `#prefix` slot but
 * works in any row. Fully controlled: the row passes the watched state and
 * runs its watchlist action on `update:modelValue` (or binds `v-model`).
 * Clicks and Enter/Space keydowns stop here, so a clickable row underneath
 * never fires. `loading` disables it (Button Icon's 40% opacity).
 */
const props = defineProps<{ modelValue: boolean; loading?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [on: boolean] }>()

const { t } = useI18n()

const toggle = (e: MouseEvent) => {
  e.stopPropagation()
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <AppBtnIcon
    size="s"
    icon="star"
    :icon-variant="modelValue ? 'filled' : 'stroke'"
    :class="modelValue ? 'text-icon-brand' : 'text-icon-default'"
    :label="
      modelValue
        ? t('common.remove_from_watchlist')
        : t('common.add_to_watchlist')
    "
    :aria-pressed="modelValue"
    :disabled="loading"
    @click="toggle"
    @keydown.enter.space.stop
  />
</template>
