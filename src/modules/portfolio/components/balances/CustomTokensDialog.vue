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
      <div class="p-4 max-w-md w-full">
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
        <div v-if="currentView === 'edit'">
          <address-input
            v-model:adr-input="adrInput"
            label="Token Address"
            :is-disabled="true"
            :resolved-address="resolvedAddress"
            :chain="selectedChain"
          />
          <app-input placeholder="Token Name" v-model="tokenName" />
          <app-input placeholder="Token Symbol" v-model="tokenSymbol" />
          <app-input
            placeholder="Token Decimals"
            v-model="tokenDecimals"
            :is-disabled="true"
          />
        </div>
        <div v-if="currentView === 'delete'">
          <h3 class="text-lg font-bold mb-4">
            Are you sure you want to delete the custom token "{{
              selectedToken?.name
            }}"?
          </h3>
          <div>
            <strong class="block mb-2">Token Address:</strong>
            <p class="break-all mb-4">{{ selectedToken?.address }}</p>
            <strong class="block mb-2">Token Symbol:</strong>
            <p class="break-all mb-4">{{ selectedToken?.symbol }}</p>
            <strong class="block mb-2">Token Decimal:</strong>
            <p class="break-all mb-4">{{ selectedToken?.decimals }}</p>
          </div>
          <p>
            This action cannot be undone. You can re-add the token later if you
            change your mind.
          </p>
        </div>
        <app-base-button
          class="mt-4 w-full"
          :disabled="disableSubmit"
          :theme="currentView === 'delete' ? 'error' : 'primary'"
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
const { addCustomToken, isStoredToken, editCustomToken, deleteCustomToken } =
  customTokenStore
const { isOpenCustomTokenDialog, currentView, selectedToken } =
  storeToRefs(customTokenStore)

const title = computed(() => {
  return currentView.value === 'add'
    ? 'Add Custom Token'
    : currentView.value === 'edit'
      ? 'Edit Custom Token'
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
  }
  if (currentView.value === 'edit' && selectedToken.value) {
    editCustomToken(
      selectedChain.value?.name ?? '',
      selectedToken.value.address,
      {
        address: selectedToken.value.address,
        name: tokenName.value,
        decimals: selectedToken.value.decimals,
        symbol: tokenSymbol.value,
      },
    )
    toastStore.addToastMessage({
      text: 'Custom token updated successfully.',
      type: ToastType.Success,
    })
  }
  if (currentView.value === 'delete' && selectedToken.value) {
    deleteCustomToken(
      selectedChain.value?.name ?? '',
      selectedToken.value.address,
    )
    toastStore.addToastMessage({
      text: 'Custom token deleted successfully.',
      type: ToastType.Success,
    })
  }
  tokenName.value = ''
  tokenDecimals.value = ''
  tokenSymbol.value = ''
  adrInput.value = ''
  localAddressError.value = ''
  fetchedInfoViaAddress.value = false
  isOpenCustomTokenDialog.value = false
}

watch(isOpenCustomTokenDialog, () => {
  if (
    isOpenCustomTokenDialog.value &&
    (currentView.value === 'edit' || currentView.value === 'delete') &&
    selectedToken.value
  ) {
    adrInput.value = selectedToken.value.address
    tokenName.value = selectedToken.value.name
    tokenSymbol.value = selectedToken.value.symbol
    tokenDecimals.value = selectedToken.value.decimals.toString()
  }
  if (!isOpenCustomTokenDialog.value) {
    adrInput.value = ''
    tokenName.value = ''
    tokenSymbol.value = ''
    tokenDecimals.value = ''
    localAddressError.value = ''
    fetchedInfoViaAddress.value = false
  }
})

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

  if (currentView.value !== 'add') {
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
