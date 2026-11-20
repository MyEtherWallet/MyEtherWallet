<template>
  <app-modal
    v-model="bigDialogOpen"
    :title="getTitle"
    :show-back-button="showBack"
    :persistent="inLoginFlow && isPersistent"
    :aria-label="inLoginFlow ? t('access_wallet.social.title') : undefined"
    :class="[
      'w-full',
      dialogWidth,
      // Pin the top so switching network/tab/search grows the modal downward
      // instead of re-centering it. At full height the bottom gap matches the
      // top one: the overlay padding (16px) plus 5dvh, or 10vh from sm, so the
      // cap is 100dvh - 2 * (16px + offset).
      isNewView
        ? 'self-start mt-[5dvh] max-h-[calc(90dvh-32px)] sm:mt-[10vh] sm:max-h-[calc(80vh-32px)]'
        : 'max-h-[95vh] bg-background-default',
    ]"
    @back="goBack"
    @close="closeAccess()"
  >
    <!-- Steps not redesigned yet keep the help link under the title. -->
    <template v-if="!isNewView" #header>
      <div class="flex w-full flex-col items-center gap-1 px-8">
        <h1 class="text-center text-lg font-semibold leading-p-150 sm:text-xl">
          {{ getTitle }}
        </h1>
        <app-need-help
          :title="$t('access_wallet.help.default')"
          help-link="https://help.myetherwallet.com/en/articles/5377855-how-to-access-your-wallet-with-mew-portfolio"
        />
      </div>
    </template>
    <template #default>
      <!-- Height follows the measured content and animates between steps, like
           TheSettingsPopup. `clip` (not hidden) keeps the sticky footer working. -->
      <div
        class="overflow-clip"
        :style="{
          height: contentHeight > 0 ? `${contentHeight}px` : undefined,
          transition: 'height 400ms cubic-bezier(0.25, 0.1, 0, 1)',
        }"
      >
        <!-- The chooser and the address steps are capped at the room left under
             the title (the modal's max height above minus its 80px header), so
             only the wallet grid / address list shrinks and scrolls. If even its
             minimum doesn't fit, this scrolls. -->
        <div
          ref="contentRef"
          data-testid="access-content"
          class="flex flex-col px-4 pb-4 sm:px-6 sm:pb-6"
          :class="
            isCappedView &&
            'mew-scrollbar overflow-y-auto max-h-[calc(90dvh_-_112px)] sm:max-h-[calc(80vh_-_112px)]'
          "
        >
          <div
            v-if="currentView === 'default'"
            class="flex min-h-0 flex-col gap-4"
          >
            <NetworkChips :selected="selectedChain" @select="updateChain" />
            <WalletTabs />
            <div class="flex flex-col gap-4 pt-2">
              <AppDivider />
              <AccessCreateWallet v-model:expanded="isCreateWalletOpen" />
            </div>
          </div>
          <PrivyFlow v-else-if="inLoginFlow" />
          <AccessDownloadMobile v-else-if="currentView === 'download_mobile'" />
          <module-access-keystore v-else-if="currentView === 'keystore'" />
          <module-access-private-key
            v-else-if="currentView === 'private_key'"
          />
          <module-access-mnemonic v-else-if="currentView === 'mnemonic'" />
          <module-access-hardware-wallet
            v-else-if="currentView === 'ledger' || currentView === 'trezor'"
          />
          <module-access-wallet-connect
            v-else-if="currentView === 'wallet_connect'"
          />
          <module-access-web3-wallet
            v-else-if="currentView === 'web3_wallet'"
          />
        </div>
      </div>
    </template>
  </app-modal>
  <!-- Overlaid step: the extension's active address is already saved. (The
       "select the intended address" prompt now lives in the address popup.) -->
  <module-access-address-saved />
</template>
<script setup lang="ts">
import NetworkChips from '@/modules/access/components/NetworkChips.vue'
import WalletTabs from '@/modules/access/components/WalletTabs.vue'
import AccessCreateWallet from '@/modules/access/components/AccessCreateWallet.vue'
import PrivyFlow from '@/modules/access/components/privy/PrivyFlow.vue'
import { usePrivyOnboarding } from '@/modules/access/composables/usePrivyOnboarding'
import AccessDownloadMobile from '@/modules/access/components/AccessDownloadMobile.vue'
import AppNeedHelp from '@/components/AppNeedHelp.vue'
import AppDivider from '@/components/divider/AppDivider.vue'
import {
  FIRST_ACCESS_VIEW,
  isAccessHubView,
  type AccessHubView,
} from '@/modules/access/common/accessViews'
import type { WalletView } from '@/modules/access/common/walletConfigs'
import AppModal from '@/components/modal/AppModal.vue'
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
import { computed, ref, watch } from 'vue'
import { useWalletFlowUrlSync } from '@/composables/useWalletFlowRoute'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useResizeObserver } from '@vueuse/core'

const { t } = useI18n()

/**-------------------------------
 * Access Wallet Dialog
 -------------------------------*/
const accessStore = useAccessStore()
const {
  isOpenAccessDialog,
  currentView,
  accessStep,
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

/**-------------------------------
 * Google / email login (the sign-up view)
 * The flow owns its own screens, so it decides the title, where Back leads
 * and whether the modal may be closed.
 -------------------------------*/
const {
  state: loginState,
  backTarget,
  isPersistent,
  back: loginBack,
  cancel: cancelLogin,
} = usePrivyOnboarding()
const inLoginFlow = computed(() => currentView.value === FIRST_ACCESS_VIEW)
// Log in / Sign Up is the first screen: it has a Back only on its own later
// screens. Every other view leads back to where it was opened from.
const showBack = computed(() =>
  inLoginFlow.value ? backTarget.value !== null : true,
)

/**-------------------------------
 * Where Back leads from a step
 * A step is opened from Log in / Sign Up (its wallet row) or from the wallet
 * chooser, and Back returns there. A step reached any other way (a link, a
 * reload, a saved wallet being reconnected) goes back to the first screen.
 -------------------------------*/
const openedFrom = ref<AccessHubView>(FIRST_ACCESS_VIEW)
// Both are watched so the opening itself can be told apart: a caller that
// opens the dialog and names a step in the same breath did not come from the
// chooser, whatever view the closed dialog was left on.
watch(
  [isOpenAccessDialog, currentView],
  ([open, view], [wasOpen, previous]) => {
    if (!open || !wasOpen) return
    if (!isAccessHubView(view) && isAccessHubView(previous)) {
      openedFrom.value = previous
    }
  },
)

/**-------------------------------
 * "Don't have a wallet?" (under the chooser)
 * Its list of wallets to create stays open across a trip to the MEW Mobile
 * download step, whose Back returns here.
 -------------------------------*/
const isCreateWalletOpen = ref(false)

// However the dialog closes (its own buttons, browser Back, a link elsewhere)
// the login flow is told, so nothing carries on behind a closed modal and the
// next open starts clean.
watch(isOpenAccessDialog, open => {
  if (open) return
  void cancelLogin()
  isCreateWalletOpen.value = false
  openedFrom.value = FIRST_ACCESS_VIEW
})

const closeAccess = () => {
  accessStore.setCurrentView('default')
}

const goBack = () => {
  if (inLoginFlow.value) {
    loginBack()
    return
  }
  if (accessStep.value > 1) {
    accessStep.value -= 1
    return
  }
  accessStore.setCurrentView(
    currentView.value === 'default' ? FIRST_ACCESS_VIEW : openedFrom.value,
  )
}

/** Views built on the new onboarding design (white surface, no help link). */
const NEW_VIEWS: WalletView[] = [
  'default',
  'sign_up',
  'download_mobile',
  'wallet_connect',
  'keystore',
  'mnemonic',
  'private_key',
  'ledger',
  'trezor',
]
const isNewView = computed(() => NEW_VIEWS.includes(currentView.value))
// Views with a list that shrinks to fit (see the content wrapper). The others
// scroll in the dialog itself, which their sticky footers need.
const CAPPED_VIEWS: WalletView[] = ['default', 'mnemonic', 'ledger', 'trezor']
const isCappedView = computed(() => CAPPED_VIEWS.includes(currentView.value))

// Every redesigned step keeps the chooser's width so the modal doesn't jump.
const dialogWidth = computed(() =>
  isNewView.value ? 'max-w-[560px]' : '!max-w-[900px]',
)

/** Measured content height, animated by the wrapper in the content slot. */
const contentRef = ref<HTMLElement | null>(null)
const contentHeight = ref(0)
useResizeObserver(contentRef, () => {
  contentHeight.value = contentRef.value?.offsetHeight ?? 0
})

/**-------------------------------
 * Access Wallet Dialog
 -------------------------------*/
const { selectedChain } = storeToRefs(accessStore)
const chainsStore = useChainsStore()
const { selectedChain: storeSelectedChain, chains } = storeToRefs(chainsStore)
const globalStore = useGlobalStore()
const route = useRoute()
const router = useRouter()

/** The active network pill, remembered in the URL (?walletNetwork=) like the tab. */
const routeChain = computed(() =>
  chains.value.find(chain => chain.name === route.query.walletNetwork),
)

const updateChain = (chain: Chain) => {
  accessStore.setSelectedChain(chain)
  globalStore.setSelectedNetwork(chain.name)
  if (route.meta.walletFlow === 'access') {
    void router.replace({
      query: { ...route.query, walletNetwork: chain.name },
    })
  }
}

watch(
  () => isOpenAccessDialog.value,
  (newVal: boolean) => {
    const chain = routeChain.value ?? storeSelectedChain.value
    if (newVal && chain) {
      accessStore.setSelectedChain(chain)
    }
  },
)

// On a refresh the chain list can arrive after the dialog opened.
watch(routeChain, chain => {
  if (
    isOpenAccessDialog.value &&
    chain &&
    chain.name !== selectedChain.value?.name
  ) {
    accessStore.setSelectedChain(chain)
  }
})

// Callers open this dialog by store flag, so the URL is synced from here — the one
// component that owns it. See useWalletFlowUrlSync.
useWalletFlowUrlSync(isOpenAccessDialog, 'access', currentView)

/**-------------------------------
 * UI Elements
 -------------------------------*/
/** Header title per step for the advanced (multi-step) access flows. */
const ADVANCED_TITLES: Partial<Record<WalletView, string[]>> = {
  keystore: [
    'access_wallet.advanced.keystore_title',
    'access_wallet.advanced.password_title',
  ],
  mnemonic: [
    'access_wallet.advanced.phrase_title',
    'access_wallet.advanced.address_title',
  ],
  private_key: ['access_wallet.advanced.private_key_title'],
  ledger: [
    'access_wallet_ledger.step.step1.title',
    'access_wallet.advanced.address_title',
  ],
  trezor: [
    'access_wallet_trezor.step.step1.title',
    'access_wallet.advanced.address_title',
  ],
}

const getTitle = computed(() => {
  // Only the first login screens carry a title; the later ones name
  // themselves in their content.
  if (inLoginFlow.value) {
    return loginState.value === 'entry' || loginState.value === 'existing_login'
      ? t('access_wallet.social.title')
      : ''
  }
  // The chooser is part of logging in, so it carries the same title.
  if (currentView.value === 'default') {
    return t('access_wallet.social.title')
  }
  if (currentView.value === 'download_mobile') {
    return t('access_wallet.download_mobile.title')
  }
  const stepTitle = ADVANCED_TITLES[currentView.value]?.[accessStep.value - 1]
  if (stepTitle) return t(stepTitle)
  let method = ''
  switch (currentView.value) {
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
</script>
