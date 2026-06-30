<template>
  <div class="flex items-center gap-2 py-2">
    <button
      data-test="row-body"
      class="flex items-center gap-2 flex-1 min-w-0 text-left"
      @click="$emit('select')"
    >
      <img
        v-if="account.icon"
        :src="account.icon"
        class="w-6 h-6 rounded-full flex-shrink-0"
        :alt="account.walletName"
      />
      <app-blockie
        v-else
        :address="account.address"
        :size="6"
        class="rounded-full flex-shrink-0"
      />
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2">
          <span class="font-medium text-s-14 truncate">{{ account.walletName }}</span>
          <span
            v-if="isActive"
            data-test="badge"
            class="text-s-10 px-2 py-[2px] rounded-full bg-grey-faded flex-shrink-0"
          >
            {{ account.kind === 'watchOnly' ? $t('common.watch_only') : $t('multi_address.unlocked') }}
          </span>
        </div>
        <div class="font-mono text-s-12 text-info">
          {{ truncateAddress(account.address, 6, 4) }}
        </div>
      </div>
      <div class="ml-auto text-right flex-shrink-0">
        <template v-if="balanceLoading">
          <span class="inline-block w-12 h-3 bg-grey-faded animate-pulse rounded" />
        </template>
        <template v-else-if="balance">
          <div class="text-s-14">${{ balance.usdValue.toFixed(2) }}</div>
          <div class="text-s-12 text-info">{{ balance.tokenCount }} {{ $t('multi_address.tokens') }}</div>
        </template>
      </div>
    </button>

    <div class="flex items-center gap-1 flex-shrink-0">
      <button data-test="copy" class="p-1" @click="onCopy">
        <span v-if="copied" class="text-s-10">{{ $t('multi_address.copied') }}</span>
        <clipboard-document-icon v-else class="w-4 h-4" />
      </button>
      <template v-if="!confirmingDelete">
        <button data-test="delete" class="p-1" @click="confirmingDelete = true">
          <trash-icon class="w-4 h-4" />
        </button>
      </template>
      <template v-else>
        <button
          data-test="delete-confirm"
          class="p-1 text-error text-s-12"
          @click="$emit('delete'); confirmingDelete = false"
        >
          {{ $t('common.confirm') }}
        </button>
        <button
          data-test="delete-cancel"
          class="p-1 text-s-12"
          @click="confirmingDelete = false"
        >
          {{ $t('common.cancel') }}
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { TrashIcon, ClipboardDocumentIcon } from '@heroicons/vue/24/outline'
import AppBlockie from '@/components/AppBlockie.vue'
import { truncateAddress } from '@/utils/filters'
import type { SavedAccount } from '@/stores/saved_accounts/savedAccountsLogic'
import type { AccountBalance } from '@/composables/useAccountBalances'

defineProps<{
  account: SavedAccount
  isActive: boolean
  balance?: AccountBalance
  balanceLoading?: boolean
}>()

const emit = defineEmits<{
  select: []
  copy: []
  delete: []
}>()

const confirmingDelete = ref(false)
const copied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | undefined

const onCopy = (): void => {
  emit('copy')
  copied.value = true
  if (copiedTimer) clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => {
    copied.value = false
  }, 1500)
}

onUnmounted(() => {
  if (copiedTimer) clearTimeout(copiedTimer)
})
</script>
