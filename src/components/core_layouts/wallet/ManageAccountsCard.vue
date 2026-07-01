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
            <manage-accounts-menu
              v-if="!confirmingDelete"
              :kind="account.kind"
              :is-active="true"
              :toggle="toggleMenu"
              @rename="startRename"
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
    <div v-else class="relative flex items-end justify-between gap-2 text-s-14">
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
} from '@heroicons/vue/24/outline'
import { EyeIcon } from '@heroicons/vue/16/solid'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import ManageAccountsMenu from '@/components/core_layouts/wallet/ManageAccountsMenu.vue'
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
  disconnect: []
  rename: [name: string]
  delete: []
  connect: []
}>()

const confirmingDelete = ref(false)
const renaming = ref(false)
const draftName = ref('')

const onRemove = (): void => {
  confirmingDelete.value = true
}

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
