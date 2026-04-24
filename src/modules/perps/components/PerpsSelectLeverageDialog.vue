<template>
  <app-dialog v-model:is-open="isOpen" class="w-full max-w-[440px]">
    <template #title>
      <div class="flex items-center gap-2.5 px-4 pt-5">
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
              class="w-10 h-10 rounded-full border border-[#e5e7eb] bg-white flex items-center justify-center hover:bg-greyLight transition-colors text-s-20"
              :disabled="modelValue <= 1"
              :class="{ 'opacity-30 cursor-not-allowed': modelValue <= 1 }"
              @click="$emit('update:modelValue', Math.max(1, modelValue - 1))"
            >
              &minus;
            </button>
            <span
              class="font-bold text-[40px] tracking-tight min-w-[100px] text-center"
              >{{ modelValue }}&times;</span
            >
            <button
              class="w-10 h-10 rounded-full border border-[#e5e7eb] bg-white flex items-center justify-center hover:bg-greyLight transition-colors text-s-20"
              :disabled="modelValue >= 20"
              :class="{ 'opacity-30 cursor-not-allowed': modelValue >= 20 }"
              @click="$emit('update:modelValue', Math.min(20, modelValue + 1))"
            >
              +
            </button>
          </div>

          <!-- Tick Labels -->
          <div class="flex justify-between px-1 mb-1.5">
            <span
              v-for="tick in [1, 5, 10, 15, 20]"
              :key="tick"
              class="text-[11px] font-medium"
              :class="modelValue >= tick ? '' : 'text-grey-40'"
              >{{ tick }}&times;</span
            >
          </div>

          <!-- Slider -->
          <div class="relative px-0">
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
        <p class="text-s-14 text-info leading-relaxed">
          Leverage increases both your potential profits and losses. Using
          higher leverage means higher risk of losing your position.
          <a href="#" class="text-[#0052ff] font-medium hover:underline"
            >Learn more</a
          >
        </p>

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
          {{ isSaving ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import AppDialog from '@/components/AppDialog.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import { getLogoUrl } from '../utils/market'

defineProps({
  symbol: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Number,
    required: true,
  },
  leverageError: {
    type: String,
    default: '',
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
})

const isOpen = defineModel('isOpen', {
  type: Boolean,
  required: true,
})

defineEmits<{
  'update:modelValue': [value: number]
  save: []
}>()
</script>
