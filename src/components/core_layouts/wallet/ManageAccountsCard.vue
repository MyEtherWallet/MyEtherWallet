<template>
  <div
    data-test="active-card"
    class="relative rounded-20 overflow-hidden h-[172px] p-4 flex flex-col justify-between text-white"
  >
    <img
      :src="mewCardUrl"
      alt=""
      aria-hidden="true"
      class="absolute inset-0 w-full h-full object-cover"
    />
    <div class="absolute inset-0 bg-black/25" aria-hidden="true" />

    <!-- Header: balance / name / wallet • address + actions -->
    <div class="relative flex items-start gap-3">
      <div class="flex-1 min-w-0 flex flex-col gap-1">
        <p class="text-s-14 leading-p-140">
          <template v-if="balance">${{ balance.usdValue.toFixed(2) }}</template>
          <template v-else>$0.00</template>
        </p>
        <p class="text-s-24 font-bold leading-[26px] truncate">{{ account.addressName }}</p>
        <p class="text-s-14 leading-p-140 flex items-center gap-1 min-w-0">
          <span class="truncate">{{ account.walletName }}</span>
          <span>•</span>
          <span class="flex-shrink-0">{{ truncateAddress(account.address, 6, 4) }}</span>
        </p>
      </div>
      <div class="flex items-center gap-3 flex-shrink-0">
        <button
          :aria-label="$t('multi_address.menu.refresh')"
          class="w-6 h-6 flex items-center justify-center"
          @click="$emit('refresh')"
        >
          <arrow-path-icon class="w-6 h-6" />
        </button>
        <button
          :aria-label="$t('multi_address.menu.copy')"
          class="w-6 h-6 flex items-center justify-center"
          @click="$emit('copy')"
        >
          <clipboard-document-icon class="w-6 h-6" />
        </button>
        <app-pop-up-menu placeholder="account menu" location="right">
          <template #menu-button="{ toggleMenu }">
            <button data-test="menu-button" class="w-6 h-6 flex items-center justify-center" @click="toggleMenu">
              <ellipsis-vertical-icon class="w-6 h-6" />
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
    </div>

    <!-- Rename inline (mirrors the row so a card rename routes identically) -->
    <div v-if="renaming" class="relative flex items-center gap-2">
      <input
        data-test="rename-input"
        v-model="draftName"
        class="flex-1 min-w-0 rounded-8 px-2 py-1 text-s-14 text-black"
        @keyup.enter="saveRename"
      />
      <button data-test="rename-save" class="text-s-12 font-semibold" @click="saveRename">
        {{ $t('common.save') }}
      </button>
      <button class="text-s-12" @click="renaming = false">{{ $t('common.cancel') }}</button>
    </div>

    <!-- Footer status -->
    <div v-else class="relative flex items-center gap-1 text-s-14">
      <template v-if="account.kind === 'signing'">
        <span class="w-2 h-2 rounded-full bg-success flex-shrink-0" aria-hidden="true" />
        <span>{{ $t('multi_address.connected') }}</span>
      </template>
      <template v-else>
        <icon-watch-only class="w-4 h-4 flex-shrink-0" />
        <span>{{ $t('multi_address.watch_only') }}</span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  TrashIcon,
  ClipboardDocumentIcon,
  ArrowPathIcon,
  DocumentIcon,
  ArrowTopRightOnSquareIcon,
  PencilSquareIcon,
  EllipsisVerticalIcon,
} from '@heroicons/vue/24/outline'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import IconWatchOnly from '@/assets/icons/IconWatchOnly.vue'
import { truncateAddress } from '@/utils/filters'
import type { SavedAccount } from '@/stores/saved_accounts/savedAccountsLogic'
import type { AccountBalance } from '@/composables/useAccountBalances'

const props = defineProps<{
  account: SavedAccount
  balance?: AccountBalance
}>()

const emit = defineEmits<{
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

const mewCardUrl = computed(
  () => `https://mewcard.mewapi.io/?address=${props.account.address}`,
)

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

<style scoped>
.text-white :deep(p),
.text-white > .relative > * {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
}
</style>
