<template>
  <button
    type="button"
    class="flex w-full h-16 items-center gap-3 rounded-16 bg-background-default p-4 text-left transition-colors hover:bg-background-default-hover cursor-pointer"
    @click="select"
  >
    <AppAvatar v-if="advancedIcon" type="icon" size="m">
      <template #icon><AppIcon :name="advancedIcon" size="xs" /></template>
    </AppAvatar>
    <!-- Round brand marks (Ledger, Trezor) already fill their circle; the wallet
         avatar would inset them as if they were square logos. -->
    <img
      v-else-if="wallet.roundIcon && iconUrl"
      :src="iconUrl"
      alt=""
      class="size-8 shrink-0 rounded-full"
    />
    <AppAvatar
      v-else
      type="wallet"
      size="m"
      :url="iconUrl"
      :name="displayName"
    />
    <span
      class="grow min-w-0 truncate text-base font-semibold text-text-default"
    >
      {{ displayName }}
    </span>
    <span v-if="status" class="shrink-0 text-xs text-text-subtle">
      {{ $t(STATUS_KEY[status]) }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import { analytics } from '@/analytics'
import { ConnectWalletEvent } from '@/analytics/events'
import configs from '@/configs'
import type { WalletConfig } from '@/modules/access/common/walletConfigs'
import {
  ADVANCED_WALLET_ICONS,
  type WalletStatus,
  walletKey,
} from '@/modules/access/common/walletTabs'

const props = defineProps<{ wallet: WalletConfig; status?: WalletStatus }>()
const emit = defineEmits<{ select: [wallet: WalletConfig] }>()
const { t } = useI18n()

const STATUS_KEY: Record<WalletStatus, string> = {
  recent: 'access_wallet.recent',
  detected: 'access_wallet.detected',
  official: 'access_wallet.official',
}

const displayName = computed(() =>
  props.wallet.nameKey ? t(props.wallet.nameKey) : props.wallet.name,
)
const advancedIcon = computed(
  () => ADVANCED_WALLET_ICONS[walletKey(props.wallet)],
)

const iconUrl = ref<string | undefined>()
// Follow the wallet prop (not just the first one) so a reused card never keeps
// another wallet's logo.
watch(
  () => props.wallet.icon,
  async icon => {
    iconUrl.value = typeof icon === 'string' ? icon : undefined
    if (typeof icon !== 'function') return
    try {
      const url = await icon()
      if (props.wallet.icon === icon) iconUrl.value = url
    } catch (error) {
      // The logo is a lazily imported chunk; failing to load it (network blip, stale
      // chunk after a redeploy, content blockers) is expected and non-actionable.
      // AppAvatar falls back to initials, so don't report it as noise.
      if (configs.BUILD_MODE !== 'production') {
        console.error('Error loading wallet image:', props.wallet.name, error)
      }
    }
  },
  { immediate: true },
)

const select = () => {
  analytics.trackConnectWalletEvent(ConnectWalletEvent.SELECT_WALLET, {
    walletName: props.wallet.name,
  })
  emit('select', props.wallet)
}
</script>
