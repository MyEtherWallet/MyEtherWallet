<script setup lang="ts">
// Wallet row of the sign-up view (Figma Onboarding, Variant A): the first
// wallets of the chooser's Popular list (recent and installed ones lead it),
// then two shortcuts into the chooser. A wallet tile connects exactly as it
// does from the chooser.
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import AppIcon from '@/components/icon/AppIcon.vue'
import { analytics } from '@/analytics'
import { ConnectWalletEvent } from '@/analytics/events'
import { useWalletList } from '@/composables/useWalletList'
import type { WalletConfig } from '@/modules/access/common/walletConfigs'
import { useConnectWallet } from '@/modules/access/composables/useConnectWallet'
import { useAccessStore } from '@/stores/accessStore'
import SignUpWalletTile from './SignUpWalletTile.vue'

/** How many wallets fit beside the two shortcut tiles. */
const WALLET_COUNT = 3

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const accessStore = useAccessStore()
const { walletsForTab } = useWalletList()
const { connect } = useConnectWallet()

const wallets = computed(() =>
  walletsForTab('popular')
    .slice(0, WALLET_COUNT)
    .map(entry => entry.wallet),
)

const select = (wallet: WalletConfig): void => {
  void analytics.trackConnectWalletEvent(ConnectWalletEvent.SELECT_WALLET, {
    walletName: wallet.name,
  })
  void connect(wallet)
}

const openChooser = (): void => accessStore.setCurrentView('default')

/** The chooser's tab lives in the URL, so set it before switching views. */
const openAdvanced = async (): Promise<void> => {
  if (route.meta.walletFlow === 'access') {
    await router.replace({
      query: { ...route.query, type: 'default', walletTab: 'advanced' },
    })
  }
  openChooser()
}

const SHORTCUT_CLASS =
  'flex h-12 grow basis-0 cursor-pointer items-center justify-center rounded-12 bg-background-alternative text-icon-default transition-colors hover:bg-background-alternative-hover'
</script>

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
      data-testid="more-methods"
      :aria-label="t('access_wallet.social.more_methods')"
      :title="t('access_wallet.social.more_methods')"
      :class="SHORTCUT_CLASS"
      @click="openAdvanced"
    >
      <AppIcon name="key" />
    </button>
    <button
      type="button"
      data-testid="all-wallets"
      :aria-label="t('access_wallet.social.all_wallets')"
      :title="t('access_wallet.social.all_wallets')"
      :class="SHORTCUT_CLASS"
      @click="openChooser"
    >
      <AppIcon name="wallet" />
    </button>
  </div>
</template>
