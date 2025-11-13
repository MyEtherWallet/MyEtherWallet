<template>
  <div class="flex items-center flex-col">
    <h2 class="mt-10 mb-4 title4 pt-10">{{ $t('sign-message') }}</h2>
    <app-text-field
      v-model="message"
      placeholder="Enter the message to sign"
      class="w-full max-w-lg"
    />

    <app-base-button
      @click="handleSigner"
      class="mt-4"
      :disabled="!cansignMessage"
    >
      {{ isWalletConnected ? $t('sign-message') : $t('connect_wallet') }}
    </app-base-button>

    <app-dialog
      v-model:is-open="signedModal"
      title="Signature"
      class="sm:max-w-lg sm:mx-auto"
    >
      <template #content>
        <div>
          <div class="p-4">
            <h3 class="text-lg font-semibold">Signature:</h3>
            <p class="mt-2 text-wrap word-break">{{ signature }}</p>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold">Message:</h3>
            <p class="mt-2">{{ message }}</p>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold">Signing address:</h3>
            <p class="mt-2">{{ walletAddress }}</p>
          </div>
        </div>
      </template>
    </app-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import AppDialog from '@/components/AppDialog.vue'
import AppTextField from '@/components/AppTextField.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import { storeToRefs } from 'pinia'
import verifier from '@/utils/verifySignature'
import type { HexPrefixedString } from '@/providers/types'
import { stringToHex } from 'viem'
import { useAccessStore } from '@/stores/accessStore'
const accessDialog = useAccessStore()
const walletStore = useWalletStore()
const chainsStore = useChainsStore()
const toastStore = useToastStore()

const { openAccessDialog } = accessDialog
const { selectedChain } = storeToRefs(chainsStore)
const { wallet, isWatchOnly, walletAddress, isWalletConnected } =
  storeToRefs(walletStore)

const message = ref('')
const signedModal = ref(false)
const signing = ref(false)
const signature = ref('')

const handleSigner = async () => {
  if (!isWalletConnected.value) {
    openAccessDialog()
    return
  }
  signMessage()
}

const signMessage = async () => {
  signing.value = true
  try {
    wallet.value
      ?.SignMessage({
        message: stringToHex(message.value) as HexPrefixedString,
      })
      .then((sig: HexPrefixedString) => {
        signature.value = sig
        signedModal.value = true
      })
  } catch (e) {
    toastStore.addToastMessage({
      text: 'Signing Failed',
      textSecondary: e instanceof Error ? e.message : String(e),
      type: ToastType.Error,
      duration: 10000,
    })
  }
  signing.value = false
}

const cansignMessage = computed(() => {
  return (
    message.value !== '' &&
    !isWatchOnly.value &&
    !!Object.keys(verifier).find(key => key === selectedChain.value?.type)
  )
})
</script>
