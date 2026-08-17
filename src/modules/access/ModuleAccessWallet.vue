<template>
  <app-dialog
    v-model:is-open="bigDialogOpen"
    :class="[
      'w-full max-h-[95vh]',
      currentView === 'mnemonic' ||
      currentView === 'keystore' ||
      currentView === 'private_key'
        ? 'max-w-[800px]'
        : '!max-w-[900px]',
    ]"
    bg="bg-appBackground"
    has-title-underline
    @close-dialog="closeAccess()"
  >
    <template #title>
      <div class="flex w-full flex-col sm:flex-row px-4 xs:px-6">
        <div class="w-8 sm:ml-[-12px]">
          <app-btn-icon
            v-if="currentView !== 'default'"
            icon="icon-arrow-left"
            :label="$t('access_wallet.back_to_connect_options')"
            class="!w-10 !h-10 mr-auto mt-4"
            @click="accessStore.setCurrentView('default')"
          >
            <arrow-right-icon class="w-5 h-5 rotate-180" />
          </app-btn-icon>
        </div>
        <div
          :class="
            currentView === 'default'
              ? 'mt-4 sm:items-center justify-center'
              : 'sm:items-center justify-center'
          "
          class="flex flex-col w-full sm:mt-6 sm:mb-2"
        >
          <h1 class="font-bold text-s-28 sm:text-s-32 mb-1 leading-p-120">
            {{ getTitle }}
          </h1>
          <app-need-help
            :title="helpLinkText"
            help-link="https://help.myetherwallet.com/en/articles/5377855-how-to-access-your-wallet-with-mew-portfolio"
          />
        </div>
      </div>
    </template>
    <template #content>
      <div class="px-4 xs:px-6 pb-6">
        <div v-if="currentView === 'default'">
          <div class="flex flex-row flex-wrap my-5 gap-y-5 gap-x-[54px]">
            <div>
              <h2 class="text-s-28 font-semibold mb-2 md:ml-3">
                {{ $t('common.select_network') }}
              </h2>
              <select-chain-for-app
                is-btn-group
                :can-store="false"
                :preselected-chain="selectedChain"
                @update:selected-chain="updateChain"
              />
            </div>
          </div>
          <WalletsDefaultList class="mt-10 mb-12" />
          <WalletsList />
        </div>
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
import WalletsDefaultList from '@/modules/access/components/wallets_lists/WalletsListDefault.vue'
import WalletsList from '@/modules/access/components/wallets_lists/WalletsList.vue'
import AppNeedHelp from '@/components/AppNeedHelp.vue'
import SelectChainForApp from '@/components/select_chain/SelectChainForApp.vue'
import AppDialog from '@/components/AppDialog.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
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

/**-------------------------------
 * UI Elements
 -------------------------------*/
const getTitle = computed(() => {
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
