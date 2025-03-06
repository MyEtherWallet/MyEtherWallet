<template>
  <div
    class="mt-6 px-4 py-4 rounded-input box-border border-1 border-grey-outline flex items-center"
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
        v-model="toAddress"
        name="address-input"
        type="text"
        placeholder="Address"
      />
    </div>
    <app-btn-icon
      v-if="addressBookLength > 0"
      class="ml-2 cursor-pointer"
      label="open address book"
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
    class="sm:max-w-[500px] sm:mx-auto"
    :hasContentGutter="false"
  >
    <template #content>
      <div
        class="flex items-center justify-between py-3 rounded-lg cursor-pointer"
      >
        <div class="flex items-center justify-center px-4 w-[100%] relative">
          <img
            v-if="addressSearch"
            :src="createIcon(addressSearch)"
            class="rounded-full w-[32px] h-[32px]"
            height="32"
            width="32"
          />
          <div v-else class="rounded-full bg-grey-30 w-[35px] h-[32px]" />
          <input
            v-model="addressSearch"
            placeholder="Address"
            class="ml-3 w-[100%] outline-none"
          />
          <app-btn-icon
            v-if="addressSearch"
            class="absolute right-[5px]"
            label="clear search"
            @click="clearSearch"
          >
            <x-circle-icon class="w-4 h-4" name="close" />
          </app-btn-icon>
        </div>
      </div>
      <div class="flex flex-col border-t-[2px] border-grey-outline px-4 pt-2">
        <div class="mt-2">
          <!-- TODO: get network info -->
          <h3 class="font-bold">
            {{
              searchedAddressBook.length === 0
                ? 'External network address'
                : 'Previous sent to addresses'
            }}
          </h3>
          <div
            class="flex items-center justify-between py-3 rounded-lg"
            v-if="searchedAddressBook.length === 0"
          >
            <div class="flex items-center">
              <img
                :src="createIcon(addressSearch)"
                class="rounded-full w-[32px] h-[32px]"
                height="32"
                width="32"
              />
              <div class="ml-3">
                <p>{{ addressSearch }}</p>
              </div>
            </div>
            <div
              class="text-xs px-2 py-1 rounded-md bg-mew-purple text-white cursor-pointer"
              @click="setAddress(addressSearch)"
            >
              Receive on this address
            </div>
          </div>
          <div
            v-for="(address, idx) in searchedAddressBook"
            :key="address"
            class="flex items-center justify-between py-3 rounded-lg cursor-pointer"
            @click="setAddress(address)"
          >
            <div class="flex items-center">
              <img
                :src="createIcon(address)"
                class="rounded-full w-[32px] h-[32px]"
                height="32"
                width="32"
              />
              <div class="ml-3">
                <p>Address {{ idx + 1 }}</p>
                <p class="text-grey-30">{{ address }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script lang="ts" setup>
import { ChevronDownIcon, XCircleIcon } from '@heroicons/vue/24/solid'
import { ref, computed } from 'vue'
import { isValidAddress, isValidChecksumAddress } from '@ethereumjs/util'
import createIcon from '@/providers/ethereum/blockies'
import { useDebounceFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import ENSNameResolver from '@/providers/common/nameResolver'
import { useAddressBookStore } from '@/stores/addressBook'
import AppDialog from './AppDialog.vue'
import AppBtnIcon from './AppBtnIcon.vue'

const emit = defineEmits(['update:modelValue'])

const store = useAddressBookStore()
const { addressBookLength, currentAddressBook } = storeToRefs(store)

const toAddress = ref('')
const resolvedAddress = ref('')
const addressSearch = ref('')
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
    try {
      const locResolvedAddr = await resolver.value.resolveName(toAddress.value)
      resolvedAddress.value = locResolvedAddr
      emit('update:modelValue', locResolvedAddr)
    } catch {
      emit('update:modelValue', toAddress.value)
    }
  } else {
    resolvedAddress.value = ''
    toAddress.value = ''
    emit('update:modelValue', '')
  }
}, 500)

const searchedAddressBook = computed(() => {
  return currentAddressBook.value.filter(address =>
    address.toLowerCase().includes(addressSearch.value.toLowerCase()),
  )
})

const openAddressBook = () => {
  isAddressBookOpen.value = !isAddressBookOpen.value
  clearSearch()
}

const clearSearch = () => {
  addressSearch.value = ''
}

const setAddress = (address: string) => {
  toAddress.value = address
  resolvedAddress.value = ''
  isAddressBookOpen.value = false
  clearSearch()
  emit('update:modelValue', address)
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
