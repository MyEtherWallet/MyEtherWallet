<template>
  <div class="flex justify-center w-full">
    <div
      class="max-w-[640px] w-full flex flex-col items-center justify-center sm:pt-3"
    >
      <app-not-recommended />
      <app-sheet class="mt-1">
        <div class="mt-5 flex flex-col align-center">
          <app-input
            v-model="privateKeyInput"
            placeholder="Enter your private key"
            type="password"
            is-required
            aria-label="private key input"
            @keyup.enter="unlock"
            :error-message="errorMessages"
          />
          <div class="flex align-center justify-center">
            <app-base-button
              @click="unlock"
              :disabled="submitIsDisabled"
              class="w-full xs:w-auto xs:min-w-[250px]"
            >
              Connect
            </app-base-button>
          </div>
        </div>
      </app-sheet>
      <!-- TODO: add link-->
      <ButtonNoWallet class="mt-5" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { isValidPrivate } from '@ethereumjs/util'
import ButtonNoWallet from './components/ButtonNoWallet.vue'
import AppSheet from '@/components/AppSheet.vue'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '@/stores/walletStore'
import { getBufferFromHex, sanitizeHex } from '@/modules/access/common/helpers'
import EthereumPrivateKey from '@/providers/ethereum/privateKeyWallet'
import BitcoinPrivateKey from '@/providers/bitcoin/privateKeyWallet'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { isPrivateKey } from '@/modules/access/common/helpers'
import AppInput from '@/components/AppInput.vue'
import AppNotRecommended from '@/components/AppNotRecommended.vue'
import { hexToBytes } from '@ethereumjs/util'
import { walletConfigs } from '@/modules/access/common/walletConfigs'
import { useRecentWalletsStore } from '@/stores/recentWalletsStore'
import { decode } from 'wif'
import bs58check from 'bs58check'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import type { WalletInterface } from '@/providers/common/walletInterface'
import { useAccessStore } from '@/stores/accessStore'
import { useGlobalStore } from '@/stores/globalStore'

const toastStore = useToastStore()
const { addToastMessage } = toastStore
const privateKeyInput = ref('')
const accessStore = useAccessStore()
const { selectedChain, isEvmChain, isBitcoinChain } = storeToRefs(accessStore)
const globalStore = useGlobalStore()
const { setSelectedNetwork: setSelectedChainGlobalStore } = globalStore

const walletStore = useWalletStore()
const { setWallet } = walletStore

const recentWalletsStore = useRecentWalletsStore()
const { addWallet } = recentWalletsStore

const submitIsDisabled = computed<boolean>(() => {
  return privateKeyInput.value === '' || !isValidPrivateKey.value
})

const errorMessages = computed<string>(() => {
  //Error will be thrown by input component if empty
  if (privateKeyInput.value === '') {
    return ''
  }

  if (!isValidPrivateKey.value) {
    return 'Invalid private key'
  }

  return ''
})

const strippedHexPrivateKey = computed<string>(() => {
  return privateKeyInput.value.substr(0, 2) === '0x'
    ? privateKeyInput.value.replace('0x', '')
    : privateKeyInput.value
})

const isValidPrivateKey = computed<boolean>(() => {
  try {
    if (isEvmChain.value) {
      const privateKey = Buffer.isBuffer(strippedHexPrivateKey.value)
        ? strippedHexPrivateKey.value
        : getBufferFromHex(sanitizeHex(strippedHexPrivateKey.value))
      return isPrivateKey(privateKeyInput.value) && isValidPrivate(privateKey)
    }
    decode(strippedHexPrivateKey.value)
    return true
  } catch {
    return false
  }
})

const unlock = () => {
  // TODO: remove hardcoded network id
  let wallet
  try {
    if (isEvmChain.value) {
      wallet = new EthereumPrivateKey(
        Buffer.from(hexToBytes(`0x${strippedHexPrivateKey.value}`)),
        selectedChain?.value?.chainID || '1',
      )
    } else if (isBitcoinChain.value) {
      const decoded = bs58check.decode(strippedHexPrivateKey.value)
      const rawPrivKey = decoded.slice(1, 33)
      wallet = new BitcoinPrivateKey(selectedChain?.value?.name || 'BITCOIN', {
        privateKey: Buffer.from(Buffer.from(rawPrivKey)),
      })
    }

    setWallet(wallet as WalletInterface)
    addWallet(walletConfigs.privateKey)
    setSelectedChainGlobalStore(selectedChain.value?.name || '')
    privateKeyInput.value = ''
    accessStore.setCurrentView('default')
    accessStore.closeAccessDialog()
  } catch (error) {
    addToastMessage({
      text: 'Something went wrong',
      textSecondary: (error as Error).message
        ? (error as Error).message
        : 'There was an error accessing the wallet. Please try again.',
      type: ToastType.Error,
    })
  }
}
</script>
