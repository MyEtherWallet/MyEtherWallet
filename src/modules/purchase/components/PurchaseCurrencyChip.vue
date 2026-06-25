<template>
  <button
    type="button"
    class="flex items-center gap-1.5 text-black hover:text-info transition-colors duration-300 pl-3 -ml-2 pr-2 -mr-2 py-2.5 -my-1.5"
    @click="emit('click')"
  >
    <app-token-logo
      :url="iconUrl"
      :symbol="currency"
      cover
      width="w-[15px]"
      height="h-[15px]"
    />
    <span class="text-s-11 font-bold tracking-sp-06 uppercase">
      {{ currency }}
    </span>
    <chevron-right-icon class="w-[15px] h-[15px] flex-none" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import { getFiatIcon } from '../helpers/purchaseIcons'

const props = defineProps<{
  currency: string
}>()

const emit = defineEmits<{
  click: []
}>()

const iconUrl = computed(() => getFiatIcon(props.currency))
</script>
