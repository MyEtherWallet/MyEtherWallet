<template>
  <div class="flex justify-center w-full">
    <router-view />
    <div class="w-[624px] flex flex-col items-center justify-center">
      <app-sheet :title="$t('verify-message')">
        <div class="flex flex-col gap-1 pt-6">
          <select-chain-for-app v-if="!isWalletConnected" class="mb-8" />
          <app-text-field
            v-model="message"
            :placeholder="$t('sign_message.enter_message_to_verify')"
            class="w-full"
          />
          <address-input
            v-model:adr-input="signingAddress"
            :resolved-address="resolvedAddress"
            :network="selectedChain"
            :address-error-messages="adrError"
            :is-raised="false"
            @validate:address="validateAddressInput"
            @immediate-update:resolved-address="onInput"
            :label="$t('sign_message.signing_address')"
            class="w-full mb-4"
          />

          <app-text-field
            v-model="signature"
            :placeholder="$t('sign_message.enter_signature_to_verify')"
            class="w-full"
          />

          <div
            v-if="
              signingAddress !== '' &&
              message !== '' &&
              signature !== '' &&
              verifyStatusKey !== ''
            "
            class="p-5 rounded-20 border text-s-14 transition-all"
            :class="
              verified
                ? 'border-mew-green-text/20 text-t-default bg-success/5'
                : 'border-error/20 text-error bg-error/5'
            "
          >
            <div class="flex items-start gap-3">
              <div
                class="w-2 h-2 mt-2 rounded-full shrink-0"
                :class="verified ? 'bg-success' : 'bg-error'"
              ></div>
              <i18n-t
                :keypath="verifyStatusKey"
                tag="p"
                class="font-medium leading-relaxed break-words"
              >
                <template #message>
                  <code class="break-all">{{ message }}</code>
                </template>
                <template #address>
                  <code class="break-all">{{ signingAddress }}</code>
                </template>
                <template #chain>{{ selectedChain?.name ?? '' }}</template>
              </i18n-t>
            </div>
          </div>

          <div class="flex justify-center">
            <app-base-button
              @click="verifyMessage"
              class="w-full xs:w-auto"
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
const verifyStatusKey = ref('')
const {
  adrInput: signingAddress,
  resolvedAddress,
  onInput,
  validateAddressInput,
  adrError,
} = useAddressInput(selectedChain)

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
    verifyStatusKey.value = ''
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
      verifyStatusKey.value = 'sign_message.message_signed_by'
    } catch {
      verifyStatusKey.value = 'sign_message.message_not_signed_by'
    }
  } else {
    verifyStatusKey.value = 'sign_message.verify_not_supported'
  }
  verifying.value = false
}

const canVerifyMessage = computed(() => {
  return (
    message.value !== '' &&
    signingAddress.value !== '' &&
    signature.value !== '' &&
    (adrError.value === undefined || adrError.value === '') &&
    !!Object.keys(verifier).find(key => key === selectedChain.value?.type)
  )
})

watch([message.value, signingAddress.value, signature.value], () => {
  // reset fields when chain changes
  verifyStatusKey.value = ''
  verified.value = false
})
</script>
