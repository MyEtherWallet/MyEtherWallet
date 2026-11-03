<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppSpinner from '@/components/spinner/AppSpinner.vue'
import configs from '@/configs'
import {
  TOAST_ROLE,
  TOAST_STATUS_AVATAR,
  TOAST_TYPES_WITH_BUTTON,
  type ToastAsset,
  type ToastType,
} from './types'

/**
 * Toast (design library, Figma 2680:45751). A dark, dismissible status message:
 * a leading Spinner / Avatar per `type`, title and description through the
 * Content Group (inverse tone), an optional CTA and a default slot below it.
 * Presentational only: the host owns stacking, timing and removal, and can
 * pause its timer through the native hover / focus events on the root.
 *
 * @example <AppToast type="success" :title="t('trade.done')" @dismiss="remove" />
 */
const props = withDefaults(
  defineProps<{
    type: ToastType
    title: string
    description?: string
    /** `transaction-completed` only: the received asset. */
    asset?: ToastAsset
    /** CTA label; Figma shows it on completed, warning, success and error. */
    buttonLabel?: string
  }>(),
  { description: undefined, asset: undefined, buttonLabel: undefined },
)

const emit = defineEmits<{ dismiss: []; action: [] }>()

const { t } = useI18n()

const statusAvatar = computed(() =>
  props.type === 'processing' || props.type === 'transaction-completed'
    ? null
    : TOAST_STATUS_AVATAR[props.type],
)

const showButton = computed(
  () => !!props.buttonLabel && TOAST_TYPES_WITH_BUTTON.includes(props.type),
)

const role = computed(() => TOAST_ROLE[props.type])

watchEffect(() => {
  if (
    configs.BUILD_MODE !== 'production' &&
    props.buttonLabel &&
    !showButton.value
  ) {
    console.warn(
      `[AppToast] type "${props.type}" has no button in Figma; buttonLabel is ignored.`,
    )
  }
})
</script>

<template>
  <div
    data-testid="toast"
    :role="role"
    :aria-live="role === 'alert' ? 'assertive' : 'polite'"
    class="flex w-90 max-w-full items-start gap-3 rounded-16 bg-background-info p-3"
  >
    <AppSpinner
      v-if="type === 'processing'"
      :size="24"
      color="inverted"
      class="shrink-0"
    />
    <AppAvatar
      v-else-if="type === 'transaction-completed'"
      :type="asset?.isStock ? 'stocks' : 'cryptoAsset'"
      size="s"
      :url="asset?.url"
      :symbol="asset?.symbol"
      class="shrink-0"
    />
    <AppAvatar
      v-else-if="statusAvatar"
      type="icon"
      size="s"
      :tone="statusAvatar.tone"
      class="shrink-0"
    >
      <template #icon>
        <AppIcon :name="statusAvatar.icon" />
      </template>
    </AppAvatar>

    <div class="flex min-w-0 flex-1 flex-col gap-3">
      <AppContentGroup
        :title="title"
        :description="description"
        size="m"
        tone="inverse"
      >
        <template
          v-if="type === 'transaction-completed'"
          #title-icon="{ size }"
        >
          <AppIcon
            name="check-circle"
            variant="filled"
            :size="size"
            class="text-icon-success"
          />
        </template>
      </AppContentGroup>

      <AppBaseButton
        v-if="showButton"
        size="small"
        class="self-start"
        @click="emit('action')"
      >
        {{ buttonLabel }}
      </AppBaseButton>

      <div v-if="$slots.default" class="w-full">
        <slot />
      </div>
    </div>

    <AppBtnIcon
      icon="x-mark"
      size="s"
      variant="naked-contrast"
      :label="t('common.close')"
      class="shrink-0"
      @click="emit('dismiss')"
    />
  </div>
</template>
