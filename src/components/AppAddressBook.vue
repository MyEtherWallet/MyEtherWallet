<template>
  <div class="min-h-[82px]">
    <div class="relative">
      <!-- Blockie -->
      <div class="absolute top-3 left-3 flex items-center pointer-events-none">
        <div
          v-if="!isAddress(toAddress) && !resolvedAddress"
          class="rounded-full bg-surface !w-[32px] h-[32px]"
        ></div>
        <img
          v-else
          :src="addressBlockie"
          class="rounded-full w-[32px] h-[32px]"
          height="30"
          width="30"
        />
      </div>
      <!-- Label -->
      <label
        for="address-input"
        :class="[
          'pointer-events-none absolute top-[17px] left-11 bottom-auto transition-all pl-2 aria-hidden',
          inFocusInput
            ? hasError
              ? 'text-error'
              : 'text-primary'
            : 'text-info',
          {
            'text-[10px] translate-y-[-70%]': inFocusInput || toAddress !== '',
          },
        ]"
      >
        {{ label }}
      </label>
      <!-- Input  -->
      <input
        ref="adrInput"
        v-model="toAddress"
        name="address-input"
        type="text"
        :class="[
          {
            '!border-error border-2': hasError,
          },
          {
            '!border-primary !border-2': inFocusInput && !hasError,
          },
          'grow focus:outline-none focus:ring-0 bg-white border border-1 border-grey-outline  text-sm text-normal rounded-16 h-[58px] w-full pl-[50px] pr-[70px] pt-[24px] pb-[12px]  transition-colors',
        ]"
        :aria-label="label"
        @focus="setInFocusInput()"
        @blur="startOutOfFocusTimeout()"
        @input="debouncedToAddress"
        autocomplete="off"
      />
      <!-- Clear Input  -->
      <app-btn-icon
        class="absolute top-3 right-11"
        label="clear search"
        @click="cleatAdrInput"
        :class="[
          toAddress !== '' ? 'opacity-100' : 'hidden',
          'transition-opacity opacity-0',
        ]"
      >
        <x-circle-icon class="w-6 h-6 text-primary" />
      </app-btn-icon>
      <!-- Open Address Book button-->
      <app-btn-icon
        class="absolute top-3 right-3"
        label="open address book"
        @click.prevent="openAddressBook"
      >
        <users-icon class="w-[22px] h-[22px] text-primary" />
      </app-btn-icon>
    </div>
    <!-- Error Messages OR Resolved Address -->
    <transition name="fade" mode="out-in">
      <p
        v-if="addressErrorMessages !== '' || resolvedAddress !== ''"
        :class="{
          'text-error': addressErrorMessages,
          'text-info': resolvedAddress,
        }"
        class="text-[10px] xs:text-s-12 leading-[23px] pl-5"
      >
        {{ addressErrorMessages || resolvedAddress }}
      </p>
    </transition>

    <app-dialog
      v-model:is-open="isAddressBookOpen"
      title="Receive to account"
      class="sm:max-w-[500px] sm:mx-auto"
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
  </div>
</template>

<script lang="ts" setup>
import { UsersIcon } from '@heroicons/vue/24/solid'
import { XCircleIcon } from '@heroicons/vue/24/outline'
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { isValidAddress } from '@ethereumjs/util'
import { toChecksumAddress, isAddress } from '@/utils/addressUtils'
import createIcon from '@/providers/ethereum/blockies'
import { useDebounceFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useInFocusInput } from '@/composables/useInFocusInput'
import ENSNameResolver from '@/providers/common/nameResolver'
import { useAddressBookStore } from '@/stores/addressBook'
import AppDialog from './AppDialog.vue'
import AppBtnIcon from './AppBtnIcon.vue'
import { useChainsStore } from '@/stores/chainsStore'

const props = defineProps({
  label: {
    type: String,
    default: 'To Address',
  },
  customValidator: {
    type: Function,
    default: () => true,
  },
  hasCustomValidator: {
    type: Boolean,
    default: false,
  },
  hasResolver: {
    type: Boolean,
    default: true,
  },
})

const model = defineModel<string>({
  required: false,
})

onMounted(() => {
  // Set initial value from model if available
  if (model.value) {
    toAddress.value = model.value
    debouncedToAddress({ target: { value: model.value } })
  }
})

// Look for address book being set immediately

watch(model, (newValue, oldValue) => {
  if (newValue && oldValue === '') {
    toAddress.value = newValue
    debouncedToAddress({ target: { value: newValue } })
  }
})

const store = useAddressBookStore()
const { currentAddressBook } = storeToRefs(store)

const toAddress = ref('')
const resolvedAddress = ref('')
const addressSearch = ref('')
const isAddressBookOpen = ref(false)

const resolver = computed(() => {
  if (!props.hasResolver) return null
  const chainsStore = useChainsStore()
  const { selectedChain } = storeToRefs(chainsStore)
  return new ENSNameResolver(selectedChain.value?.chainID || '1')
})

const addressBlockie = computed(() => {
  const addressToCheck = resolvedAddress.value || toAddress.value
  if (!addressToCheck) return ''
  return createIcon(addressToCheck)
})

const debouncedToAddress = useDebounceFn(
  async e => {
    if (e.target.value) {
      addressErrorMessages.value = ''
      resolvedAddress.value = ''
      toAddress.value = e.target.value
      // skips the rest of the function if custom validator is provided
      if (!props.hasCustomValidator) {
        model.value = toAddress.value
        validateAddressInput()
        return
      }
      try {
        const locResolvedAddr = await resolver.value?.resolveName(
          toAddress.value,
        )
        resolvedAddress.value = locResolvedAddr ?? ''
        model.value = locResolvedAddr ?? ''
      } catch {
        if (!isValidAddress(toAddress.value)) {
          resolvedAddress.value = ''
          model.value = toAddress.value
        } else {
          const locResolvedAddr = toChecksumAddress(toAddress.value)
          resolvedAddress.value = locResolvedAddr
          model.value = locResolvedAddr
        }
      }
    } else {
      resolvedAddress.value = ''
      toAddress.value = ''
      model.value = ''
    }
    validateAddressInput()
  },
  350,
  { maxWait: 2000 },
)

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

const cleatAdrInput = () => {
  setInFocusInput()
  nextTick(() => {
    toAddress.value = ''
    resolvedAddress.value = ''
    model.value = ''
    validateAddressInput()
  })
}

const setAddress = (address: string) => {
  toAddress.value = address
  resolvedAddress.value = ''
  isAddressBookOpen.value = false
  clearSearch()
  model.value = address
}

/**------------------------
 * Error State
 -------------------------*/
//NOTE: Can be set as a vmodel, that way parent component can show/hide error messages
const addressErrorMessages = ref('')

const hasError = computed(() => {
  return addressErrorMessages.value !== ''
})

/**
 * Validates the address input.
 * Checks if the address is empty, valid, and has a valid checksum.
 * Sets error messages accordingly.
 * @returns {boolean} - Returns true if the address is valid, false otherwise.
 */
const validateAddressInput = async () => {
  addressErrorMessages.value = ''
  const addressToCheck = resolvedAddress.value || toAddress.value
  if (addressToCheck === '') {
    addressErrorMessages.value = 'address is required'
    return false
  }
  if (props.hasCustomValidator) {
    if (!(await props.customValidator(addressToCheck))) {
      addressErrorMessages.value = 'invalid address'
      return false
    }

    return true
  }
  if (
    !isAddress(addressToCheck) &&
    !(
      resolver.value?.isValidName(addressToCheck) &&
      resolvedAddress.value !== ''
    )
  ) {
    addressErrorMessages.value = 'invalid address'
    return false
  }
  return true
}

/**------------------------
 * Focus State
 -------------------------*/

const adrInput = ref<HTMLElement | null>(null)
const { inFocusInput, setInFocusInput, startOutOfFocusTimeout } =
  useInFocusInput(adrInput)

//Validate address input when it loses focus
watch(inFocusInput, newValue => {
  if (!newValue) {
    validateAddressInput()
  }
})

// Reset input focus when address book is closed
watch(isAddressBookOpen, (newIsOpen, oldIsOpen) => {
  if (!newIsOpen && oldIsOpen) {
    nextTick(() => {
      setInFocusInput()
    })
  }
})
</script>
