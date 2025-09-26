<template>
  <div>
    <div class="mt-5 flex flex-col align-center">
      <app-input
        v-model="privateKeyInput"
        placeholder="Enter your private key"
        type="password"
        :required="true"
        aria-label="private key input"
        @keyup.enter="unlock"
        :error-message="errorMessages"
      />
      <div class="flex align-center justify-center">
        <app-base-button @click="unlock" :disabled="submitIsDisabled">
          Access Wallet
        </app-base-button>
      </div>
    </div>
  </div>

  <app-not-recommended />
</template>

<script setup lang="ts">
import { isValidPrivate } from '@ethereumjs/util'

import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { ROUTES_MAIN } from '@/router/routeNames'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
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
import { useAccessRedirectStore } from '@/stores/accessRedirectStore'
import { decode } from 'wif'
import bs58check from 'bs58check'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import type { WalletInterface } from '@/providers/common/walletInterface'

const toastStore = useToastStore()
const { addToastMessage } = toastStore
const privateKeyInput = ref('')
const accessRedirectStore = useAccessRedirectStore()
const walletStore = useWalletStore()
const router = useRouter()
const { setWallet } = walletStore
const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)

const recentWalletsStore = useRecentWalletsStore()
const { addWallet } = recentWalletsStore

const submitIsDisabled = computed<boolean>(() => {
  return privateKeyInput.value === '' || !isValidPrivateKey.value
})

const errorMessages = computed<string>(() => {
  if (privateKeyInput.value === '') {
    return 'Required'
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
    if (selectedChain.value?.type === 'EVM') {
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
    if (selectedChain.value?.type === 'EVM') {
      new EthereumPrivateKey(
        Buffer.from(hexToBytes(`0x${strippedHexPrivateKey.value}`)),
        selectedChain?.value?.chainID || '1',
      )
    } else if (selectedChain.value?.type === 'BITCOIN') {
      const decoded = bs58check.decode(strippedHexPrivateKey.value)
      const rawPrivKey = decoded.slice(1, 33)
      wallet = new BitcoinPrivateKey(selectedChain?.value?.name || 'BITCOIN', {
        privateKey: Buffer.from(Buffer.from(rawPrivKey)),
      })
    }

    setWallet(wallet as WalletInterface)
    addWallet(walletConfigs.privateKey)
    privateKeyInput.value = ''
    router.push({
      name: accessRedirectStore.lastVisitedRouteName || ROUTES_MAIN.HOME.NAME,
    })
  } catch (error) {
    addToastMessage({
      text: (error as Error).message
        ? (error as Error).message
        : 'There was an error creating the wallet. Please try again.',
      type: ToastType.Error,
    })
  }
}
</script>
