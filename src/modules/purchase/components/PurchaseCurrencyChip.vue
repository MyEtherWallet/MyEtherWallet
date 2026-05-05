<template>
  <button
    type="button"
    class="flex items-center gap-1.5 hoverNoBG rounded-full -mr-2 pl-1 pr-2 py-1"
    @click="emit('click')"
  >
    <img
      v-if="iconUrl"
      :src="iconUrl"
      :alt="currency"
      class="w-[15px] h-[15px] rounded-full object-cover flex-none"
      width="15"
      height="15"
    />
    <span class="text-s-11 font-bold tracking-sp-06 uppercase">
      {{ currency }}
    </span>
    <chevron-right-icon class="w-[15px] h-[15px] text-black flex-none" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import { getFiatIcon } from '../helpers/purchaseIcons'

const props = defineProps<{
  currency: string
}>()

const emit = defineEmits<{
  click: []
}>()

const iconUrl = computed(() => getFiatIcon(props.currency))
</script>
