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
                {{ selectedChain?.nameLong }} Addresses
              </p>
              <address-book-item
                v-for="adr in currentChainOnlyAdrs"
                :key="adr.address"
                :adr="adr"
                @edit="editItem"
                @delete="deleteAddress"
              />
              <p
                v-if="otherChainsAdrs.length"
                class="font-medium text-s-17 mb-2 mx-5 mt-10"
              >
                Non-{{ selectedChain?.nameLong }} Compatible Addresses
              </p>
              <address-book-item
                v-for="adr in otherChainsAdrs"
                :key="adr.address"
                :adr="adr"
                show-chain
                @edit="editItem"
                @delete="deleteAddress"
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
                v-for="adr in otherAddressBook"
                :key="adr.address"
                :adr="adr"
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
import AddAddress from './AddAddress.vue'
import { ref, computed } from 'vue'
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

defineProps({
  label: {
    type: String,
    default: '',
  },
  network: {
    type: String,
    required: false,
  },
  selectedAddress: {
    type: String,
    default: '',
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
  { name: ' Recent', id: 'recent' },
])

const selectedListItem = ref<AddressListItem>(addressList.value[0])

/**------------------------
 * Items
 -------------------------*/

const adrBook = useAddressBookStore()
const { currentAddressBook, otherAddressBook } = storeToRefs(adrBook)

const deleteAddress = (adr: Address) => {
  adrBook.removeAddress(adr, adr.chainType)
}

/**------------------------
 * Chains Store
 -------------------------*/
const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)
const currentChainOnlyAdrs = computed(() => {
  return currentAddressBook.value.filter(
    item => item.chainName === selectedChain.value?.name,
  )
})
const otherChainsAdrs = computed(() => {
  return currentAddressBook.value.filter(
    item => item.chainName !== selectedChain.value?.name,
  )
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

/** -------------------------------
 * Search
 -------------------------------*/
const searchInput = ref('')
</script>
