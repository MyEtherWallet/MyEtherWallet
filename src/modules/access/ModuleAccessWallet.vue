<template>
  <app-dialog
    v-model:is-open="isOpenAccessDialog"
    class="!max-w-[900px]"
    bg="bg-appBackground"
    has-title-underline
    @close-dialog="closeAccess()"
  >
    <template #title>
      <div class="flex w-full flex-col sm:flex-row">
        <div class="ml-4 w-8">
          <app-btn-icon
            v-if="currentView !== 'default'"
            icon="icon-arrow-left"
            label="back to connect options"
            class="!w-10 !h-10 mr-auto mt-4"
            @click="accessStore.setCurrentView('default')"
          >
            <arrow-right-icon class="w-5 h-5 rotate-180" />
          </app-btn-icon>
        </div>
        <div
          :class="currentView === 'default' ? 'ml-4 mt-4 sm:ml-0' : ''"
          class="flex flex-col sm:items-center justify-start sm:justify-center pl-4 xs:pl-6 w-full sm:mt-4 sm:mb-2"
        >
          <h1
            class="font-bold text-s-28 sm:text-s-32 mb-3 sm:mb-1 leading-p-120"
          >
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
      <div
        class="px-4 xs:px-6 h-[calc(96vh-190px)] sm:h-[calc(100vh-104px)] !overflow-y-scroll pb-6"
      >
        <div v-if="currentView === 'default'">
          <div class="flex flex-row flex-wrap my-5 gap-y-5 gap-x-[54px]">
            <div>
              <h2 class="text-s-28 font-semibold mb-2 md:ml-3">
                {{ $t('common.select_network') }}
              </h2>
              <select-chain-for-app is-btn-group />
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
      </div>
    </template>
  </app-dialog>
</template>
<script setup lang="ts">
import WalletsDefaultList from '@/modules/access/components/wallets_lists/WalletsListDefault.vue'
import WalletsList from '@/modules/access/components/wallets_lists/WalletsList.vue'
import AppNeedHelp from '@/components/AppNeedHelp.vue'
import SelectChainForApp from '@/components/select_chain/SelectChainForApp.vue'
import AppDialog from '@/components/AppDialog.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import { ArrowRightIcon } from '@heroicons/vue/24/outline'

import { useAccessStore } from '@/stores/accessStore'
import { storeToRefs } from 'pinia'
import ModuleAccessKeystore from './ModuleAccessKeystore.vue'
import ModuleAccessPrivateKey from './ModuleAccessPrivateKey.vue'
import ModuleAccessMnemonic from './ModuleAccessMnemonic.vue'
import ModuleAccessHardwareWallet from './ModuleAccessHardwareWallet.vue'
import { computed } from 'vue'

/**-------------------------------
 * Access Wallet Dialog
 -------------------------------*/
const accessStore = useAccessStore()
const { isOpenAccessDialog, currentView } = storeToRefs(accessStore)

const closeAccess = () => {
  accessStore.setCurrentView('default')
}
/**-------------------------------
 * UI Elements
 -------------------------------*/
const getTitle = computed(() => {
  let method = ''
  switch (currentView.value) {
    case 'keystore':
      method = 'keystore'
      break
    case 'private_key':
      method = 'private key'
      break
    case 'mnemonic':
      method = 'mnemonic phrase'
      break
    case 'ledger':
      method = 'Ledger'
      break
    case 'trezor':
      method = 'Trezor'
      break
    default:
      method = ''
      break
  }
  return method ? `Connect with ${method}` : 'Connect Wallet'
})

const helpLinkText = computed(() => {
  switch (currentView.value) {
    case 'keystore':
      return 'How to connect your keystore wallet'
    case 'private_key':
      return 'How to connect with your private key'
    case 'mnemonic':
      return 'How to connect with your recovery phrase'
    case 'ledger':
      return 'How to connect your Ledger wallet'
    case 'trezor':
      return 'How to connect your Trezor wallet'
    default:
      return 'Need Help connecting your wallet?'
  }
})
</script>
