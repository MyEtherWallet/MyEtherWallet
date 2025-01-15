<template>
  <div class="w-96 h-32 rounded-md border-purple border-2 bg-white px-4 py-2">
    <div class="flex justify-between items-center">
      <input
        class="h-16 w-64 text-4xl font-bold text-purple outline-none"
        name="amount-input"
        type="string"
        placeholder="0.0"
        required
        @input="handleChange"
      />
      <div>
        <button
          class="bg-light-grey text-black rounded-full px-1 py-1 flex items-center"
          type="button"
        >
          <div
            class="px-1 py-1 rounded-full border-x border-y border-grey-30 mr-1"
          >
            <img
              class="w-5 h-5"
              src="@/assets/icons/tokens/eth.svg"
              alt="token icon"
            />
          </div>
          ETH
          <ChevronDownIcon class="ml-1 w-4 h-4 stroke-4" />
        </button>
      </div>
    </div>
    <div class="flex justify-between">
      <div class="text-lg text-grey-30">$0.00</div>
      <div class="text-lg text-purple">Balance: 1.35</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { useDebounceFn } from '@vueuse/core'

defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const handleChange = useDebounceFn((event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}, 500)
</script>
