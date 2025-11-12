<template>
  <div class="flex items-center flex-col">
    <h2 class="mt-10 mb-4 title4 pt-10">{{ $t('verify-message') }}</h2>
    <div
      class="flex flex-row flex-wrap my-5 gap-y-5 gap-x-[54px]"
      v-if="!isWalletConnected"
    >
      <div>
        <h2 class="text-s-28 font-semibold mb-2 md:ml-3">
          {{ $t('common.select_network') }}
        </h2>
        <select-chain-for-app is-btn-group />
      </div>
    </div>
    <app-text-field
      v-model="message"
      placeholder="Enter the message to verify"
      class="w-full max-w-lg"
    />
    <address-input
      v-model:adr-input="signingAddress"
      label="Signing Address"
      class="w-full max-w-lg mt-1"
    />

    <app-input
      v-model="signature"
      type="text"
      placeholder="Enter the signature"
      class="w-full max-w-lg mt-1"
    />

    <app-base-button
      @click="verifyMessage"
      class="mt-4"
      :disabled="!canVerifyMessage"
    >
      {{ $t('verify-message') }}
    </app-base-button>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import AppTextField from '@/components/AppTextField.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppInput from '@/components/AppInput.vue'
import SelectChainForApp from '@/components/select_chain/SelectChainForApp.vue'
import AddressInput from '@/components/address_book/AddressInput.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useAddressInput } from '@/composables/useAddressInput'
import { storeToRefs } from 'pinia'
import verifier from '@/utils/verifySignature'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'

interface VerifierObj {
  [key: string]: (params: {
    message: string
    address: string
    signature: string
  }) => Promise<boolean>
}

const toastStore = useToastStore()
const walletStore = useWalletStore()
const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)
const { isWalletConnected } = storeToRefs(walletStore)
const message = ref('')
const verifying = ref(false)
const signature = ref('')

const { adrInput: signingAddress } = useAddressInput(selectedChain)

const verifyMessage = async () => {
  verifying.value = true
  const chainType = selectedChain.value!.type
  const verifierObj = verifier as VerifierObj
  const verify = chainType in verifierObj ? verifierObj[chainType] : undefined
  let verified = false
  if (verify) {
    try {
      verified = await verify({
        message: message.value,
        address: signingAddress.value,
        signature: signature.value,
      })
      if (!verified) throw new Error('Verification failed')
      toastStore.addToastMessage({
        text: 'Verification Successful',
        textSecondary: `Message ${message.value} is signed by ${signingAddress.value}.`,
        type: ToastType.Success,
        duration: 10000,
      })
    } catch {
      toastStore.addToastMessage({
        text: 'Verification Failed',
        textSecondary: `Message ${message.value} is NOT signed by ${signingAddress.value}.`,
        type: ToastType.Error,
        duration: 10000,
      })
    }
  } else {
    toastStore.addToastMessage({
      text: 'Verification Failed',
      textSecondary: `Verify message not supported for ${selectedChain.value?.name}`,
      type: ToastType.Error,
      duration: 10000,
    })
  }
  verifying.value = false
}

const canVerifyMessage = computed(() => {
  return (
    message.value !== '' &&
    signingAddress.value !== '' &&
    signature.value !== '' &&
    !!Object.keys(verifier).find(key => key === selectedChain.value?.type)
  )
})
</script>
