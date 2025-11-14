<template>
  <div class="flex justify-center w-full">
    <div class="w-[624px] flex flex-col items-center justify-center">
      <app-sheet :title="$t('verify-message')">
        <div class="flex items-center flex-col">
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
            :network="selectedChain"
            label="Signing Address"
            class="w-full max-w-lg mt-1"
          />

          <app-text-field
            v-model="signature"
            placeholder="Enter the signature to verify"
            class="w-full max-w-lg"
          />

          <div
            v-if="
              signingAddress !== '' &&
              message !== '' &&
              signature !== '' &&
              verifyMessageDesc !== ''
            "
            class="mt-4 p-4 border rounded-lg w-full max-w-lg"
            :class="
              verified
                ? 'border-mew-green-text text-mew-green-text bg-mew-green-10'
                : 'border-error text-error bg-error-10'
            "
          >
            {{ verifyMessageDesc }}
          </div>

          <app-base-button
            @click="verifyMessage"
            class="mt-4"
            :disabled="!canVerifyMessage"
          >
            {{ $t('verify-message') }}
          </app-base-button>
        </div>
      </app-sheet>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppSheet from '@/components/AppSheet.vue'
import AppTextField from '@/components/AppTextField.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import SelectChainForApp from '@/components/select_chain/SelectChainForApp.vue'
import AddressInput from '@/components/address_book/AddressInput.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useAddressInput } from '@/composables/useAddressInput'
import { storeToRefs } from 'pinia'
import verifier from '@/utils/verifySignature'

interface VerifierObj {
  [key: string]: (params: {
    message: string
    address: string
    signature: string
  }) => Promise<boolean>
}

const walletStore = useWalletStore()
const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)
const { isWalletConnected } = storeToRefs(walletStore)
const message = ref('')
const verifying = ref(false)
const signature = ref('')
const verified = ref(false)
const verifyMessageDesc = ref('')

const { adrInput: signingAddress } = useAddressInput(selectedChain)

const verifyMessage = async () => {
  verifying.value = true
  const chainType = selectedChain.value!.type
  const verifierObj = verifier as VerifierObj
  const verify = chainType in verifierObj ? verifierObj[chainType] : undefined
  if (verify) {
    try {
      verified.value = await verify({
        message: message.value,
        address: signingAddress.value,
        signature: signature.value,
      })
      if (!verified.value) throw new Error('Verification failed')
      verifyMessageDesc.value = `Message ${message.value} is signed by ${signingAddress.value}.`
    } catch {
      verifyMessageDesc.value = `Message ${message.value} is NOT signed by ${signingAddress.value}.`
    }
  } else {
    verifyMessageDesc.value = `Verify message not supported for ${selectedChain.value?.name}`
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

watch([message.value, signingAddress.value, signature.value], () => {
  // reset fields when chain changes
  verifyMessageDesc.value = ''
  verified.value = false
})
</script>
