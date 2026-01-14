<template>
  <div class="flex justify-center w-full">
    <div class="w-[624px] flex flex-col items-center justify-center">
      <app-sheet :title="$t('verify-message')">
        <div class="flex flex-col gap-6 pt-6">
          <div
            class="flex items-center justify-between bg-grey-5 p-4 rounded-20 border border-grey-10"
            v-if="!isWalletConnected"
          >
            <p class="text-s-17 font-medium">
              {{ $t('common.select_network') }}
            </p>
            <select-chain-for-app />
          </div>
          <app-text-field
            v-model="message"
            placeholder="Enter the message to verify"
            class="w-full"
          />
          <address-input
            v-model:adr-input="signingAddress"
            :network="selectedChain"
            label="Signing Address"
            class="w-full"
          />

          <app-text-field
            v-model="signature"
            placeholder="Enter the signature to verify"
            class="w-full"
          />

          <div
            v-if="
              signingAddress !== '' &&
              message !== '' &&
              signature !== '' &&
              verifyMessageDesc !== ''
            "
            class="p-5 rounded-20 border text-s-14 transition-all"
            :class="
              verified
                ? 'border-mew-green-text/20 text-t-default bg-success/5'
                : 'border-error/20 text-error bg-error/5'
            "
          >
            <div class="flex items-center gap-3">
              <div
                class="w-2 h-2 rounded-full shrink-0"
                :class="verified ? 'bg-success' : 'bg-error'"
              ></div>
              <p class="font-medium leading-relaxed">
                {{ verifyMessageDesc }}
              </p>
            </div>
          </div>

          <div class="flex justify-center">
            <app-base-button
              @click="verifyMessage"
              class="w-full sm:w-auto min-w-[240px]"
              :disabled="!canVerifyMessage"
            >
              {{ $t('verify-message') }}
            </app-base-button>
          </div>
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
import { hexToString } from 'viem'

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

const possibleJsonParse = (str: string | object) => {
  if (typeof str === 'object') return str
  try {
    return JSON.parse(str)
  } catch {
    return false
  }
}

watch(
  [message, signature, signingAddress],
  ([newMessage, newSignature, newSigningAddress]) => {
    verified.value = false
    verifyMessageDesc.value = ''
    const _messageJson = possibleJsonParse(newMessage)
      ? possibleJsonParse(newMessage)
      : possibleJsonParse(newSignature)
        ? possibleJsonParse(newSignature)
        : possibleJsonParse(newSigningAddress)
          ? possibleJsonParse(newSigningAddress)
          : null
    if (!!_messageJson) {
      if (_messageJson.message || _messageJson.msg) {
        message.value = _messageJson.message || hexToString(_messageJson.msg)
      }
      if (_messageJson.signature || _messageJson.sig) {
        signature.value = _messageJson.signature || `0x${_messageJson.sig}`
      }
      if (_messageJson.signingAddress || _messageJson.address) {
        signingAddress.value =
          _messageJson.signingAddress || _messageJson.address.toLowerCase()
      }
    }
  },
)

const verifyMessage = async () => {
  verifying.value = true
  verified.value = false
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
