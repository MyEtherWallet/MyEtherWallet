<template>
  <app-btn-icon
    @click="copyClick"
    :size="size"
    :label="label ?? $t('common.copy')"
  >
    <AppIcon name="clipboard-document" :size="iconSize" />
  </app-btn-icon>
</template>
<script setup lang="ts">
import { type PropType } from 'vue'
import AppBtnIcon from './AppBtnIcon.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import type { IconSize } from '@/components/icon/icons'
import type { BtnIconSize } from './btnIconTypes'
import { useToastStore } from '@/stores/toastStore'
import { useI18n } from 'vue-i18n'
import { ToastType } from '@/types/notification'
import * as Sentry from '@sentry/vue'

const { t } = useI18n()
const toastStore = useToastStore()
/**
 * @description A button that copies the copyValue to the clipboard.
 * @emits copy - When the copy button is clicked.
 *
 * @example Copy button with default icon and default label
 * <app-btn-copy copyValue="0x1234"  />
 *
 * @example Small copy button with a custom label
 * <app-btn-copy size="s" icon-size="xxs" copyValue="0x1234" label="Copy Important value: 1234" />
 */
const props = defineProps({
  /**
   * @label The aria-label for the copy button.
   */
  label: {
    type: String,
  },
  /**
   * @copyValue The value to copy to the clipboard.
   */
  copyValue: {
    type: String,
    default: '',
  },
  size: {
    type: String as PropType<BtnIconSize>,
    default: 'm',
  },
  iconSize: {
    type: String as PropType<IconSize>,
    default: 's',
  },
})
const emit = defineEmits<{
  copy: [payload: MouseEvent]
}>()

/**
 * Copies the copyValue to the clipboard and emits copy event.
 * @param payload The mouse event payload.
 */
const copyClick = async (payload: MouseEvent) => {
  try {
    await navigator.clipboard.writeText(props.copyValue)
    toastStore.addToastMessage({
      text: `${t('common.copied_to_clipboard')}`,
      hash: props.copyValue,
    })
    emit('copy', payload)
  } catch (err) {
    toastStore.addToastMessage({
      text: t('common.copy_failed'),
      type: ToastType.Error,
    })
    Sentry.captureException(err)
  }
}
</script>
