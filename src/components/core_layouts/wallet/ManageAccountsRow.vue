<template>
  <div
    class="flex items-center gap-3 pl-4 pr-2 py-4 rounded-16"
    :class="{ 'bg-surface-hover': isActive }"
  >
    <button
      data-test="row-body"
      class="flex items-center gap-3 flex-1 min-w-0 text-left"
      @click="$emit('select')"
    >
      <div class="relative flex-shrink-0 w-10 h-10">
        <img
          v-if="account.icon"
          :src="account.icon"
          class="w-10 h-10 rounded-full"
          :class="{ 'ring-2 ring-primary': isActive }"
          :alt="account.walletName"
        />
        <app-blockie
          v-else
          :address="account.address"
          :size="10"
          is-flat
          class="rounded-full"
          :class="{ 'ring-2 ring-primary rounded-full': isActive }"
        />
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-1">
          <span
            class="font-semibold text-s-14 truncate"
            :class="isActive ? 'text-black' : 'text-black'"
          >{{ account.addressName }}</span>
          <span
            v-if="isActive"
            data-test="badge"
            class="flex-shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-black"
          >
            <check-icon class="w-3 h-3 text-white" />
          </span>
          <eye-icon
            v-else-if="account.kind === 'watchOnly'"
            class="w-5 h-5 flex-shrink-0 text-info"
          />
        </div>
        <div
          class="text-s-12 truncate"
          :class="isActive ? 'text-black' : 'text-info'"
        >
          {{ truncateAddress(account.address, 6, 4) }} • {{ account.walletName }}
        </div>
      </div>
    </button>

    <div
      v-if="balanceLoading || balance"
      class="text-right flex-shrink-0 text-s-14"
      :class="isActive ? 'text-black' : 'text-info'"
    >
      <template v-if="balanceLoading">
        <span class="inline-block w-12 h-3 bg-grey-faded animate-pulse rounded" />
      </template>
      <template v-else-if="balance">${{ balance.usdValue.toFixed(2) }}</template>
    </div>

    <app-pop-up-menu placeholder="account menu" location="right">
      <template #menu-button="{ toggleMenu }">
        <button data-test="menu-button" class="p-1" @click="toggleMenu">
          <ellipsis-vertical-icon class="w-5 h-5" />
        </button>
      </template>
      <template #menu-content="{ toggleMenu }">
        <ul class="py-2 min-w-[220px] text-s-14">
          <li
            data-test="menu-rename"
            class="text-black px-4 py-2 hover:bg-grey-faded cursor-pointer flex items-center"
            @click="startRename"
          >
            <pencil-square-icon class="w-4 h-4 mr-2 text-primary" /> {{ $t('multi_address.menu.rename') }}
          </li>
          <li
            data-test="menu-copy"
            class="text-black px-4 py-2 hover:bg-grey-faded cursor-pointer flex items-center"
            @click="$emit('copy'); toggleMenu()"
          >
            <clipboard-document-icon class="w-4 h-4 mr-2 text-primary" /> {{ $t('multi_address.menu.copy') }}
          </li>
          <li
            data-test="menu-refresh"
            class="text-black px-4 py-2 hover:bg-grey-faded cursor-pointer flex items-center"
            @click="$emit('refresh'); toggleMenu()"
          >
            <arrow-path-icon class="w-4 h-4 mr-2 text-primary" /> {{ $t('multi_address.menu.refresh') }}
          </li>
          <li
            v-if="account.kind === 'signing'"
            data-test="menu-paper"
            class="text-black px-4 py-2 hover:bg-grey-faded cursor-pointer flex items-center"
            @click="$emit('paper'); toggleMenu()"
          >
            <document-icon class="w-4 h-4 mr-2 text-primary" /> {{ $t('multi_address.menu.paper_wallet') }}
          </li>
          <li
            data-test="menu-explorer"
            class="text-black px-4 py-2 hover:bg-grey-faded cursor-pointer flex items-center"
            @click="$emit('explorer'); toggleMenu()"
          >
            <arrow-top-right-on-square-icon class="w-4 h-4 mr-2 text-primary" /> {{ $t('multi_address.menu.explorer') }}
          </li>
          <li
            v-if="!confirmingDelete"
            data-test="menu-remove"
            class="px-4 py-2 hover:bg-grey-faded cursor-pointer flex items-center text-error"
            @click="confirmingDelete = true"
          >
            <trash-icon class="w-4 h-4 mr-2 text-error" /> {{ $t('multi_address.menu.remove') }}
          </li>
          <li v-else class="px-4 py-2 flex items-center gap-2">
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
          </li>
        </ul>
      </template>
    </app-pop-up-menu>
  </div>

  <div v-if="renaming" class="flex items-center gap-2 pb-2 px-4">
    <input
      data-test="rename-input"
      v-model="draftName"
      class="flex-1 border border-grey-10 rounded-8 px-2 py-1 text-s-14"
      @keyup.enter="saveRename"
    />
    <button data-test="rename-save" class="text-primary text-s-12" @click="saveRename">
      {{ $t('common.save') }}
    </button>
    <button class="text-s-12" @click="renaming = false">{{ $t('common.cancel') }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  TrashIcon,
  ClipboardDocumentIcon,
  ArrowPathIcon,
  DocumentIcon,
  ArrowTopRightOnSquareIcon,
  PencilSquareIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline'
import AppBlockie from '@/components/AppBlockie.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import { truncateAddress } from '@/utils/filters'
import type { SavedAccount } from '@/stores/saved_accounts/savedAccountsLogic'
import type { AccountBalance } from '@/composables/useAccountBalances'

const props = defineProps<{
  account: SavedAccount
  isActive: boolean
  balance?: AccountBalance
  balanceLoading?: boolean
}>()

const emit = defineEmits<{
  select: []
  copy: []
  refresh: []
  paper: []
  explorer: []
  rename: [name: string]
  delete: []
}>()

const confirmingDelete = ref(false)
const renaming = ref(false)
const draftName = ref('')

const startRename = (): void => {
  draftName.value = props.account.addressName
  renaming.value = true
}
const saveRename = (): void => {
  const name = draftName.value.trim()
  if (name) emit('rename', name)
  renaming.value = false
}
</script>
