<template>
  <div class="flex justify-center w-full">
    <div
      class="max-w-[624px] flex flex-col items-center justify-center sm:pt-3"
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
      <div
        class="mt-5 block text-info text-s-14 sm:text-s-17 leading-p-150 hoverOpacity"
      >
        {{ $t('wc_dialog.no_wallet') }}
        <span class="underline">
          {{ $t('wc_dialog.get_wallet') }}
          <span class="text-sm"> →</span></span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isValidPrivate } from '@ethereumjs/util'
import AppSheet from '@/components/AppSheet.vue'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { getBufferFromHex, sanitizeHex } from '@/modules/access/common/helpers'
import PrivateKeyWallet from '@/providers/ethereum/privateKeyWallet'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { isPrivateKey } from '@/modules/access/common/helpers'
import AppInput from '@/components/AppInput.vue'
import AppNotRecommended from '@/components/AppNotRecommended.vue'
import { hexToBytes } from '@ethereumjs/util'
import { walletConfigs } from '@/modules/access/common/walletConfigs'
import { useRecentWalletsStore } from '@/stores/recentWalletsStore'
import { useAccessStore } from '@/stores/accessStore'

const privateKeyInput = ref('')
const accessStore = useAccessStore()
const walletStore = useWalletStore()
const { setWallet } = walletStore
const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)

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
      selectedChain?.value?.chainID || '1',
    )
    setWallet(wallet)
    addWallet(walletConfigs.privateKey)
    privateKeyInput.value = ''
    accessStore.setCurrentView('default')
    accessStore.closeAccessDialog()
  } catch (error) {
    // TODO: handle error when toast is implemented
    console.error(error)
  }
}
</script>
