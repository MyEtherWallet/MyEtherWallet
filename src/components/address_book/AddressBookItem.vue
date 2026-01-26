<template>
  <div
    :class="[
      { 'hover:bg-grey-10 cursor-pointer transition-colors': isSelectable },
      'flex items-center gap-3 px-5 py-4 rounded-xl mb-2 border-2 border-transparent',
      isSelected ? '!bg-primary/5 !border-primary' : 'bg-surface',
    ]"
    @click="setItem(adr)"
  >
    <app-blockie :address="adr.address" :size="9" />
    <div class="flex flex-col">
      <p v-if="adr.name" class="font-bold text-s-17 leading-none mb-1">
        {{ adr.name }}
      </p>
      <p
        :class="[
          'tracking-sp-06',
          adr.name ? 'text-s-14 text-info' : 'text-s-17 font-medium',
        ]"
      >
        {{ truncateAddress(adr.address, 10) }}
        <span v-if="showChain" class="text-info text-s-12">
          - {{ getChainName(adr.chainName) }}</span
        >
      </p>
    </div>

    <div class="ml-auto flex items-center justify-end gap-1">
      <app-btn-icon
        v-if="!isSelectable"
        :label="$t('common.edit')"
        class="text-primary hover:bg-primary/10"
        @click="editAddress(adr)"
      >
        <PencilIcon class="w-5 h-5" />
      </app-btn-icon>
      <app-btn-icon
        v-if="!isSelectable"
        :label="$t('common.delete')"
        class="text-primary hover:bg-primary/10"
        @click="deleteAddress(adr)"
      >
        <TrashIcon class="w-5 h-5" />
      </app-btn-icon>
      <CheckIcon v-if="isSelected" class="text-primary w-6 h-6" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type Address } from '@/stores/addressBook'
import AppBtnIcon from '@components/AppBtnIcon.vue'
import { PencilIcon, TrashIcon, CheckIcon } from '@heroicons/vue/24/outline'
import AppBlockie from '@components/AppBlockie.vue'
import { truncateAddress } from '@/utils/filters'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const props = defineProps({
  adr: {
    type: Object as () => Address,
    required: true,
  },
  showChain: {
    type: Boolean,
    default: false,
  },
  isSelectable: {
    type: Boolean,
    default: false,
  },
  selectedAddress: {
    type: String,
  },
})

const chainsStore = useChainsStore()
const { chains } = storeToRefs(chainsStore)

const getChainName = (chainName: string) => {
  const chain = chains.value.find(c => c.name === chainName)
  return chain ? chain.nameLong : chainName
}

const emit = defineEmits<{
  (e: 'edit', address: Address): void
  (e: 'delete', address: Address): void
  (e: 'set-item', address: Address): void
}>()
const deleteAddress = (adr: Address) => {
  emit('delete', adr)
}

const editAddress = (adr: Address) => {
  emit('edit', adr)
}

const setItem = (adr: Address) => {
  if (props.isSelectable) {
    emit('set-item', adr)
  }
}

const isSelected = computed<boolean>(() => {
  return !!(
    props.selectedAddress &&
    props.selectedAddress.toLowerCase() === props.adr.address.toLowerCase()
  )
})
</script>
