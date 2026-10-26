<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppAvatarBadge from '@/components/avatar/AppAvatarBadge.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import AccountConnectedDot from '@/components/core_layouts/wallet/AccountConnectedDot.vue'
import { truncateAddress } from '@/utils/filters'

/**
 * Address selector (design library, Figma 892:2786). The Navbar pill for the
 * active account: account avatar with the network badge, balance, name (or the
 * truncated address) with a connected dot / watch-only eye, and a chevron that
 * flips while `open`. Hover is CSS; the parent owns the popup it opens and the
 * store data (it passes formatted strings).
 *
 * Beyond Figma, to keep today's header behaviour: `loading` swaps the balance
 * for a placeholder bar, and an empty `address` shows the network with a
 * "No address" label.
 *
 * @example <AppAddressSelector :address="addr" balance="$130.23" connected :open="menuOpen" @click="toggle" />
 */
const props = withDefaults(
  defineProps<{
    /** Full address; seeds the avatar and is truncated when there is no name. */
    address?: string
    name?: string
    /** Formatted fiat balance. */
    balance?: string
    loading?: boolean
    /** False for a watch-only account (shows the eye). */
    connected?: boolean
    networkIcon?: string | null
    open?: boolean
  }>(),
  {
    address: '',
    name: undefined,
    balance: '',
    loading: false,
    connected: true,
    networkIcon: undefined,
    open: false,
  },
)

const { t } = useI18n()

const accountLabel = computed(
  () => props.name || truncateAddress(props.address, 6, 4),
)

// Design review: names of 18+ characters show their first 17 and an ellipsis,
// so the pill doesn't stretch the navbar. Counted by code point (emoji-safe).
const NAME_TRUNCATE_LENGTH = 18
const visibleLabel = computed(() => {
  const characters = Array.from(props.name ?? '')
  return characters.length >= NAME_TRUNCATE_LENGTH
    ? `${characters.slice(0, NAME_TRUNCATE_LENGTH - 1).join('')}…`
    : accountLabel.value
})
const isLabelTruncated = computed(
  () => visibleLabel.value !== accountLabel.value,
)

const ariaLabel = computed(() =>
  props.address
    ? [
        // The placeholder hides the balance, so don't announce a stale one.
        props.loading ? t('common.loading') : props.balance,
        accountLabel.value,
        t(
          props.connected
            ? 'multi_address.connected'
            : 'multi_address.watch_only',
        ),
      ]
        .filter(Boolean)
        .join(', ')
    : t('multi_address.no_address_pill'),
)
</script>

<template>
  <button
    type="button"
    data-testid="address-selector"
    :aria-expanded="open"
    :aria-label="ariaLabel"
    class="inline-flex h-10 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border border-border-default bg-background-alternative pl-2 pr-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-focus"
    :class="{ 'hover:bg-background-default': !open }"
  >
    <template v-if="address">
      <AppAvatar
        type="account"
        size="s"
        :address="address"
        :badge-bottom="!!networkIcon"
        class="shrink-0"
      >
        <template #badge>
          <AppAvatarBadge type="network">
            <img
              :src="networkIcon ?? ''"
              alt=""
              class="size-full object-contain"
            />
          </AppAvatarBadge>
        </template>
      </AppAvatar>

      <span class="flex flex-col items-start gap-0.5">
        <span
          v-if="loading"
          data-test="address-selector-loading"
          class="my-0.5 inline-block h-3 w-12 animate-pulse rounded bg-background-default-hover"
        />
        <span v-else class="text-label-sm leading-3.5 text-text-default">
          {{ balance }}
        </span>
        <span class="flex items-center gap-1">
          <!-- 10/12 per Figma; the type scale has no 10px style. -->
          <span
            data-test="address-selector-label"
            class="text-[10px] leading-3 text-text-subtle"
            :title="isLabelTruncated ? accountLabel : undefined"
          >
            {{ visibleLabel }}
          </span>
          <AccountConnectedDot
            v-if="connected"
            data-test="address-selector-connected"
          />
          <!-- 12px is below the icon scale (min xxs 16), hence size-3!. -->
          <AppIcon
            v-else
            name="eye"
            variant="filled"
            size="xxs"
            class="size-3! shrink-0 text-icon-default"
          />
        </span>
      </span>
    </template>

    <template v-else>
      <img
        v-if="networkIcon"
        :src="networkIcon"
        alt=""
        class="size-6 shrink-0 rounded-full object-contain"
      />
      <span
        data-test="address-selector-no-address"
        class="text-label-sm text-text-subtle"
      >
        {{ t('multi_address.no_address_pill') }}
      </span>
    </template>

    <AppIcon
      name="chevron-down"
      variant="filled"
      size="s"
      class="shrink-0 text-icon-default transition-transform"
      :class="{ 'rotate-180': open }"
    />
  </button>
</template>
