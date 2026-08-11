<template>
  <app-dialog v-model:is-open="isOpen" class="w-full max-w-[440px]">
    <template #title>
      <div class="flex items-center gap-2.5 mr-8 pt-5 pl-6">
        <app-token-logo
          :url="getLogoUrl(symbol)"
          :symbol="symbol"
          width="w-8"
          height="h-8"
        />
        <span class="font-bold text-s-20">{{
          $t('perps.select-leverage.title', { symbol })
        }}</span>
      </div>
    </template>
    <template #content>
      <div class="px-6 pb-6 pt-4 flex flex-col gap-5">
        <!-- Leverage Card -->
        <div class="bg-brand-subtle rounded-[20px] p-5">
          <!-- +/- Controls -->
          <div class="flex items-center justify-center gap-6 mb-5">
            <button
              class="w-10 h-10 rounded-full bg-surface hoverBGWhite flex items-center justify-center hover:bg-greyLight transition-colors text-s-20"
              :disabled="modelValue <= 1"
              :class="
                modelValue <= 1
                  ? '!bg-white/90'
                  : 'shadow-button shadow-button-elevated'
              "
              @click="$emit('update:modelValue', Math.max(1, modelValue - 1))"
            >
              <MinusIcon
                class="w-5 h-5"
                :class="{ '!opacity-30': modelValue <= 1 }"
              />
            </button>
            <div class="relative min-w-[50px] flex items-center justify-center">
              <input
                :value="modelValue"
                type="number"
                min="1"
                :max="maxLeverage"
                step="1"
                class="font-bold text-[40px] tracking-tight w-[50px] text-center bg-transparent outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
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
              <span class="font-bold text-[40px] tracking-tight">&times;</span>
            </div>
            <button
              class="w-10 h-10 rounded-full bg-surface hoverBGWhite flex items-center justify-center hover:bg-greyLight transition-colors text-s-20"
              :disabled="modelValue >= maxLeverage"
              :class="
                modelValue >= maxLeverage
                  ? '!bg-white/90'
                  : 'shadow-button shadow-button-elevated'
              "
              @click="
                $emit('update:modelValue', Math.min(maxLeverage, modelValue + 1))
              "
            >
              <PlusIcon class="w-5 h-5" />
            </button>
          </div>

          <!-- Tick Labels -->
          <div class="flex justify-between px-1">
            <button
              v-for="tick in tickValues"
              :key="tick"
              class="text-[11px] font-medium hoverNoBG rounded-full px-2 py-0.5"
              :class="modelValue > tick ? 'text-fg-subtle' : ''"
              @click="$emit('update:modelValue', tick)"
            >
              {{ tick }}&times;
            </button>
          </div>

          <!-- Slider -->
          <div class="relative px-1">
            <input
              :value="modelValue"
              type="range"
              min="1"
              :max="maxLeverage"
              step="1"
              class="w-full h-2 rounded-full appearance-none cursor-pointer leverage-slider"
              :style="{
                background: `linear-gradient(to right, #0052ff 0%, #0052ff ${sliderFillPct}%, #e5e7eb ${sliderFillPct}%, #e5e7eb 100%)`,
              }"
              @input="
                $emit(
                  'update:modelValue',
                  Number(($event.target as HTMLInputElement).value),
                )
              "
            />
          </div>
        </div>

        <!-- Description -->
        <p class="text-s-14 text-fg-subtle leading-relaxed" v-if="mode === 'create'">
          {{ $t('perps.select-leverage.leverage-description') }}
          <a href="#" class="text-[#0052ff] font-medium hover:underline">{{
            $t('perps.select-leverage.learn-more')
          }}</a>
        </p>
        <app-warning
          v-if="mode === 'add'"
          :title="$t('perps.select-leverage.leverage-will-change-title')"
          :text="
            $t('perps.select-leverage.leverage-will-change-text', { symbol })
          "
        />

        <!-- Leverage Error -->
        <div
          v-if="leverageError"
          class="bg-[#fff0f0] border border-[#ffcccc] rounded-[16px] p-4"
        >
          <p class="text-error text-s-14 font-medium">{{ leverageError }}</p>
        </div>

        <!-- Save Button -->
        <button
          class="w-full bg-[#0052ff] text-fg-on-fill rounded-full py-3.5 text-s-16 font-bold hoverOpacity transition-all active:scale-[0.98]"
          :disabled="isSaving"
          @click="$emit('save')"
        >
          {{ buttonText }}
        </button>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import AppDialog from '@/components/AppDialog.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import { getLogoUrl } from '../utils/market'
import { PlusIcon, MinusIcon } from '@heroicons/vue/24/solid'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppWarning from '@/components/AppWarning.vue'

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

defineEmits<{
  'update:modelValue': [value: number]
  save: []
}>()

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

const sliderFillPct = computed(() => {
  const max = Math.max(2, props.maxLeverage)
  return ((props.modelValue - 1) / (max - 1)) * 100
})
</script>

<style scoped>
.leverage-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #0052ff;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.leverage-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #0052ff;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>
