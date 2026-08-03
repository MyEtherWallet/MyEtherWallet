<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{ modelValue: number; total: number; perPage: number }>()
const emit = defineEmits<{ 'update:modelValue': [page: number] }>()

const pageCount = computed(() =>
  Math.max(1, Math.ceil(props.total / props.perPage)),
)
const isFirst = computed(() => props.modelValue <= 1)
const isLast = computed(() => props.modelValue >= pageCount.value)

const go = (p: number) => {
  if (p >= 1 && p <= pageCount.value) emit('update:modelValue', p)
}
</script>

<template>
  <div data-test="pagination" class="w-full">
    <div class="border-t border-grey-10" />
    <div class="mt-6 flex items-center gap-3">
      <p class="flex-1 text-s-16 text-black">
        <!-- Consumers pass a localized label; falls back to "page / pages". -->
        <slot name="label" :page="props.modelValue" :pages="pageCount">
          {{ props.modelValue }} / {{ pageCount }}
        </slot>
      </p>
      <button
        data-test="prev"
        type="button"
        :disabled="isFirst"
        class="flex size-10 items-center justify-center rounded-full bg-[#e6e6e6] text-black transition hover:bg-[#dcdcdc] disabled:cursor-not-allowed disabled:opacity-40"
        @click="go(props.modelValue - 1)"
      >
        <ChevronLeftIcon class="size-6" />
      </button>
      <button
        data-test="next"
        type="button"
        :disabled="isLast"
        class="flex size-10 items-center justify-center rounded-full bg-[#e6e6e6] text-black transition hover:bg-[#dcdcdc] disabled:cursor-not-allowed disabled:opacity-40"
        @click="go(props.modelValue + 1)"
      >
        <ChevronRightIcon class="size-6" />
      </button>
    </div>
  </div>
</template>
