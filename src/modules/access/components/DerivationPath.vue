<template>
  <div>
    <button
      class="hoverNoBG py-2 px-3 rounded-16 w-full shadow-button shadow-button-elevated min-h-[52px]"
      @click="setOpenDialog(true)"
    >
      <div class="flex items-center">
        <div class="mr-2 ml-1">
          <p class="text-info text-left text-s-12 leading-[16px] capitalize">
            {{ $t('derivation_path.title') }}
          </p>
          <p
            v-if="selectedPath"
            class="text-ellipsis truncate font-medium text-sm"
          >
            {{ selectedPath.label }}
            <span class="text-info text-s-12 leading-[16px]">
              - {{ selectedPath.path }}</span
            >
          </p>
        </div>
        <chevron-down-icon class="w-4 h-4 ml-auto mr-1" />
      </div>
    </button>

    <!-- Dialog with chains list -->
    <app-dialog
      v-model:is-open="openDialog"
      class="xs:max-w-[428px] sm:mx-auto"
    >
      <template #title>
        <div class="flex items-center pr-2 pt-4 sm:pt-6 xl:pt-8">
          <app-btn-icon
            v-if="showAddPath"
            :label="$t('common.go_back')"
            class="-ml-3 mr-3"
            @click="setShowAddPath(false)"
          >
            <ArrowLeftIcon class="w-5 h-5" />
          </app-btn-icon>
          <h1 class="text5 font-bold">
            {{ dialogTitle }}
          </h1>
        </div>
      </template>
      <template #content>
        <div class="h-[95vh] sm:h-[500px] !overflow-y-scroll">
          <transition name="fade" mode="out-in">
            <!--PATH LIST-->
            <div v-if="!showAddPath">
              <!-- Seacrh -->
              <div class="sticky top-0 bg-white z-10">
                <div class="px-3 mb-1 flex items-center gap-2">
                  <app-search-input
                    v-model="searchInput"
                    class="grow"
                    :placeholder="$t('derivation_path.search')"
                  />
                  <app-base-button
                    class="!px-4 !py-2 !rounded-full !text-s-12 mr-2"
                    @click="setShowAddPath(true)"
                    >{{ $t('common.add') }}</app-base-button
                  >
                </div>
                <hr class="h-px bg-grey-outline border-0 w-full" />
              </div>
              <!-- Seacrh Result-->
              <div v-if="searchResults.length" class="flex flex-col px-2 mt-2">
                <button
                  v-for="(path, index) in searchResults"
                  :key="`${path.path}-${index}-${path.label}`"
                  class="flex items-center justify-between px-5 py-3 cursor-pointer hoverNoBG rounded-xl box-border"
                  @click="setSelectedPath(path)"
                >
                  <div class="flex justify-between items-center w-full">
                    <p>{{ path.label }}</p>
                    <p class="text-info">{{ path.path }}</p>
                  </div>
                </button>
              </div>
              <!-- Seacrh not found-->
              <div v-else>
                <div class="flex justify-center mt-10 h-[400px] text-info">
                  <p>{{ $t('derivation_path.not_found') }} {{ searchInput }}</p>
                </div>
              </div>
            </div>
            <!-- Add Path-->
            <div v-else class="px-5">
              <app-input
                v-model="newPathLabel"
                :placeholder="$t('derivation_path.enter_label')"
                is-required
                class="mt-4"
              />
              <app-input
                v-model="newPath"
                :placeholder="$t('derivation_path.enter_path')"
                is-required
              />
              <div class="flex items-center flex-col justify-center mt-3">
                <app-base-button class="!py-3">{{
                  $t('common.add')
                }}</app-base-button>
                <app-btn-text
                  class="text-primary mt-4"
                  is-large
                  @click="setShowAddPath(false)"
                  >{{ $t('common.cancel') }}</app-btn-text
                >
              </div>
            </div>
          </transition>
        </div>
      </template>
    </app-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppInput from '@/components/AppInput.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import { ArrowLeftIcon } from '@heroicons/vue/24/solid'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import AppDialog from '@/components/AppDialog.vue'
import AppSearchInput from '@/components/AppSearchInput.vue'
import { WALLET_TYPES } from '../common/walletConfigs'
import Bip44Paths from '../common/bip44'
import {
  type DerivationPath,
  ethereum as ethereumPath,
} from '../common/configs/configPaths'
import { useI18n } from 'vue-i18n'
import { useDerivationStore } from '@/stores/derivationStore'
import { storeToRefs } from 'pinia'
import { useChainsStore } from '@/stores/chainsStore'
import BitcoinWallet from '@/providers/bitcoin/mnemonicToBitcoinWallet'

const { t } = useI18n()
defineProps({
  isBtnGroup: {
    type: Boolean,
    default: false,
  },
})

const chainStore = useChainsStore()
const derivationStore = useDerivationStore()
const { selectedDerivation } = storeToRefs(derivationStore)
const { setSelectedDerivation: setToStore } = derivationStore
const { selectedChain } = storeToRefs(chainStore)
// TODO: handle DOT and SOL later on
const defaultPath =
  selectedChain.value?.type === 'EVM'
    ? Bip44Paths[WALLET_TYPES.MNEMONIC]
    : selectedChain.value?.type === 'BITCOIN'
      ? BitcoinWallet.getSupportedPaths(selectedChain.value.name)
      : Bip44Paths[WALLET_TYPES.MNEMONIC]
const paths = ref(defaultPath)
const initialDefaultPath =
  selectedChain.value?.type === 'EVM'
    ? ethereumPath
    : selectedChain.value?.type === 'BITCOIN'
      ? BitcoinWallet.getSupportedPaths(selectedChain.value.name)[0]
      : ethereumPath

const selectedPath = defineModel<DerivationPath>('selectedPath', {
  // type: Object as () => DerivationPath,
  // required: true,
})

const setSelectedPath = (path: DerivationPath) => {
  selectedPath.value = path
  setToStore(path)
  setOpenDialog(false)
}

onMounted(() => {
  setPaths()
})

watch(
  selectedPath,
  newValue => {
    if (newValue) {
      setToStore(newValue)
    }
  },
  { immediate: true },
)

watch(
  () => selectedChain.value,
  newValue => {
    if (newValue) {
      setPaths()
      // reset search input
      searchInput.value = ''
    }
  },
)

const setPaths = () => {
  if (selectedDerivation.value) {
    selectedPath.value = selectedDerivation.value
  }

  // set path automatically if chain type differs from current selected path
  if (selectedChain.value?.type !== selectedPath.value?.type) {
    if (selectedChain.value?.type === 'EVM') {
      selectedPath.value = ethereumPath
    } else if (selectedChain.value?.type === 'BITCOIN') {
      selectedPath.value = BitcoinWallet.getSupportedPaths(
        selectedChain.value.name,
      )[0]
    } else {
      selectedPath.value = initialDefaultPath
    }
    setToStore(selectedPath.value!)
  } else {
    if (selectedChain.value?.type === 'BITCOIN' && selectedPath.value) {
      // ensure selected path is supported by the selected bitcoin chain
      const supportedPaths = BitcoinWallet.getSupportedPaths(
        selectedChain.value.name,
      )
      selectedPath.value = supportedPaths[0]
      setToStore(selectedPath.value!)
    }
  }
}
/** -------------------------------
 * Dialog
 -------------------------------*/
const openDialog = ref(false)
const setOpenDialog = (value: boolean) => {
  openDialog.value = value
}

/** -------------------------------
 * Search
 -------------------------------*/
const searchInput = ref('')
const searchResults = computed(() => {
  if (!searchInput.value || searchInput.value === '') {
    return paths.value
  }
  const search = searchInput.value.toLowerCase()
  const beginsWithLabel = paths.value.filter(path => {
    return path.label.toLowerCase().startsWith(search)
  })
  const beginsWithPath = paths.value.filter(path => {
    return path.path.toLowerCase().startsWith(search)
  })
  const other = paths.value.filter(path => {
    return (
      path.label.toLowerCase().includes(search) ||
      path.path.toLowerCase().includes(search)
    )
  })
  const unique = new Set([...beginsWithLabel, ...beginsWithPath, ...other])
  return [...unique]
})

/** -------------------------------
 * Add A Path
 -------------------------------*/
const showAddPath = ref(false)
const setShowAddPath = (value: boolean) => {
  showAddPath.value = value
}

const dialogTitle = computed(() => {
  return showAddPath.value
    ? t('derivation_path.add_path')
    : t('derivation_path.select_path')
})

const newPathLabel = ref('')
const newPath = ref('')
</script>
