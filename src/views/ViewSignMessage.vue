<template>
  <div class="flex items-center flex-col">
    <h2 class="mt-10 mb-4 title4 pt-10">{{ $t('sign-message') }}</h2>
    <app-text-field
      v-model="message"
      placeholder="Enter the message to sign"
      class="w-full max-w-lg"
    />

    <app-base-button
      @click="signMessage"
      class="mt-4"
      :disabled="!cansignMessage"
    >
      {{ $t('sign-message') }}
    </app-base-button>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import AppTextField from '@/components/AppTextField.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'

import { storeToRefs } from 'pinia'
import verifier from '@/utils/verifySignature'
import type { HexPrefixedString } from '@/providers/types'
import { stringToHex } from 'viem'
const walletStore = useWalletStore()
const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)
const { wallet, isWatchOnly } = storeToRefs(walletStore)
const message = ref('')
const signing = ref(false)
const signature = ref('')

const signMessage = async () => {
  signing.value = true
  try {
    wallet.value
      ?.SignMessage({
        message: stringToHex(message.value) as HexPrefixedString,
      })
      .then((sig: HexPrefixedString) => {
        signature.value = sig
        console.log(sig)
      })
  } catch (e) {
    console.error(e)
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
