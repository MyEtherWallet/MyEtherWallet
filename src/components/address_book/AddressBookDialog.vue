<template>
  <app-dialog
    v-model:is-open="isOpen"
    class="w-full max-w-[460px] mx-auto min-h-[600px]"
  >
    <template #title>
      <div class="px-4 sm:px-6 pt-4 sm:pt-6">
        <div class="flex items-center">
          <app-btn-icon
            v-if="showAddAddress"
            :label="$t('common.go_back')"
            class="-ml-3 mr-3"
            @click="closeAddEdit"
          >
            <ArrowLeftIcon class="w-5 h-5" />
          </app-btn-icon>
          <h1 class="text-s-28 font-bold">
            {{ dialogTitle }}
          </h1>
        </div>
      </div>
    </template>
    <template #content>
      <div class="pb-10">
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
            <div class="sticky top-0 bg-white z-10 pt-2">
              <div class="px-4 sm:px-6 flex items-center gap-3">
                <app-search-input
                  v-model="searchInput"
                  class="grow"
                  :placeholder="$t('common.search_by_name_or_address')"
                  bg-class="bg-surface"
                />
                <app-base-button
                  size="medium"
                  class="!px-5 !min-h-[40px] !text-s-15"
                  @click="showAddAddress = true"
                >
                  {{ $t('common.add') }}
</app-base-button>
              </div>
            </div>

            <!-- Filters -->
            <app-btn-group
              v-model:selected="selectedListItem"
              :btn-list="addressList"
              class="mt-6 mb-4 px-4 sm:px-6"
              size="medium"
              variant="outline"
            >
              <template #btn-content="{ data }">
                {{ data.name }}
              </template>
            </app-btn-group>
            <div class="px-3 sm:px-5">
              <!-- Compatible -->
              <p
                v-if="currentChainOnlyAdrs.length"
                class="font-medium text-s-17 mb-2 px-2"
              >
                {{
                  selectedListItem.id === 'recent'
                    ? $t('address_book.recent_transactions')
                    : $t('address_book.chain_addresses', { chain: network?.nameLong || selectedChain?.nameLong })
                }}
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
                class="font-medium text-s-17 mb-2 px-2 mt-6"
              >
                {{ $t('address_book.non_compatible', { chain: network?.nameLong || selectedChain?.nameLong }) }}
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
                class="text-s-17 mb-2 px-2 mt-6 text-info text-center"
              >
                {{ $t('address_book.no_saved_addresses') }}
              </p>

              <p
                v-if="otherAddressBook.length"
                class="font-medium text-s-17 mb-2 px-2 mt-6"
              >
                {{ $t('address_book.incompatible_addresses') }}
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
import { ref, computed, watch, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
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

const { t } = useI18n()

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

const addressList = computed<AddressListItem[]>(() => [
  { name: t('address_book.recent'), id: 'recent' },
  { name: t('address_book.saved'), id: 'addresses' },
])

const selectedListItem = ref<AddressListItem>(addressList.value[0])

watch(addressList, newList => {
  const refreshed = newList.find(item => item.id === selectedListItem.value.id)
  if (refreshed) selectedListItem.value = refreshed
})

/**------------------------
 * Items
 -------------------------*/

const adrBook = useAddressBookStore()
const { addressBook } = storeToRefs(adrBook)

const deleteAddress = (adr: Address) => {
  if (selectedListItem.value.id === 'recent') {
    adrBook.removeRecentAddress(adr, _chain.value?.name)
  } else {
    adrBook.removeAddress(adr, adr.chainType)
  }
}

const _chain = computed(() => {
  return props.network || selectedChain.value
})

const deduplicate = (list: Address[]) => {
  const seen = new Set()
  return list.filter(item => {
    const adr = item.address.toLowerCase()
    if (seen.has(adr)) return false
    seen.add(adr)
    return true
  })
}

const currentAddressBook = computed<Address[]>(() => {
  let list: Address[] = []
  if (selectedListItem.value.id === 'recent') {
    list = addressBook.value.recent[_chain.value?.name || ''] || []
    list = list.map(adr => {
      const saved = adrBook.inAddressBook(adr.address, _chain.value?.type || '')
      return typeof saved === 'object' ? saved : adr
    })
  } else {
    list =
      _chain.value?.type && addressBook.value.saved[_chain.value.type]
        ? addressBook.value.saved[_chain.value.type].filter(item => !!item.name)
        : []
  }
  return deduplicate(list)
})

const otherAddressBook = computed(() => {
  if (selectedListItem.value.id === 'recent') return []

  const keys = Object.keys(addressBook.value.saved).filter(
    key => key !== _chain.value?.type,
  )

  const list = keys.flatMap(key => addressBook.value.saved[key])
  return deduplicate(list)
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
      ? t('address_book.edit_address')
      : t('address_book.add_address')
    : t('address_book.title')
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
