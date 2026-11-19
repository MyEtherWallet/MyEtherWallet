<template>
  <div
    role="group"
    :aria-label="t('access_wallet.social.wallets_label')"
    class="flex gap-2"
  >
    <SignUpWalletTile
      v-for="wallet in wallets"
      :key="wallet.name"
      :wallet="wallet"
      @select="select"
    />
    <button
      type="button"
      data-testid="other-methods"
      :aria-label="t('access_wallet.social.other_methods')"
      :title="t('access_wallet.social.other_methods')"
      :class="SHORTCUT_CLASS"
      @click="openChooser"
    >
      <AppIcon name="wallet" />
    </button>
  </div>
</template>

<script setup lang="ts">
// Wallet row of the Log in / Sign Up view: the wallets picked for this user
// (the detected one, the most recent one, MEW's own, the key methods; see
// selectSignUpRowWallets), then one tile for every other method, which opens
// the chooser. A wallet tile connects exactly as it does from the chooser.
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/icon/AppIcon.vue'
import { analytics } from '@/analytics'
import { ConnectWalletEvent } from '@/analytics/events'
import { useWalletList } from '@/composables/useWalletList'
import type { WalletConfig } from '@/modules/access/common/walletConfigs'
import { useConnectWallet } from '@/modules/access/composables/useConnectWallet'
import { useAccessStore } from '@/stores/accessStore'
import SignUpWalletTile from './SignUpWalletTile.vue'

const { t } = useI18n()
const accessStore = useAccessStore()
const { signUpRowWallets } = useWalletList()
const { connect } = useConnectWallet()

const wallets = computed(() => signUpRowWallets())

const select = (wallet: WalletConfig): void => {
  void analytics.trackConnectWalletEvent(ConnectWalletEvent.SELECT_WALLET, {
    walletName: wallet.name,
  })
  void connect(wallet)
}

const openChooser = (): void => accessStore.setCurrentView('default')

const SHORTCUT_CLASS =
  'flex h-12 grow basis-0 cursor-pointer items-center justify-center rounded-12 bg-background-alternative text-icon-default transition-colors hover:bg-background-alternative-hover'
</script>
