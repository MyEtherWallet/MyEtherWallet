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

import { ROUTES_WALLET } from '@/router/routeNames'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { getBufferFromHex, sanitizeHex } from '@/modules/access/common/helpers'
import PrivateKeyWallet from '@/providers/ethereum/privateKeyWallet'
import AppBaseButton from '@/components/AppBaseButton.vue'

import { isPrivateKey } from '@/modules/access/common/helpers'
import AppInput from '@/components/AppInput.vue'
import AppNotRecommended from '@/components/AppNotRecommended.vue'
import { hexToBytes } from 'viem'
import { walletConfigs } from '@/modules/access/common/walletConfigs'
import { useRecentWalletsStore } from '@/stores/recentWalletsStore'

const privateKeyInput = ref('')

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
  const privateKey = Buffer.isBuffer(strippedHexPrivateKey.value)
    ? strippedHexPrivateKey.value
    : getBufferFromHex(sanitizeHex(strippedHexPrivateKey.value))
  return isPrivateKey(privateKeyInput.value) && isValidPrivate(privateKey)
})

const unlock = () => {
  // TODO: remove hardcoded network id
  try {
    const wallet = new PrivateKeyWallet(
      Buffer.from(hexToBytes(`0x${strippedHexPrivateKey.value}`)),
      selectedChain?.value.chainID || '1',
    )
    setWallet(wallet)
    addWallet(walletConfigs.privateKey)
    privateKeyInput.value = ''
    router.push({ path: ROUTES_WALLET.WALLET.PATH })
  } catch (error) {
    // TODO: handle error when toast is implemented
    console.error(error)
  }
}
</script>
