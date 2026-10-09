<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppIcon from '@/components/icon/AppIcon.vue'

// Shared onboarding header (MEW-2130): one horizontal row with back (steps 2–3),
// centered "Step X / 3" progress, and close — back/close are grey filled icon
// buttons. Title/description sit below (both optional; the loading sub-state of
// step 3 shows the row alone). Same structure across every step.
const TOTAL_STEPS = 3

defineProps<{
  step: number
  title?: string
  description?: string
  showBack?: boolean
}>()

defineEmits<{ back: []; close: [] }>()

const { t } = useI18n()
</script>

<template>
  <div>
    <!-- Aligned row: back left, "Step X / 3" centered, close right. The empty
         spacer keeps the progress centered on step 1 (no back). -->
    <div class="flex items-center justify-between">
      <AppBtnIcon
        v-if="showBack"
        variant="filled"
        :label="t('common.back')"
        data-test="step-back"
        @click="$emit('back')"
      >
        <AppIcon name="chevron-left" variant="filled" />
      </AppBtnIcon>
      <span v-else class="size-8 shrink-0" aria-hidden="true" />

      <p class="text-s-16 font-normal text-text-subtle">
        {{
          t('homePage.hero.watchlist.onboarding.stepProgress', {
            step,
            total: TOTAL_STEPS,
          })
        }}
      </p>

      <AppBtnIcon
        variant="filled"
        :label="t('common.close')"
        data-test="step-close"
        @click="$emit('close')"
      >
        <AppIcon name="x-mark" variant="filled" />
      </AppBtnIcon>
    </div>

    <div v-if="title || description" class="mt-4">
      <h2 v-if="title" class="text-s-20 font-bold text-black">{{ title }}</h2>
      <p v-if="description" class="mt-1 text-s-16 font-normal text-text-subtle">
        {{ description }}
      </p>
    </div>
  </div>
</template>
