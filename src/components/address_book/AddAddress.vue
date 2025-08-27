<template>
  <div>
    <select-chain-btn
      v-if="!addressEdit"
      class="mb-6"
      @update:chain="setSelectedChain"
    />
    <div
      v-else
      class="flex items-center gap-2 mx-3 mb-5 tracking-sp-06 text-s-17 font-medium text-wrap break-all"
    >
      <app-blockie :address="addressEdit?.address" :size="9" />
      <p>{{ addressEdit?.address }}</p>
    </div>

    <app-input
      ref="nameInput"
      v-model="name"
      placeholder="Enter name"
      :errorMessage="nameErrorMessages"
      is-required
      @focus="setNameInFocusInput()"
      @blur="startNameOutOfFocusTimeout"
      @input="debouncedValidateNameInput"
    />
    <address-input
      v-if="!addressEdit"
      v-model:adr-input="address"
      label="Enter Address"
      :resolved-address="resolvedAddress"
      :address-error-messages="addressErrorMessages"
      :has-address-book="false"
      :network="selectedChain"
      @validate:address="validateAddressInput"
      @immediate-update:resolved-address="onInput"
    />
    <div class="flex justify-center gap-3">
      <app-base-button
        v-if="addressEdit"
        is-outline
        size="medium"
        @click="cancelEdit"
        >Cancel</app-base-button
      >
      <app-base-button size="medium" class="min-w-[100px]" @click="tryAdd">{{
        buttonText
      }}</app-base-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppInput from '../AppInput.vue'
import AppBaseButton from '../AppBaseButton.vue'
import SelectChainBtn from '@components/select_chain/SelectChainBtn.vue'
import { toChecksumAddress } from '@/utils/addressUtils'
import { useInFocusInput } from '@/composables/useInFocusInput'
import { useAddressBookStore, type Address } from '@/stores/addressBook'
import { useDebounceFn } from '@vueuse/core'
import AddressInput from './AddressInput.vue'
import { useAddressInput } from '@/composables/useAddressInput'
import { ref, nextTick, watch, computed } from 'vue'
import { type Chain } from '@/mew_api/types'
import AppBlockie from '../AppBlockie.vue'
const props = defineProps({
  addressEdit: {
    type: Object as () => Address,
    required: false,
  },
})

const isOpen = defineModel<boolean>('isOpen', {
  default: false,
})
const name = ref('')
const adrBookStore = useAddressBookStore()
const selectedChain = ref<Chain | undefined>(undefined)

const {
  adrInput: address,
  adrError: addressErrorMessages,
  resolvedAddress,
  onInput,
  validateAddressInput,
} = useAddressInput(selectedChain)

const emit = defineEmits(['add-address', 'close'])

const setSelectedChain = (chain: Chain) => {
  selectedChain.value = chain
}
/**------------------------
 * Error State
 -------------------------*/

const nameErrorMessages = ref<undefined | string>(undefined)

const validateNameInput = () => {
  nameErrorMessages.value = ''
  if (name.value === '') {
    nameErrorMessages.value = 'required'
    return false
  }
  if (name.value.length < 3) {
    nameErrorMessages.value = 'name must be at least 3 characters long'
    return false
  }
  if (
    adrBookStore.isNameAdded(name.value, selectedChain.value?.type || 'EVM')
  ) {
    nameErrorMessages.value = 'name already exists'
    return false
  }
  return true
}
const debouncedValidateNameInput = useDebounceFn(
  () => {
    validateNameInput()
  },
  500,
  { maxWait: 4000 },
)

const tryAdd = () => {
  //Add Mode
  if (!props.addressEdit) {
    const isValidAddress = validateAddressInput()
    const isValidName = validateNameInput()
    if (!isValidAddress || !isValidName) {
      return
    }

    adrBookStore.addAddress(
      {
        name: name.value,
        address: toChecksumAddress(address.value),
        chainName: selectedChain.value?.name || 'ETHEREUM',
        chainType: selectedChain.value?.type || 'EVM',
      },
      selectedChain.value?.type || 'EVM',
    )
    nextTick(() => {
      name.value = ''
      address.value = ''
      nameErrorMessages.value = undefined
      addressErrorMessages.value = undefined
      isOpen.value = false
      emit('add-address')
      emit('close')
    })
  } // EDIT MODE
  else {
    // If addressEdit is true, emit the close event
    const isValidName = validateNameInput()
    if (!isValidName) {
      return
    }
    const updatedAddress: Address = {
      ...props.addressEdit,
      name: name.value,
    }
    adrBookStore.editAddress(updatedAddress, updatedAddress.chainType)
    emit('close')
    isOpen.value = false
  }
}
const buttonText = computed(() => {
  return props.addressEdit ? 'Save' : 'Add'
})

const cancelEdit = () => {
  emit('close')
  name.value = ''
  isOpen.value = false
}

/**------------------------
 * Focus State Address Input
 -------------------------*/

const nameInput = ref<HTMLElement | null>(null)
const {
  inFocusInput: nameInFocusInput,
  setInFocusInput: setNameInFocusInput,
  startOutOfFocusTimeout: startNameOutOfFocusTimeout,
} = useInFocusInput(nameInput)

//Validate address input when it loses focus
watch(nameInFocusInput, newValue => {
  if (!newValue) {
    validateNameInput()
  }
})
</script>
