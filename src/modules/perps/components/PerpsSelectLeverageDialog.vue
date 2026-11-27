<template>
  <app-modal v-model="isOpen" :title="title" :buttons="buttons">
    <template #header>
      <!-- pr-12 keeps the title clear of the 40px close button. -->
      <div class="flex min-w-0 flex-1 items-center gap-3 pr-12">
        <app-avatar
          type="perpsAsset"
          size="m"
          :url="getLogoUrl(symbol)"
          :symbol="symbol"
        />
        <app-content-group :title="title" size="l" wrap-title class="flex-1" />
      </div>
    </template>
    <div class="flex flex-col gap-6 px-4 sm:px-6">
      <!-- Leverage Card -->
      <app-card surface="alternative">
        <div class="flex flex-col gap-4 p-4">
          <!-- +/- Controls -->
          <div class="flex items-center justify-center gap-6">
            <app-btn-icon
              :label="$t('perps.select-leverage.decrease-leverage')"
              :disabled="modelValue <= 1"
              data-test="leverage-decrease"
              @click="$emit('update:modelValue', Math.max(1, modelValue - 1))"
            >
              <app-icon name="minus" size="s" variant="filled" />
            </app-btn-icon>
            <div class="relative flex min-w-[50px] items-center justify-center">
              <input
                :value="modelValue"
                type="number"
                min="1"
                :max="maxLeverage"
                step="1"
                :aria-label="$t('perps.confirm.leverage')"
                class="w-[50px] appearance-none bg-transparent text-center text-heading-3xl text-text-default outline-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                @change="
                  e => {
                    const val = Math.round(
                      Math.min(
                        maxLeverage,
                        Math.max(
                          1,
                          Number((e.target as HTMLInputElement).value) || 1,
                        ),
                      ),
                    )
                    ;(e.target as HTMLInputElement).value = String(val)
                    $emit('update:modelValue', val)
                  }
                "
              />
              <span class="text-heading-3xl text-text-default">&times;</span>
            </div>
            <app-btn-icon
              :label="$t('perps.select-leverage.increase-leverage')"
              :disabled="modelValue >= maxLeverage"
              data-test="leverage-increase"
              @click="
                $emit(
                  'update:modelValue',
                  Math.min(maxLeverage, modelValue + 1),
                )
              "
            >
              <app-icon name="plus" size="s" variant="filled" />
            </app-btn-icon>
          </div>

          <!-- Slider -->
          <app-slider
            :model-value="modelValue"
            :min="1"
            :max="maxLeverage"
            :step="1"
            :label="$t('perps.confirm.leverage')"
            @update:model-value="$emit('update:modelValue', $event)"
          />

          <!-- Tick presets: design-library Chips on the grey card (white
               `default` fill), as under the trade form's slider. -->
          <div class="flex gap-2">
            <app-chip
              v-for="tick in tickValues"
              :key="tick"
              :label="`${tick}×`"
              class="min-w-0 flex-1"
              @click="$emit('update:modelValue', tick)"
            />
          </div>
        </div>
      </app-card>

      <!-- Description -->
      <p v-if="mode === 'create'" class="text-text-sm text-text-subtle">
        {{ $t('perps.select-leverage.leverage-description') }}
        <a href="#" class="text-label-sm text-text-brand hover:underline">{{
          $t('perps.select-leverage.learn-more')
        }}</a>
      </p>
      <app-banner
        v-if="mode === 'add'"
        type="warning"
        :title="$t('perps.select-leverage.leverage-will-change-title')"
        :description="
          $t('perps.select-leverage.leverage-will-change-text', { symbol })
        "
      />

      <!-- Leverage Error -->
      <app-banner
        v-if="leverageError"
        type="alert"
        :description="leverageError"
      />
    </div>
  </app-modal>
</template>

<script setup lang="ts">
import AppModal from '@/components/modal/AppModal.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppCard from '@/components/card/AppCard.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppSlider from '@/components/slider/AppSlider.vue'
import AppChip from '@/components/chip/AppChip.vue'
import AppBanner from '@/components/banner/AppBanner.vue'
import type { ModalButtons } from '@/components/modal/types'
import { getLogoUrl } from '../utils/market'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Props {
  symbol: string
  modelValue: number
  leverageError: string
  isSaving: boolean
  mode: 'add' | 'create' | 'submit'
  maxLeverage?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxLeverage: 20,
})

const isOpen = defineModel('isOpen', {
  type: Boolean,
  required: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  save: []
}>()

const title = computed(() =>
  t('perps.select-leverage.title', { symbol: props.symbol }),
)

const buttonText = computed(() => {
  if (props.mode === 'submit') {
    return props.isSaving
      ? t('perps.select-leverage.submitting')
      : t('perps.select-leverage.submit')
  }
  return props.isSaving
    ? t('perps.select-leverage.saving')
    : t('perps.select-leverage.save')
})

const buttons = computed<ModalButtons>(() => ({
  primary: {
    label: buttonText.value,
    disabled: props.isSaving,
    onClick: () => emit('save'),
  },
}))

const tickValues = computed(() => {
  const max = Math.max(1, Math.floor(props.maxLeverage))
  if (max <= 1) return [1]
  const count = Math.min(5, max)
  const ticks = new Set<number>()
  for (let i = 0; i < count; i++) {
    const v = Math.round(1 + ((max - 1) * i) / (count - 1))
    ticks.add(v)
  }
  return Array.from(ticks).sort((a, b) => a - b)
})
</script>
