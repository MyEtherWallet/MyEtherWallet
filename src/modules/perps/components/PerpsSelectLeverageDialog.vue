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
        <span class="font-bold text-s-20">{{ symbol }} Leverage</span>
      </div>
    </template>
    <template #content>
      <div class="px-6 pb-6 pt-4 flex flex-col gap-5">
        <!-- Leverage Card -->
        <div class="bg-mewBg rounded-[20px] p-5">
          <!-- +/- Controls -->
          <div class="flex items-center justify-center gap-6 mb-5">
            <button
              class="w-10 h-10 rounded-full bg-white hoverBGWhite flex items-center justify-center hover:bg-greyLight transition-colors text-s-20"
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
                max="20"
                step="1"
                class="font-bold text-[40px] tracking-tight w-[50px] text-center bg-transparent outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                @change="
                  e => {
                    const val = Math.round(
                      Math.min(
                        20,
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
              class="w-10 h-10 rounded-full bg-white hoverBGWhite flex items-center justify-center hover:bg-greyLight transition-colors text-s-20"
              :disabled="modelValue >= 20"
              :class="
                modelValue >= 20
                  ? '!bg-white/90'
                  : 'shadow-button shadow-button-elevated'
              "
              @click="$emit('update:modelValue', Math.min(20, modelValue + 1))"
            >
              <PlusIcon class="w-5 h-5" />
            </button>
          </div>

          <!-- Tick Labels -->
          <div class="flex justify-between px-1">
            <button
              v-for="tick in [1, 5, 10, 15, 20]"
              :key="tick"
              class="text-[11px] font-medium hoverNoBG rounded-full px-2 py-0.5"
              :class="modelValue > tick ? 'text-info' : ''"
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
              max="20"
              step="1"
              class="w-full h-2 rounded-full appearance-none cursor-pointer leverage-slider"
              :style="{
                background: `linear-gradient(to right, #0052ff 0%, #0052ff ${((modelValue - 1) / 19) * 100}%, #e5e7eb ${((modelValue - 1) / 19) * 100}%, #e5e7eb 100%)`,
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
        <p class="text-s-14 text-info leading-relaxed" v-if="mode === 'create'">
          Leverage increases both your potential profits and losses. Using
          higher leverage means higher risk of losing your position.
          <a href="#" class="text-[#0052ff] font-medium hover:underline"
            >Learn more</a
          >
        </p>
        <app-warning
          v-if="mode === 'add'"
          title="Position leverage will change"
          :text="`You're adding to an existing position at a different leverage. This will change the leverage for your full ${symbol} position, not just the amount you're adding. Your liquidation price and required margin will be recalculated.`"
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
          class="w-full bg-[#0052ff] text-white rounded-full py-3.5 text-s-16 font-bold hoverOpacity transition-all active:scale-[0.98]"
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
import AppWarning from '@/components/AppWarning.vue'

interface Props {
  symbol: string
  modelValue: number
  leverageError: string
  isSaving: boolean
  mode: 'add' | 'create' | 'submit'
}

const props = defineProps<Props>()

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
    return props.isSaving ? 'Submitting...' : 'Submit'
  }
  return props.isSaving ? 'Saving...' : 'Save'
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
