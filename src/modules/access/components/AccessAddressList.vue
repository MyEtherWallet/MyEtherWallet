<template>
  <div class="flex flex-col gap-1">
    <!-- Only the addresses scroll; the step bar, pickers, error, Connect and the help
         footer stay put. The cap is the dialog's max height minus those fixed parts
         (measured 356px from sm with the balances error; pickers stack below xs). -->
    <div
      data-testid="address-scroll"
      class="mew-scrollbar -mx-1 flex flex-col gap-1 overflow-y-auto px-1 max-h-[calc(95vh-440px)] xs:max-h-[calc(95vh-350px)] sm:max-h-[calc(90vh-430px)]"
    >
      <template v-if="isLoading && !entries.length">
        <div
          v-for="i in 4"
          :key="i"
          data-testid="address-skeleton"
          class="flex h-[68px] shrink-0 items-center gap-3 rounded-12 bg-background-default px-4 py-3"
        >
          <span
            class="size-8 shrink-0 animate-pulse rounded-full bg-background-default-hover"
          />
          <span class="flex flex-col gap-2">
            <span
              class="h-3 w-[60px] animate-pulse rounded-[4px] bg-background-default-hover"
            />
            <span
              class="h-3 w-[100px] animate-pulse rounded-[4px] bg-background-default-hover"
            />
          </span>
        </div>
      </template>
      <div
        v-for="entry in entries"
        :key="entry.index"
        data-testid="address-row"
        class="flex h-[68px] shrink-0 cursor-pointer items-center gap-3 rounded-12 px-4 py-3 transition-colors"
        :class="
          selected === entry.index
            ? 'bg-background-default-hover'
            : 'bg-background-default hover:bg-background-default-hover'
        "
        @click="selected = entry.index"
      >
        <AppAvatar type="account" size="l" :address="entry.address" />
        <AppContentGroup
          :title="truncateAddress(entry.address)"
          :description="balanceText(entry.balance)"
          size="m"
          no-wrap
          class="grow min-w-0"
        />
        <AppRadio
          v-model="selected"
          name="access-address"
          :value="entry.index"
          :aria-label="entry.address"
        />
      </div>
      <button
        v-if="entries.length"
        type="button"
        data-testid="show-more"
        class="mx-auto shrink-0 pt-2 text-sm font-semibold text-text-brand cursor-pointer disabled:cursor-default disabled:opacity-50"
        :disabled="isLoading"
        @click="emit('show-more')"
      >
        {{ $t('access_wallet.advanced.show_more') }}
      </button>
    </div>
    <p
      v-if="balancesError"
      data-testid="balances-error"
      role="alert"
      class="flex items-center gap-1 pt-2 text-xs text-text-error"
    >
      <AppIcon name="exclamation-triangle" variant="filled" size="xxs" />
      {{ $t('access_wallet.advanced.balances_error') }}
      <button
        type="button"
        data-testid="balances-retry"
        class="font-semibold text-text-brand cursor-pointer"
        @click="emit('retry')"
      >
        {{ $t('access_wallet.advanced.retry') }}
      </button>
    </p>
  </div>
</template>

<script setup lang="ts">
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppRadio from '@/components/radio/AppRadio.vue'
import type { SelectAddress } from '../types/selectAddress'
import { truncateAddress } from '@/utils/filters'

const props = defineProps<{
  entries: SelectAddress[]
  isLoading: boolean
  balancesError: boolean
  currency?: string
}>()
const emit = defineEmits<{ 'show-more': []; retry: [] }>()
const selected = defineModel<number>({ required: true })

const balanceText = (balance: string) =>
  balance ? `${balance} ${props.currency ?? ''}`.trim() : '--'
</script>
