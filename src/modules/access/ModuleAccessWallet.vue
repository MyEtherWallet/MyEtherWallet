<template>
  <app-dialog
    v-model:is-open="bigDialogOpen"
    :class="[
      'w-full max-h-[95vh]',
      dialogWidth,
      // Pin the top so switching network/tab/search grows the modal downward
      // instead of re-centering it. 36px container padding + 10vh offset.
      isNewView && 'self-start sm:mt-[10vh] sm:max-h-[calc(90vh-72px)]',
    ]"
    :bg="isNewView ? 'bg-white' : 'bg-background-default'"
    :has-title-underline="!isNewView"
    hide-close
    @close-dialog="closeAccess()"
  >
    <template #title>
      <div class="flex w-full flex-col gap-1 px-4 pt-4 sm:px-6 sm:pt-6">
        <header class="flex w-full items-center gap-2">
          <app-btn-icon
            v-if="currentView !== 'default'"
            variant="filled"
            size="m"
            :label="$t('common.back')"
            class="shrink-0"
            @click="goBack"
          >
            <AppIcon name="chevron-left" size="xs" />
          </app-btn-icon>
          <span v-else class="size-8 shrink-0" aria-hidden="true" />
          <h1
            class="grow text-center text-lg font-semibold leading-p-150 sm:text-xl"
          >
            {{ getTitle }}
          </h1>
          <app-btn-icon
            variant="filled"
            size="m"
            :label="$t('common.close')"
            class="shrink-0"
            @click="closeDialog"
          >
            <AppIcon name="x-mark" size="xs" />
          </app-btn-icon>
        </header>
        <app-need-help
          v-if="!isNewView"
          class="self-center"
          :title="helpLinkText"
          help-link="https://help.myetherwallet.com/en/articles/5377855-how-to-access-your-wallet-with-mew-portfolio"
        />
      </div>
    </template>
    <template #content>
      <div class="px-4 pb-4 pt-4 sm:px-6 sm:pb-6">
        <div v-if="currentView === 'default'" class="flex flex-col gap-4">
          <NetworkChips :selected="selectedChain" @select="updateChain" />
          <WalletTabs />
          <div class="sticky bottom-0 flex flex-col gap-4 bg-white pt-2">
            <AppDivider />
            <AccessCell :title="$t('common.dont_have_wallet')">
              <template #avatar>
                <AppAvatar type="icon" size="m">
                  <template #icon><AppIcon name="plus" size="xs" /></template>
                </AppAvatar>
              </template>
              <template #trailing>
                <AppBaseButton
                  theme="secondary"
                  size="small"
                  @click="accessStore.setCurrentView('sign_up')"
                >
                  {{ $t('access_wallet.sign_up.cta') }}
                </AppBaseButton>
              </template>
            </AccessCell>
          </div>
        </div>
        <AccessSignUp v-else-if="currentView === 'sign_up'" />
        <AccessDownloadMobile v-else-if="currentView === 'download_mobile'" />
        <module-access-keystore v-else-if="currentView === 'keystore'" />
        <module-access-private-key v-else-if="currentView === 'private_key'" />
        <module-access-mnemonic v-else-if="currentView === 'mnemonic'" />
        <module-access-hardware-wallet
          v-else-if="currentView === 'ledger' || currentView === 'trezor'"
        />
        <module-access-wallet-connect
          v-else-if="currentView === 'wallet_connect'"
        />
        <module-access-web3-wallet v-else-if="currentView === 'web3_wallet'" />
      </div>
    </template>
  </app-dialog>
  <!-- Overlaid step: the extension's active address is already saved. (The
       "select the intended address" prompt now lives in the address popup.) -->
  <module-access-address-saved />
</template>
<script setup lang="ts">
import NetworkChips from '@/modules/access/components/NetworkChips.vue'
import WalletTabs from '@/modules/access/components/WalletTabs.vue'
import AccessCell from '@/modules/access/components/AccessCell.vue'
import AccessSignUp from '@/modules/access/components/AccessSignUp.vue'
import AccessDownloadMobile from '@/modules/access/components/AccessDownloadMobile.vue'
import AppNeedHelp from '@/components/AppNeedHelp.vue'
import AppDivider from '@/components/divider/AppDivider.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { parentView } from '@/modules/access/common/accessViews'
import type { WalletView } from '@/modules/access/common/walletConfigs'
import AppDialog from '@/components/AppDialog.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import { type Chain } from '@/mew_api/types'
import { useAccessStore } from '@/stores/accessStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useGlobalStore } from '@/stores/globalStore'
import { storeToRefs } from 'pinia'
import ModuleAccessKeystore from './ModuleAccessKeystore.vue'
import ModuleAccessPrivateKey from './ModuleAccessPrivateKey.vue'
import ModuleAccessMnemonic from './ModuleAccessMnemonic.vue'
import ModuleAccessHardwareWallet from './ModuleAccessHardwareWallet.vue'
import ModuleAccessWalletConnect from './ModuleAccessWalletConnect.vue'
import ModuleAccessWeb3Wallet from './ModuleAccessWeb3Wallet.vue'
import ModuleAccessAddressSaved from './ModuleAccessAddressSaved.vue'
import { computed, watch } from 'vue'
import { useWalletFlowUrlSync } from '@/composables/useWalletFlowRoute'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

/**-------------------------------
 * Access Wallet Dialog
 -------------------------------*/
const accessStore = useAccessStore()
const {
  isOpenAccessDialog,
  currentView,
  clickedWeb3Wallet,
  addressSavedInfo,
  connectAddressInfo,
} = storeToRefs(accessStore)

// Hide the big chooser while an overlaid step modal is up so only it shows; keep
// isOpenAccessDialog true so the modal's back button restores the chooser.
const bigDialogOpen = computed<boolean>({
  get: () =>
    isOpenAccessDialog.value &&
    !addressSavedInfo.value &&
    !connectAddressInfo.value,
  set: v => {
    isOpenAccessDialog.value = v
  },
})

const closeAccess = () => {
  accessStore.setCurrentView('default')
}

// Same as a backdrop close: hide and reset the view, but keep the add-account
// intent (closeAccessDialog would clear it).
const closeDialog = () => {
  bigDialogOpen.value = false
  closeAccess()
}

const goBack = () => {
  accessStore.setCurrentView(parentView(currentView.value))
}

/** Views built on the new onboarding design (white surface, no help link). */
const NEW_VIEWS: WalletView[] = ['default', 'sign_up', 'download_mobile']
const isNewView = computed(() => NEW_VIEWS.includes(currentView.value))

// Existing method views keep their widths until MEW-2338 restyles them.
const dialogWidth = computed(() => {
  switch (currentView.value) {
    case 'default':
    case 'sign_up':
      return 'max-w-[560px]'
    case 'download_mobile':
      return 'max-w-[480px]'
    case 'mnemonic':
    case 'keystore':
    case 'private_key':
      return 'max-w-[800px]'
    default:
      return '!max-w-[900px]'
  }
})

/**-------------------------------
 * Access Wallet Dialog
 -------------------------------*/
const { selectedChain } = storeToRefs(accessStore)
const chainsStore = useChainsStore()
const { selectedChain: storeSelectedChain } = storeToRefs(chainsStore)
const globalStore = useGlobalStore()

const updateChain = (chain: Chain) => {
  accessStore.setSelectedChain(chain)
  globalStore.setSelectedNetwork(chain.name)
}

watch(
  () => isOpenAccessDialog.value,
  (newVal: boolean) => {
    if (newVal && storeSelectedChain.value) {
      accessStore.setSelectedChain(storeSelectedChain.value)
    }
  },
)

// Callers open this dialog by store flag, so the URL is synced from here — the one
// component that owns it. See useWalletFlowUrlSync.
useWalletFlowUrlSync(isOpenAccessDialog, 'access', currentView)

/**-------------------------------
 * UI Elements
 -------------------------------*/
const getTitle = computed(() => {
  if (currentView.value === 'default' || currentView.value === 'sign_up') {
    return t('access_wallet.login_title')
  }
  if (currentView.value === 'download_mobile') {
    return t('access_wallet.download_mobile.title')
  }
  let method = ''
  switch (currentView.value) {
    case 'keystore':
      method = t('access_wallet.method.keystore')
      break
    case 'private_key':
      method = t('access_wallet.method.private_key')
      break
    case 'mnemonic':
      method = t('access_wallet.method.mnemonic_phrase')
      break
    case 'ledger':
      method = 'Ledger'
      break
    case 'trezor':
      method = 'Trezor'
      break
    case 'wallet_connect':
    case 'web3_wallet':
      method = clickedWeb3Wallet.value?.name || ''
      break
    default:
      method = ''
      break
  }
  return method
    ? t('access_wallet.connect_with', { method })
    : t('access_wallet.connect_wallet_title')
})

const helpLinkText = computed(() => {
  switch (currentView.value) {
    case 'keystore':
      return t('access_wallet.help.keystore')
    case 'private_key':
      return t('access_wallet.help.private_key')
    case 'mnemonic':
      return t('access_wallet.help.mnemonic')
    case 'ledger':
      return t('access_wallet.help.ledger')
    case 'trezor':
      return t('access_wallet.help.trezor')
    default:
      return t('access_wallet.help.default')
  }
})
</script>
