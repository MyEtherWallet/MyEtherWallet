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
      <!-- Height follows the measured content and animates between steps, like
           TheSettingsPopup. `clip` (not hidden) keeps the sticky footer working. -->
      <div
        class="overflow-clip"
        :style="{
          height: contentHeight > 0 ? `${contentHeight}px` : undefined,
          transition: 'height 400ms cubic-bezier(0.25, 0.1, 0, 1)',
        }"
      >
        <div ref="contentRef" class="px-4 pb-4 pt-4 sm:px-6 sm:pb-6">
          <div v-if="currentView === 'default'" class="flex flex-col gap-4">
            <NetworkChips :selected="selectedChain" @select="updateChain" />
            <WalletTabs />
            <div class="flex flex-col gap-4 pt-2">
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
  if (accessStep.value > 1) {
    accessStep.value -= 1
    return
  }
  accessStore.setCurrentView(parentView(currentView.value))
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
]
const isNewView = computed(() => NEW_VIEWS.includes(currentView.value))

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
}

const getTitle = computed(() => {
  if (currentView.value === 'default' || currentView.value === 'sign_up') {
    return t('access_wallet.login_title')
  }
  if (currentView.value === 'download_mobile') {
    return t('access_wallet.download_mobile.title')
  }
  const stepTitle = ADVANCED_TITLES[currentView.value]?.[accessStep.value - 1]
  if (stepTitle) return t(stepTitle)
  let method = ''
  switch (currentView.value) {
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
    case 'ledger':
      return t('access_wallet.help.ledger')
    case 'trezor':
      return t('access_wallet.help.trezor')
    default:
      return t('access_wallet.help.default')
  }
})
</script>
