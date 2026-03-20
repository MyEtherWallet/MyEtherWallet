<template>
  <div class="flex justify-center w-full">
    <div class="w-[624px] flex flex-col items-center justify-center">
      <app-sheet :title="$t('sign-message')">
        <div class="flex items-center flex-col gap-1 pt-6">
          <app-text-field
            v-model="message"
            placeholder="Enter the message to sign"
            class="w-full"
          />
          <app-base-button
            @click="handleSigner"
            class="w-full sm:w-auto"
            :disabled="
              isWalletConnected && !isWatchOnly ? !cansignMessage : false
            "
          >
            {{
              isWalletConnected && !isWatchOnly
                ? $t('sign-message')
                : $t('connect_wallet')
            }}
          </app-base-button>

          <app-dialog
            v-model:is-open="signedModal"
            title="Signature"
            class="sm:max-w-xl sm:mx-auto"
            has-content-gutter
          >
            <template #content>
              <div class="flex flex-col gap-6 pb-6 pt-2">
                <div>
                  <h3 class="text-s-14 font-medium text-grey-50 mb-1">
                    Message:
                  </h3>
                  <div
                    class="bg-grey-5 rounded-xl p-4 text-s-14 break-all border border-grey-10 text-grey-70"
                  >
                    {{ hexMessage }}
                  </div>
                </div>
                <div>
                  <h3 class="text-s-14 font-medium text-grey-50 mb-1">
                    Signing address:
                  </h3>
                  <div
                    class="bg-grey-5 rounded-xl p-4 text-s-14 break-all border border-grey-10 text-grey-70"
                  >
                    {{ walletAddress }}
                  </div>
                </div>
                <div>
                  <h3 class="text-s-14 font-medium text-grey-50 mb-1">
                    Signature:
                  </h3>
                  <div
                    class="bg-grey-5 rounded-xl p-4 text-s-12 break-all border border-grey-10 text-grey-70 font-mono"
                  >
                    {{ signature }}
                  </div>
                </div>
                <app-base-button @click="copy" class="xs:mx-auto xs:w-auto">
                  Copy Signature
                </app-base-button>
              </div>
            </template>
          </app-dialog>
        </div>
      </app-sheet>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import AppSheet from '@/components/AppSheet.vue'
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
import { toHex } from 'viem'
import { useAccessStore } from '@/stores/accessStore'
import { analytics, ConnectWalletEvent } from '@/analytics'
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
const hexMessage = computed(() => {
  return selectedChain.value?.type === 'BITCOIN'
    ? toHex(message.value)
    : message.value
})

const copy = () => {
  return new Promise((resolve, reject) => {
    const signObject = {
      signingAddress: walletAddress.value,
      message:
        selectedChain.value?.type === 'BITCOIN'
          ? toHex(message.value)
          : message.value,
      signature: signature.value,
    }
    navigator.clipboard
      .writeText(JSON.stringify(signObject))
      .then(() => {
        toastStore.addToastMessage({
          text: 'Signature copied to clipboard',
          type: ToastType.Success,
        })
        signedModal.value = false
        resolve(true)
      })
      .catch(() => {
        toastStore.addToastMessage({
          text: 'Failed to copy signature to clipboard',
          type: ToastType.Error,
        })
        reject(false)
      })
  })
}

const handleSigner = async () => {
  if (!isWalletConnected.value || isWatchOnly.value) {
    analytics.trackConnectWalletEvent(ConnectWalletEvent.CLICKED, {
      source: 'SignMessage',
    })
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
        message: message.value,
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
