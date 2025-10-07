<template>
  <app-dialog
    v-model:is-open="isOpenAccessDialog"
    class="!max-w-[900px]"
    bg="bg-appBackground"
    has-title-underline
    @close-dialog="closeAccess()"
  >
    <template #title>
      <div
        class="flex flex-col sm:flex-row justify-start sm:items-center mt-5 pl-4 xs:pl-6"
      >
        <img
          src="@/assets/images/access/portfolio_icon.webp"
          alt=""
          width="100"
          height="100"
          class="w-[75px] h-[75px] flex-none hidden sm:block"
        />

        <div class="flex-initial sm:mt-0 sm:ml-4 border-primary mb-1">
          <h1 class="font-bold text-s-32 sm:text-s-40">Connect Wallet</h1>
          <app-need-help
            title="Need help accessing your wallet?"
            help-link="https://help.myetherwallet.com/en/articles/5377855-how-to-access-your-wallet-with-mew-portfolio"
          />
        </div>
      </div>
    </template>
    <template #content>
      <div
        class="px-4 xs:px-6 h-[calc(95vh-107px)] xs:h-[calc(95vh-150px)] !overflow-y-scroll pb-8"
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
import { useAccessStore } from '@/stores/accessStore'
import { storeToRefs } from 'pinia'
import ModuleAccessKeystore from './ModuleAccessKeystore.vue'
import ModuleAccessPrivateKey from './ModuleAccessPrivateKey.vue'
import ModuleAccessMnemonic from './ModuleAccessMnemonic.vue'
import ModuleAccessHardwareWallet from './ModuleAccessHardwareWallet.vue'
/**-------------------------------
 * Access Wallet Dialog
 -------------------------------*/

const accessStore = useAccessStore()
const { isOpenAccessDialog, currentView } = storeToRefs(accessStore)

const closeAccess = () => {
  accessStore.setCurrentView('default')
}
</script>
