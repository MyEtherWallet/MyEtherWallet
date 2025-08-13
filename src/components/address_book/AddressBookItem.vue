<template>
  <div
    :class="[
      { 'hover:bg-grey-5 cursor-pointer': isSelectable },
      'flex items-center gap-3 px-4 py-2  rounded-16',
    ]"
  >
    <app-blockie :address="adr.address" :size="9" />
    <div>
      <p class="font-medium">
        {{ adr.name }}
      </p>
      <p class="text-s-14 tracking-sp-06 text-info">
        {{ truncateAddress(adr.address, 10) }}
        <span v-if="showChain" class="text-info text-s-12">
          - {{ getChainName(adr.chainName) }}</span
        >
      </p>
    </div>

    <div class="ml-auto flex items-center justify-end gap-1">
      <app-btn-icon
        :label="$t('common.edit')"
        class="text-primary"
        @click="editAddress(adr)"
      >
        <PencilIcon />
      </app-btn-icon>
      <app-btn-icon
        :label="$t('common.delete')"
        class="text-primary"
        @click="deleteAddress(adr)"
      >
        <TrashIcon />
      </app-btn-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type Address } from '@/stores/addressBook'
import AppBtnIcon from '@components/AppBtnIcon.vue'
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import AppBlockie from '@components/AppBlockie.vue'
import { truncateAddress } from '@/utils/filters'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
defineProps({
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
}>()
const deleteAddress = (adr: Address) => {
  emit('delete', adr)
}

const editAddress = (adr: Address) => {
  emit('edit', adr)
}
</script>
