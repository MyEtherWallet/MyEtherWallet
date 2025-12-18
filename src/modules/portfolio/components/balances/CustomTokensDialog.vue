<template>
  <app-dialog
    v-model:is-open="isOpenCustomTokenDialog"
    :title="title"
    :persistent="false"
    z-index-overlay="z-[150]"
    z-index-container="z-[151]"
    bg="bg-white"
  >
    <template #content>
      <div class="p-4">
        <div v-if="currentView === 'add'">
          <address-input
            v-model:adr-input="adrInput"
            label="Token Address"
            :resolved-address="resolvedAddress"
            :address-error-messages="addressError"
            :chain="selectedChain"
            @validate:address="validateAddressInput"
            @immediate-update:resolved-address="onInput"
          />
          <app-input
            v-if="fetchedInfoViaAddress"
            placeholder="Token Name"
            v-model="tokenName"
            :is-disabled="fetchingDetails"
          />
          <app-input
            v-if="fetchedInfoViaAddress"
            placeholder="Token Symbol"
            v-model="tokenSymbol"
            :is-disabled="fetchingDetails"
          />
          <app-input
            v-if="fetchedInfoViaAddress"
            placeholder="Token Decimals"
            v-model="tokenDecimals"
            :is-disabled="fetchingDetails"
          />
        </div>
        <div v-if="currentView === 'edit'"></div>
        <div v-if="currentView === 'delete'"></div>
        <app-base-button
          class="mt-4 w-full"
          :disabled="disableSubmit"
          @click="action"
        >
          {{ buttonTitle }}
        </app-base-button>
      </div>
    </template>
  </app-dialog>
</template>

<script lang="ts" setup>
import AppDialog from '@/components/AppDialog.vue'
import AppInput from '@/components/AppInput.vue'
import AddressInput from '@/components/address_book/AddressInput.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { useCustomTokenStore } from '@/stores/customTokenStore'
import { storeToRefs } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useChainsStore } from '@/stores/chainsStore'
import { useAddressInput } from '@/composables/useAddressInput'
import { createPublicClient, getContract, webSocket } from 'viem'
import tokenAbi from './tokenAbi'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'

const chainStore = useChainsStore()
const toastStore = useToastStore()
const { selectedChain } = storeToRefs(chainStore)
const tokenName = ref('')
const tokenSymbol = ref('')
const tokenDecimals = ref('')
const customTokenStore = useCustomTokenStore()
const fetchingDetails = ref(false)
const fetchedInfoViaAddress = ref(false)
const { addCustomToken, isStoredToken } = customTokenStore
const { isOpenCustomTokenDialog, currentView } = storeToRefs(customTokenStore)

const title = computed(() => {
  return currentView.value === 'add'
    ? 'Add Custom Token'
    : currentView.value === 'edit'
      ? 'Edit Custom Tokens'
      : 'Delete Custom Token'
})

const action = () => {
  if (currentView.value === 'add') {
    addCustomToken(selectedChain.value?.name ?? '', {
      address: adrInput.value,
      name: tokenName.value,
      decimals: parseInt(tokenDecimals.value),
      symbol: tokenSymbol.value,
    })
    tokenName.value = ''
    tokenDecimals.value = ''
    tokenSymbol.value = ''
    adrInput.value = ''
    localAddressError.value = ''
    fetchedInfoViaAddress.value = false
    isOpenCustomTokenDialog.value = false
  }
}

const disableSubmit = computed(() => {
  if (currentView.value === 'add') {
    return (
      tokenName.value.trim() === '' ||
      tokenDecimals.value.trim() === '' ||
      fetchingDetails.value
    )
  }
  return false
})

const buttonTitle = computed(() => {
  return currentView.value === 'add'
    ? 'Add Token'
    : currentView.value === 'edit'
      ? 'Save Changes'
      : 'Delete Token'
})

const localAddressError = ref('')

const { adrInput, adrError, resolvedAddress, onInput, validateAddressInput } =
  useAddressInput(selectedChain)

const addressError = computed(() => {
  return localAddressError.value || adrError.value
})

watch([adrInput], async () => {
  localAddressError.value = ''
  if (!validateAddressInput()) {
    tokenName.value = ''
    tokenDecimals.value = ''
    fetchedInfoViaAddress.value = false
    return
  }

  if (isStoredToken(selectedChain.value?.name ?? '', adrInput.value)) {
    localAddressError.value = 'This token is already added.'
    tokenName.value = ''
    tokenSymbol.value = ''
    tokenDecimals.value = ''
    fetchedInfoViaAddress.value = false
    return
  }

  const client = createPublicClient({
    transport: webSocket(
      (selectedChain.value?.rpcUrls ?? []).length > 0
        ? (selectedChain.value?.rpcUrls?.[0] ?? '')
        : '',
    ),
  })

  const contract = getContract({
    abi: tokenAbi,
    address: adrInput.value as `0x${string}`,
    client,
  })

  try {
    fetchingDetails.value = true
    const name = (await contract.read.name()) as string
    const decimals = (await contract.read.decimals()) as number
    const symbol = (await contract.read.symbol()) as string
    tokenSymbol.value = symbol
    tokenName.value = name
    tokenDecimals.value = decimals.toString()
    fetchedInfoViaAddress.value = true
    fetchingDetails.value = false
  } catch {
    toastStore.addToastMessage({
      text: 'Failed to fetch token details. Please check the address.',
      type: ToastType.Error,
    })
    fetchedInfoViaAddress.value = true
    fetchingDetails.value = false
  }
})
</script>
