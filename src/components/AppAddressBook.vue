<template>
  <div
    class="mt-6 px-4 py-4 rounded-[20px] box-border border border-1 flex items-center"
  >
    <div
      v-if="!toAddress"
      class="blockies-container rounded-full bg-grey-30 !w-[36px] h-[32px]"
    ></div>
    <img
      v-else
      :src="addressBlockie"
      class="rounded-full w-[32px] h-[32px]"
      height="30"
      width="30"
    />
    <div class="relative ml-2 pt-2 w-full flex items-center">
      <label for="address-input" class="absolute top-[-6px] text-sm/[16px]"
        >To</label
      >
      <input
        class="address-input text-md/[24px] w-full !bg-white pl-1 outline-none"
        @input="debouncedToAddress"
        name="address-input"
        type="string"
        placeholder="Address"
        required
      />
    </div>
    <app-btn-icon
      v-if="addressBookLength > 0"
      class="ml-2 cursor-pointer"
      isWhite
      @click="openAddressBook"
    >
      <chevron-down-icon class="w-4 h-4" />
    </app-btn-icon>
  </div>
  <p
    :class="{
      'text-error': addressErrorMessages,
      'text-info': resolvedAddress,
    }"
    class="text-error pt-2 pl-3"
  >
    {{ addressErrorMessages || resolvedAddress }}
  </p>

  <app-dialog
    v-model:is-open="isAddressBookOpen"
    title="Receive to account"
    class="sm:max-w-[650px] sm:mx-auto"
  >
    <template #content>
      <div class="flex flex-col">
        <div class="mt-4">
          <div class="mt-4">
            <div
              v-for="address in currentAddressBook"
              :key="address"
              class="flex items-center justify-between py-2 px-4 rounded-lg cursor-pointer"
              @click="() => emit('update:modelValue', address)"
            >
              <div class="flex items-center">
                <img
                  :src="createIcon(address)"
                  class="rounded-full w-[32px] h-[32px]"
                  height="30"
                  width="30"
                />
                <div class="ml-2">
                  <p>No name</p>
                  <p class="text-grey-30">{{ address }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script lang="ts" setup>
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { ref, computed } from 'vue'
import { isValidAddress, isValidChecksumAddress } from '@ethereumjs/util'
import createIcon from '@/providers/ethereum/blockies'
import { useDebounceFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import ENSNameResolver from '@/providers/common/nameResolver'
import { useAddressBookStore } from '@/stores/addressBook'
import AppDialog from './AppDialog.vue'

const emit = defineEmits(['update:modelValue'])

const store = useAddressBookStore()
const { addressBookLength, currentAddressBook } = storeToRefs(store)

const toAddress = ref('')
const resolvedAddress = ref('')
const isAddressBookOpen = ref(false)

const resolver = computed(() => {
  return new ENSNameResolver('0x1')
})

const addressBlockie = computed(() => {
  const addressToCheck = resolvedAddress.value || toAddress.value
  if (!addressToCheck) return ''
  return createIcon(addressToCheck)
})

const addressErrorMessages = computed(() => {
  const addressToCheck = resolvedAddress.value || toAddress.value
  if (addressToCheck === '') return 'Address is required'
  if (
    (!isValidAddress(addressToCheck) &&
      resolver.value.isValidName(addressToCheck)) ||
    !isValidChecksumAddress(addressToCheck)
  )
    return 'Invalid address'
  return ''
})

const debouncedToAddress = useDebounceFn(async e => {
  if (e.target.value) {
    toAddress.value = e.target.value
    const locResolvedAddr = await resolver.value.resolveName(toAddress.value)
    if (locResolvedAddr) {
      resolvedAddress.value = locResolvedAddr
      emit('update:modelValue', locResolvedAddr)
    } else {
      emit('update:modelValue', toAddress.value)
    }
  } else {
    resolvedAddress.value = ''
    toAddress.value = ''
    emit('update:modelValue', '')
  }
}, 500)

const openAddressBook = () => {
  isAddressBookOpen.value = !isAddressBookOpen.value
}
</script>

<style scoped>
/* Removes the weird color on inputs */
.address-input:-webkit-autofill,
.address-input:-webkit-autofill:hover,
.address-input:-webkit-autofill:focus,
.address-input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px rgb(255, 255, 255) inset !important;
}
</style>
