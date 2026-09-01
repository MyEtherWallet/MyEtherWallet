<template>
  <div
    ref="rowRef"
    class="flex items-center gap-3 pl-4 pr-2 py-4 rounded-16 transition-colors"
    :class="isActive ? 'bg-surface-hover' : 'hover:bg-grey-5'"
  >
    <button
      data-test="row-body"
      class="flex items-center gap-3 flex-1 min-w-0 text-left"
      @click="$emit('select')"
    >
      <div class="relative flex-shrink-0 w-10 h-10">
        <!-- Same avatar as the header multi-address dropdown: a blockie of the
             address (not the wallet logo). Active row gets the green ring. -->
        <app-blockie
          :address="account.address"
          :size="10"
          :blocks="8"
          is-flat
          class="rounded-full"
          :class="{
            'ring-2 ring-[#05c0a5] ring-offset-1 ring-offset-white':
              isActive && account.kind === 'signing',
          }"
        />
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-1">
          <span
            class="font-semibold text-s-14 truncate text-black"
          >{{ account.addressName }}</span>
          <eye-icon
            v-if="account.kind === 'watchOnly'"
            data-test="row-watch-only"
            class="w-4 h-4 flex-shrink-0 text-[#575757]"
          />
          <account-connected-dot v-else size="md" data-test="row-connected" />
        </div>
        <!-- Wallet name always shows; the truncated address is prepended only for
             a custom label (a default-named row's bold label already IS the address). -->
        <div
          class="text-s-12 truncate"
          :class="isActive ? 'text-black' : 'text-info'"
        >
          <template v-if="account.addressName !== truncateAddress(account.address, 6, 4)">
            {{ truncateAddress(account.address, 6, 4) }} •
          </template>
          {{ account.walletName }}
        </div>
      </div>
    </button>

    <div
      v-if="balanceLoading || balance"
      class="text-right flex-shrink-0 text-s-14"
      :class="isActive ? 'text-black' : 'text-info'"
    >
      <!-- Active row skeletons whenever loading (stale-safe on switch); other rows
           show their cached balance and only skeleton when none exists yet. -->
      <template v-if="balanceLoading && (isActive || !balance)">
        <span class="inline-block w-12 h-3 bg-grey-10 animate-pulse rounded" />
      </template>
      <template v-else-if="balance">${{ formatFiat(balance.usdValue) }}</template>
    </div>

    <app-pop-up-menu
      placeholder="account menu"
      location="right"
      teleport
      menu-radius-class="rounded-16"
    >
      <template #menu-button="{ toggleMenu }">
        <button data-test="menu-button" class="p-1" @click="toggleMenu">
          <ellipsis-vertical-icon class="w-5 h-5" />
        </button>
      </template>
      <template #menu-content="{ toggleMenu }">
        <manage-accounts-menu
          :kind="account.kind"
          :is-active="isActive"
          :toggle="toggleMenu"
          @rename="$emit('rename')"
          @copy="$emit('copy')"
          @refresh="$emit('refresh')"
          @paper="$emit('paper')"
          @explorer="$emit('explorer')"
          @disconnect="$emit('disconnect')"
          @remove="$emit('delete')"
        />
      </template>
    </app-pop-up-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'
import { EyeIcon } from '@heroicons/vue/16/solid'
import AccountConnectedDot from '@/components/core_layouts/wallet/AccountConnectedDot.vue'
import AppBlockie from '@/components/AppBlockie.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import ManageAccountsMenu from '@/components/core_layouts/wallet/ManageAccountsMenu.vue'
import { truncateAddress, formatFiat } from '@/utils/filters'
import type { SavedAccount } from '@/stores/saved_accounts/savedAccountsLogic'
import type { AccountBalance } from '@/composables/useAccountBalances'

const props = defineProps<{
  account: SavedAccount
  isActive: boolean
  balance?: AccountBalance
  balanceLoading?: boolean
  /** Scroll container to observe against so viewport detection is accurate. */
  scrollRoot?: HTMLElement | null
}>()

const emit = defineEmits<{
  select: []
  copy: []
  refresh: []
  paper: []
  explorer: []
  disconnect: []
  rename: []
  delete: []
  'visibility-change': [visible: boolean]
}>()

// Report when this row enters/leaves the popup's scroll viewport so the parent can
// lazily (re)fetch its balance. No rootMargin: only rows actually in the viewport
// count as visible, so we never fetch/poll rows that are off-screen.
const rowRef = ref<HTMLElement | null>(null)
const scrollRootRef = computed(() => props.scrollRoot ?? undefined)
useIntersectionObserver(
  rowRef,
  ([entry]) => emit('visibility-change', entry?.isIntersecting ?? false),
  { root: scrollRootRef },
)
// The observer doesn't emit a final "not visible" when the row unmounts (e.g. its
// group is collapsed), so report it explicitly — otherwise the address lingers in
// the parent's visible set and keeps getting polled while off-screen.
onBeforeUnmount(() => emit('visibility-change', false))
</script>
