<template>
  <app-dialog
    v-model:is-open="isOpenCustomTokenDialog"
    :title="title"
    z-index-overlay="z-[150]"
    z-index-container="z-[151]"
    class="sm:max-w-[420px]"
    :class="{ '!min-h-0': currentView === 'delete' }"
  >
    <template #content>
      <div class="px-6 pb-8 pt-4 w-full flex flex-col items-center">
        <div v-if="currentView === 'add'" class="w-full flex flex-col gap-4">
          <address-input
            v-model:adr-input="adrInput"
            label="Token Address"
            :resolved-address="resolvedAddress"
            :address-error-messages="addressError"
            :chain="selectedChain"
            @validate:address="validateAddressInput"
            @immediate-update:resolved-address="onInput"
          />

          <transition-group
            enter-active-class="transform ease-out duration-300 transition"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
          >
            <app-input
              v-if="fetchedInfoViaAddress"
              key="name"
              placeholder="Token Name"
              v-model="tokenName"
              :is-disabled="fetchingDetails"
              :error-message="nameError"
            />
            <app-input
              v-if="fetchedInfoViaAddress"
              key="symbol"
              placeholder="Token Symbol"
              v-model="tokenSymbol"
              :is-disabled="fetchingDetails"
              :error-message="symbolError"
            />
            <app-input
              v-if="fetchedInfoViaAddress"
              key="decimals"
              placeholder="Token Decimals"
              v-model="tokenDecimals"
              :is-disabled="fetchingDetails"
              :error-message="decimalsError"
            />
          </transition-group>

          <div
            v-if="fetchingDetails"
            class="flex justify-center items-center py-4"
          >
            <svg
              class="animate-spin h-8 w-8 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>
        <div v-if="currentView === 'edit'" class="w-full flex flex-col gap-4">
          <address-input
            v-model:adr-input="adrInput"
            label="Token Address"
            :is-disabled="true"
            :resolved-address="resolvedAddress"
            :chain="selectedChain"
          />
          <app-input
            placeholder="Token Name"
            v-model="tokenName"
            :error-message="nameError"
          />
          <app-input
            placeholder="Token Symbol"
            v-model="tokenSymbol"
            :error-message="symbolError"
          />
          <app-input
            placeholder="Token Decimals"
            v-model="tokenDecimals"
            :is-disabled="true"
            :error-message="decimalsError"
          />
        </div>
        <div
          v-if="currentView === 'delete'"
          class="max-w-[340px] text-center mb-2"
        >
          <p class="text-s-16 text-black leading-relaxed">
            Are you sure you want to delete "<span class="font-bold">{{
              selectedToken?.name
            }}</span
            >"? You can re-add this token if you change your mind.
          </p>
        </div>
        <app-base-button
          class="mt-8 mx-auto w-full xs:w-[220px]"
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
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import type { GetErc20ContractMetadataResponse } from '@/mew_api/types'
import { getAPIPath } from '@/utils/constructAPIPath'

// --- Store & State ---
const chainStore = useChainsStore()
const toastStore = useToastStore()
const customTokenStore = useCustomTokenStore()

const { selectedChain } = storeToRefs(chainStore)
const { isOpenCustomTokenDialog, currentView, selectedToken } =
  storeToRefs(customTokenStore)
const { addCustomToken, isStoredToken, editCustomToken, deleteCustomToken } =
  customTokenStore

// Form State
const tokenName = ref('')
const tokenSymbol = ref('')
const tokenDecimals = ref('')
const fetchingDetails = ref(false)
const fetchedInfoViaAddress = ref(false)
const localAddressError = ref('')

const nameError = computed(() => {
  if (currentView.value === 'delete') return ''
  if (fetchedInfoViaAddress.value && !tokenName.value.trim())
    return 'Token name is required'
  return ''
})

const symbolError = computed(() => {
  if (currentView.value === 'delete') return ''
  if (fetchedInfoViaAddress.value && !tokenSymbol.value.trim())
    return 'Token symbol is required'
  return ''
})

const decimalsError = computed(() => {
  if (currentView.value === 'delete') return ''
  if (fetchedInfoViaAddress.value) {
    if (!tokenDecimals.value.trim()) return 'Decimals are required'
    const d = parseInt(tokenDecimals.value)
    if (isNaN(d) || d < 0 || d > 36) return 'Must be between 0 and 36'
  }
  return ''
})

// Address Composable
const { adrInput, adrError, resolvedAddress, onInput, validateAddressInput } =
  useAddressInput(selectedChain)

// --- Computed ---
const title = computed(() => {
  const titles = {
    add: 'Add Custom Token',
    edit: 'Edit Custom Token',
    delete: 'Delete Custom Token',
  }
  return titles[currentView.value] || ''
})

const buttonTitle = computed(() => {
  const labels = {
    add: 'Add Token',
    edit: 'Save Changes',
    delete: 'Delete Token',
  }
  return labels[currentView.value] || ''
})

const addressError = computed(() => localAddressError.value || adrError.value)

const disableSubmit = computed(() => {
  if (currentView.value === 'delete') return false
  if (addressError.value) return true
  if (nameError.value || symbolError.value || decimalsError.value) return true
  const hasEmptyFields =
    !tokenName.value.trim() ||
    !tokenDecimals.value.trim() ||
    !tokenSymbol.value.trim()
  return hasEmptyFields || fetchingDetails.value
})

// --- Methods ---
const getTokenMetaData = async (
  contractAddress: string,
): Promise<GetErc20ContractMetadataResponse> => {
  const path = getAPIPath(
    `/v1/evm/chains/${selectedChain.value?.chainID}/erc20/${contractAddress}/metadata`,
  )
  const response = await fetch(path)
  if (!response.ok) throw new Error('Failed to fetch metadata')
  return response.json()
}

const resetForm = () => {
  tokenName.value = ''
  tokenDecimals.value = ''
  tokenSymbol.value = ''
  adrInput.value = ''
  localAddressError.value = ''
  fetchedInfoViaAddress.value = false
}

const handleAdd = () => {
  addCustomToken(selectedChain.value?.name ?? '', {
    address: adrInput.value,
    name: tokenName.value,
    decimals: parseInt(tokenDecimals.value),
    symbol: tokenSymbol.value,
  })
  toastStore.addToastMessage({
    text: 'Custom token added successfully.',
    type: ToastType.Success,
  })
}

const handleEdit = () => {
  if (!selectedToken.value) return
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

const handleDelete = () => {
  if (!selectedToken.value) return
  deleteCustomToken(
    selectedChain.value?.name ?? '',
    selectedToken.value.address,
  )
  toastStore.addToastMessage({
    text: 'Custom token deleted successfully.',
    type: ToastType.Success,
  })
}

const action = () => {
  if (currentView.value === 'add') handleAdd()
  else if (currentView.value === 'edit') handleEdit()
  else if (currentView.value === 'delete') handleDelete()

  resetForm()
  isOpenCustomTokenDialog.value = false
}

// --- Watchers ---

// Initialize or Clear form on dialog toggle
watch(isOpenCustomTokenDialog, isOpen => {
  if (
    isOpen &&
    selectedToken.value &&
    (currentView.value === 'edit' || currentView.value === 'delete')
  ) {
    adrInput.value = selectedToken.value.address
    tokenName.value = selectedToken.value.name
    tokenSymbol.value = selectedToken.value.symbol
    tokenDecimals.value = selectedToken.value.decimals.toString()
  } else if (!isOpen) {
    resetForm()
  }
})

// Auto-fetch token info on address change
watch(adrInput, async () => {
  localAddressError.value = ''

  if (!validateAddressInput() || currentView.value !== 'add') {
    tokenName.value = ''
    tokenDecimals.value = ''
    fetchedInfoViaAddress.value = false
    return
  }

  if (isStoredToken(selectedChain.value?.name ?? '', adrInput.value)) {
    localAddressError.value = 'This token is already added.'
    fetchedInfoViaAddress.value = false
    return
  }

  try {
    fetchingDetails.value = true
    const { name, symbol, decimals } = await getTokenMetaData(adrInput.value)
    tokenSymbol.value = symbol
    tokenName.value = name
    tokenDecimals.value = decimals.toString()
    fetchedInfoViaAddress.value = true
  } catch {
    localAddressError.value =
      'Failed to fetch token details. Please check the address.'
    fetchedInfoViaAddress.value = true
  } finally {
    fetchingDetails.value = false
  }
})
</script>
