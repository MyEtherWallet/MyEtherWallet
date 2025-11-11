<template>
  <app-dialog
    v-model:is-open="isOpen"
    class="max-w-[500px] mx-auto min-h-[500px]"
  >
    <template #title>
      <div class="flex items-center pr-2 pt-4 sm:pt-6 xl:pt-8">
        <app-btn-icon
          v-if="showAddAddress"
          :label="$t('common.go_back')"
          class="-ml-3 mr-3"
          @click="closeAddEdit"
        >
          <ArrowLeftIcon class="w-5 h-5" />
        </app-btn-icon>
        <h1 class="text5 font-bold">
          {{ dialogTitle }}
        </h1>
      </div>
    </template>
    <template #content>
      <div class="mb-10">
        <transition name="fade" mode="out-in">
          <div v-if="showAddAddress" class="px-4 sm:px-6">
            <add-address
              :address-edit="editAdr"
              @close="closeAddEdit"
              @add-address="showAddAddress = false"
            />
          </div>

          <div v-else>
            <!-- Search -->
            <div class="sticky top-0 bg-white z-10">
              <div class="px-2 sm:px-5 mb-1 flex">
                <app-search-input
                  v-model="searchInput"
                  class="grow"
                  placeholder="Search by Name"
                />
                <app-base-button
                  size="medium"
                  class="ml-auto !px-5"
                  @click="showAddAddress = true"
                >
                  Add
                </app-base-button>
              </div>
              <hr class="h-px bg-grey-outline border-0 w-full mb-1" />
            </div>
            <!-- Filters -->
            <app-btn-group
              v-model:selected="selectedListItem"
              :btn-list="addressList"
              class="my-2 mx-3 sm:mx-6"
              size="small"
              variant="outline"
            >
              <template #btn-content="{ data }">
                {{ data.name }}
              </template>
            </app-btn-group>
            <div class="mx-3">
              <!-- Compatible -->
              <p
                v-if="currentChainOnlyAdrs.length"
                class="font-medium text-s-17 mb-2 mx-5 mt-5"
              >
                {{ network?.nameLong || selectedChain?.nameLong }} Addresses
              </p>
              <address-book-item
                v-for="adr in currentChainOnlyAdrs"
                :key="adr.address"
                :adr="adr"
                :isSelectable="!isStandAlone"
                :selected-address="selectedAddress"
                @edit="editItem"
                @delete="deleteAddress"
                @set-item="setItem"
              />
              <p
                v-if="otherChainsAdrs.length"
                class="font-medium text-s-17 mb-2 mx-5 mt-10"
              >
                Non-{{ network?.nameLong || selectedChain?.nameLong }}
                Compatible Addresses
              </p>
              <address-book-item
                v-for="adr in otherChainsAdrs"
                :key="adr.address"
                :adr="adr"
                :isSelectable="!isStandAlone"
                :selected-address="selectedAddress"
                show-chain
                @edit="editItem"
                @delete="deleteAddress"
                @set-item="setItem"
              />
              <p
                v-if="!otherChainsAdrs.length && !currentChainOnlyAdrs.length"
                class="text-s-17 mb-2 mx-5 mt-10 text-info text-center"
              >
                You do not have any saved addresses that are compatible with
                this network.
              </p>

              <p
                v-if="otherAddressBook.length"
                class="font-medium text-s-17 mb-2 mx-5 mt-10"
              >
                Incompatible Addresses
              </p>
              <address-book-item
                v-for="adr in incompatibleAddresses"
                :key="adr.address"
                :adr="adr"
                :isSelectable="false"
                @edit="editItem"
                @delete="deleteAddress"
                show-chain
              />
            </div>
          </div>
        </transition>
      </div>
    </template>
  </app-dialog>
</template>

<script lang="ts" setup>
/** Address Book Dialog
 * Displays a dialog with a list of saved addresses.
 * Allows users to search, add, edit, and delete addresses.
 *
 * NOTE: This component is used in the Address Book section of the application.
 * AS WELL AS Can be used alone.
 * When used alone, it allows users to edit and delete items.
 *
 */
import AddAddress from './AddAddress.vue'
import { ref, computed, type PropType } from 'vue'
import AppSearchInput from '@/components/AppSearchInput.vue'
import AppBaseButton from '../AppBaseButton.vue'
import AppBtnGroup from '../AppBtnGroup.vue'
import { storeToRefs } from 'pinia'
import { useAddressBookStore, type Address } from '@/stores/addressBook'
import AppDialog from '@components/AppDialog.vue'
import AppBtnIcon from '@components/AppBtnIcon.vue'
import { useChainsStore } from '@/stores/chainsStore'
import AddressBookItem from './AddressBookItem.vue'
import { ArrowLeftIcon } from '@heroicons/vue/24/solid'
import { searchArrayByKeysStr } from '@/utils/searchArray'
import type { Chain } from '@/mew_api/types'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  /**
   * @network - The network to filter addresses by.
   */
  network: {
    type: Object as PropType<Chain>,
  },
  selectedAddress: {
    type: String,
    default: '',
  },
  isStandAlone: {
    type: Boolean,
    default: false,
  },
})

const isOpen = defineModel<boolean>('isOpen', {
  default: false,
})

/**------------------------
 * Address List
 -------------------------*/

interface AddressListItem {
  name: string
  id: string
}

const addressList = ref<AddressListItem[]>([
  { name: 'Saved', id: 'addresses' },
  { name: 'Recent', id: 'recent' },
])

const selectedListItem = ref<AddressListItem>(addressList.value[0])

/**------------------------
 * Items
 -------------------------*/

const adrBook = useAddressBookStore()
const { addressBook } = storeToRefs(adrBook)

const deleteAddress = (adr: Address) => {
  adrBook.removeAddress(adr, adr.chainType)
}

const _chain = computed(() => {
  return props.network || selectedChain.value
})

const currentAddressBook = computed<Address[]>(() => {
  return _chain.value?.type && addressBook.value[_chain.value.type]
    ? addressBook.value[_chain.value?.type]
    : []
})

const otherAddressBook = computed(() => {
  const keys = Object.keys(addressBook.value).filter(
    key => key !== _chain.value?.type,
  )

  return keys.flatMap(key => addressBook.value[key])
})

/** -------------------------------
 * Search
 -------------------------------*/
const searchInput = ref('')

/**------------------------
 * Chains Store
 -------------------------*/
const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)

/**
 * Computed property to filter addresses for the current chain.
 */
const currentChainOnlyAdrs = computed(() => {
  const _net = props.network || selectedChain.value
  const list = currentAddressBook.value.filter(
    item => item.chainName === _net?.name,
  )
  if (searchInput.value) {
    return searchArrayByKeysStr(list, ['name', 'address'], searchInput.value)
  }
  return list
})

/**
 * Computed property to filter addresses for other chains.
 */
const otherChainsAdrs = computed(() => {
  const _net = props.network || selectedChain.value
  const list = currentAddressBook.value.filter(
    item => item.chainName !== _net?.name,
  )
  if (searchInput.value) {
    return searchArrayByKeysStr(list, ['name', 'address'], searchInput.value)
  }
  return list
})

const incompatibleAddresses = computed(() => {
  const list = otherAddressBook.value
  if (searchInput.value) {
    return searchArrayByKeysStr(list, ['name', 'address'], searchInput.value)
  }
  return list
})

/** -------------------------------
 * Add Address
 -------------------------------*/
const showAddAddress = ref(false)

const dialogTitle = computed(() => {
  return showAddAddress.value
    ? editAdr.value
      ? 'Edit Address'
      : 'Add Address'
    : 'Address Book'
})

const editAdr = ref<Address | undefined>(undefined)

const editItem = (adr: Address) => {
  editAdr.value = adr
  showAddAddress.value = true
}

const closeAddEdit = () => {
  showAddAddress.value = false
  editAdr.value = undefined
}

const emit = defineEmits<{
  (e: 'set-selected', address: string): void
}>()
const setItem = (adr: Address) => {
  emit('set-selected', adr.address)
  isOpen.value = false
}
</script>
