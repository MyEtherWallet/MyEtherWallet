<template>
  <button
    type="button"
    class="flex w-full h-16 items-center gap-3 rounded-16 bg-background-default p-4 text-left transition-colors hover:bg-background-default-hover cursor-pointer"
    @click="select"
  >
    <!-- Round brand marks (Ledger, Trezor) already fill their circle; the wallet
         avatar would inset them as if they were square logos. -->
    <img
      v-if="wallet.roundIcon && iconUrl"
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import { analytics } from '@/analytics'
import { ConnectWalletEvent } from '@/analytics/events'
import type { WalletConfig } from '@/modules/access/common/walletConfigs'
import type { WalletStatus } from '@/modules/access/common/walletTabs'
import { useWalletIconUrl } from '@/modules/access/composables/useWalletIconUrl'

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
const iconUrl = useWalletIconUrl(() => props.wallet)

const select = () => {
  analytics.trackConnectWalletEvent(ConnectWalletEvent.SELECT_WALLET, {
    walletName: props.wallet.name,
  })
  emit('select', props.wallet)
}
</script>
