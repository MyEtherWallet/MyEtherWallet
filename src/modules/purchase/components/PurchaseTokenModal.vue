<template>
  <app-dialog
    v-model:is-open="isOpen"
    class="w-[calc(100vw-40px)] sm:w-full sm:max-w-[480px] sm:mx-auto h-[calc(100dvh-40px)] sm:h-[calc(100dvh-128px)] rounded-20! sm:rounded-32!"
  >
    <template #content>
      <div class="relative h-full overflow-hidden">
        <div
          class="flex h-full"
          :style="{
            width: `calc(200% + ${GAP}px)`,
            transform:
              view === 'tokens'
                ? 'translateX(0)'
                : `translateX(calc(-50% - ${GAP / 2}px))`,
            transition: 'transform 400ms cubic-bezier(0.25, 0.1, 0, 1)',
          }"
        >
          <div
            :inert="view !== 'tokens'"
            class="flex-none h-full pt-5 px-5 sm:pt-8 sm:px-8"
            :style="{
              width: `calc(50% - ${GAP / 2}px)`,
              opacity: view === 'tokens' ? 1 : 0,
              transition: 'opacity 250ms cubic-bezier(0.25, 0.1, 0, 1)',
            }"
          >
            <token-list-view
              :networks="networks"
              :selected-token="selectedToken"
              :network-filter="networkFilter"
              @open-networks="view = 'networks'"
              @select-token="onSelectToken"
            />
          </div>

          <!-- Gap between views -->
          <div
            class="flex-none h-full"
            :style="{ width: `${GAP}px` }"
            aria-hidden="true"
          />

          <div
            :inert="view !== 'networks'"
            class="flex-none h-full pt-5 px-5 sm:pt-8 sm:px-8"
            :style="{
              width: `calc(50% - ${GAP / 2}px)`,
              opacity: view === 'networks' ? 1 : 0,
              transition: 'opacity 250ms cubic-bezier(0.25, 0.1, 0, 1)',
            }"
          >
            <network-list-view
              :networks="networks"
              :current-filter="networkFilter"
              @back="view = 'tokens'"
              @select-network="onSelectNetwork"
            />
          </div>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AppDialog from '@/components/AppDialog.vue'
import TokenListView from './token_modal/TokenListView.vue'
import NetworkListView from './token_modal/NetworkListView.vue'
import type { PurchaseAsset } from '@/types/buyToken'
import type { BuyNetwork } from '@/stores/purchaseStore'

const props = defineProps<{
  networks: BuyNetwork[]
  defaultChainCode: string | null
  selectedToken: PurchaseAsset | null
}>()

const emit = defineEmits<{
  'update:selected': [token: PurchaseAsset]
}>()

const isOpen = defineModel('isOpen', { type: Boolean, required: true })

const GAP = 24

type View = 'tokens' | 'networks'

const view = ref<View>('tokens')
const networkFilter = ref<string | null>(null)

watch(isOpen, value => {
  if (value) {
    networkFilter.value = props.defaultChainCode
    view.value = 'tokens'
  }
})

const onSelectToken = (token: PurchaseAsset) => {
  emit('update:selected', token)
  isOpen.value = false
}

const onSelectNetwork = (chain: string | null) => {
  networkFilter.value = chain
  view.value = 'tokens'
}
</script>
