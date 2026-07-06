<template>
  <div
    data-test="active-card"
    class="relative isolate rounded-20 overflow-hidden h-[172px] p-4 flex flex-col justify-between text-white [transform:translateZ(0)]"
  >
    <img
      :src="mewCardUrl"
      alt=""
      aria-hidden="true"
      class="absolute inset-0 w-full h-full object-cover"
    />
    <div class="absolute inset-0 rounded-20 bg-black/25 backdrop-blur-[2px]" aria-hidden="true" />

    <!-- Header: balance / name / wallet • address + actions -->
    <div class="relative flex items-start gap-3">
      <div class="flex-1 min-w-0 flex flex-col gap-1">
        <p class="text-s-14 leading-p-140">
          <!-- The card is the active account; show the skeleton whenever its
               balance is (re)loading so a switch never flashes the stale value. -->
          <span
            v-if="balanceLoading"
            class="inline-block w-16 h-3.5 bg-white/25 animate-pulse rounded align-middle"
          />
          <template v-else-if="balance">${{ formatFiat(balance.usdValue) }}</template>
          <template v-else>$0.00</template>
        </p>
        <p class="text-s-24 font-bold leading-[26px] truncate">{{ account.addressName }}</p>
        <!-- Wallet name always shows; append the truncated address only for a
             custom label (a default label already IS the address). -->
        <p class="text-s-14 leading-p-140 flex items-center gap-1 min-w-0">
          <span class="truncate">{{ account.walletName }}</span>
          <template v-if="account.addressName !== truncateAddress(account.address, 6, 4)">
            <span>•</span>
            <span class="flex-shrink-0">{{ truncateAddress(account.address, 6, 4) }}</span>
          </template>
        </p>
      </div>
      <div class="flex items-center gap-3 flex-shrink-0">
        <button
          :aria-label="$t('multi_address.menu.refresh')"
          class="w-6 h-6 flex items-center justify-center text-white hover:text-white/70 transition-colors"
          @click="onRefresh"
        >
          <arrow-path-icon class="w-6 h-6" :class="{ 'animate-spin': spinning }" />
        </button>
        <button
          :aria-label="$t('multi_address.menu.copy')"
          class="w-6 h-6 flex items-center justify-center text-white hover:text-white/70 transition-colors"
          @click="onCopy"
        >
          <check-icon v-if="copied" class="w-6 h-6" />
          <clipboard-document-icon v-else class="w-6 h-6" />
        </button>
        <app-pop-up-menu placeholder="account menu" location="right" teleport>
          <template #menu-button="{ toggleMenu }">
            <button data-test="menu-button" class="w-6 h-6 flex items-center justify-center text-white hover:text-white/70 transition-colors" @click="toggleMenu">
              <ellipsis-vertical-icon class="w-6 h-6" />
            </button>
          </template>
          <template #menu-content="{ toggleMenu }">
            <manage-accounts-menu
              v-if="!confirmingDelete"
              :kind="account.kind"
              :can-disconnect="true"
              :toggle="toggleMenu"
              @rename="$emit('rename')"
              @copy="$emit('copy')"
              @refresh="$emit('refresh')"
              @paper="$emit('paper')"
              @explorer="$emit('explorer')"
              @disconnect="$emit('disconnect')"
              @remove="onRemove"
            />
            <div v-else class="p-3 flex items-center gap-2">
              <button
                data-test="delete-confirm"
                class="text-error text-s-12"
                @click="$emit('delete'); confirmingDelete = false; toggleMenu()"
              >
                {{ $t('common.confirm') }}
              </button>
              <button data-test="delete-cancel" class="text-s-12" @click="confirmingDelete = false">
                {{ $t('common.cancel') }}
              </button>
            </div>
          </template>
        </app-pop-up-menu>
      </div>
    </div>

    <!-- Footer status -->
    <div class="relative flex items-end justify-between gap-2 text-s-14">
      <template v-if="account.kind === 'signing'">
        <span class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-success flex-shrink-0" aria-hidden="true" />
          <span>{{ $t('multi_address.connected') }}</span>
        </span>
      </template>
      <template v-else>
        <span class="flex items-center gap-1">
          <span class="rounded-full size-4 flex items-center justify-center flex-shrink-0">
            <eye-icon class="w-4 h-4" />
          </span>
          <span class="font-semibold">{{ $t('multi_address.watchonly') }}</span>
        </span>
        <button
          data-test="card-connect"
          class="bg-white rounded-[24px] h-10 px-3 flex items-center flex-shrink-0"
          @click="$emit('connect')"
        >
          <span class="font-semibold text-s-14 text-black">{{ $t('multi_address.connect_address') }}</span>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ClipboardDocumentIcon,
  ArrowPathIcon,
  EllipsisVerticalIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline'
import { EyeIcon } from '@heroicons/vue/16/solid'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import ManageAccountsMenu from '@/components/core_layouts/wallet/ManageAccountsMenu.vue'
import { truncateAddress, formatFiat } from '@/utils/filters'
import type { SavedAccount } from '@/stores/saved_accounts/savedAccountsLogic'
import type { AccountBalance } from '@/composables/useAccountBalances'

const props = defineProps<{
  account: SavedAccount
  balance?: AccountBalance
  balanceLoading?: boolean
}>()

const emit = defineEmits<{
  copy: []
  refresh: []
  paper: []
  explorer: []
  disconnect: []
  rename: []
  delete: []
  connect: []
}>()

const confirmingDelete = ref(false)

// Action feedback: spin the sync icon briefly, swap copy → check briefly.
const spinning = ref(false)
const copied = ref(false)

const onRefresh = (): void => {
  emit('refresh')
  spinning.value = true
  setTimeout(() => (spinning.value = false), 800)
}
const onCopy = (): void => {
  emit('copy')
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}

const onRemove = (): void => {
  confirmingDelete.value = true
}

const mewCardUrl = computed(
  () => `https://mewcard.mewapi.io/?address=${props.account.address}`,
)
</script>
