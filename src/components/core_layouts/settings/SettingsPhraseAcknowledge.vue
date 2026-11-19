<template>
  <div class="flex flex-col gap-6">
    <!-- Header: back + centered title -->
    <div class="relative flex min-h-8 items-center justify-center">
      <app-btn-icon
        size="s"
        :label="$t('common.back')"
        class="absolute left-0"
        @click="emit('back')"
      >
        <AppIcon name="chevron-left" size="s" />
      </app-btn-icon>
      <h3 class="text-heading-base text-black">
        {{ $t('settings.phrase.before_title') }}
      </h3>
    </div>

    <app-banner
      type="warning"
      :description="$t('settings.phrase.warning')"
      :dismissible="false"
    />

    <ul class="flex flex-col gap-4">
      <li v-for="rule in RULES" :key="rule.key" class="flex items-center gap-3">
        <AppIconContainer :icon="rule.icon" tone="warning" />
        <span class="text-text-base text-text-default">
          {{ $t(`settings.phrase.${rule.key}`) }}
        </span>
      </li>
    </ul>

    <p class="text-text-sm text-text-subtle">
      {{ $t('settings.phrase.next_step') }}
    </p>

    <app-base-button class="w-full" @click="emit('view')">
      {{ $t('settings.phrase.view') }}
    </app-base-button>
  </div>
</template>

<script setup lang="ts">
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppBanner from '@/components/banner/AppBanner.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import type { IconName } from '@/components/icon/icons'
import AppIconContainer from '@/components/icon_container/AppIconContainer.vue'

/**
 * Settings › Recovery Phrase › "Before you continue": what the user is told
 * before they go to see the phrase. The phrase itself is shown by Privy on
 * the wallet export page, which the button opens.
 */
const emit = defineEmits<{
  back: []
  view: []
}>()

const RULES: ReadonlyArray<{ key: string; icon: IconName }> = [
  { key: 'rule_share', icon: 'eye' },
  { key: 'rule_ask', icon: 'lock-closed' },
  { key: 'rule_offline', icon: 'computer-desktop' },
]
</script>
