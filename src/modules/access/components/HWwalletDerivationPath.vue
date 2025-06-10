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
              - {{ selectedPath.basePath }}</span
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
          <h1 class="text5 font-bold">
            {{ $t('derivation_path.select_path') }}
          </h1>
        </div>
      </template>
      <template #content>
        <div class="h-[95vh] sm:h-[500px] !overflow-y-scroll">
          <!--PATH LIST-->
          <div>
            <!-- Seacrh -->
            <div class="sticky top-0 bg-white z-10">
              <div class="px-3 mb-1 flex items-center gap-2">
                <app-search-input
                  v-model="searchInput"
                  class="grow"
                  :placeholder="$t('derivation_path.search')"
                />
              </div>
              <hr class="h-px bg-grey-outline border-0 w-full" />
            </div>
            <!-- Seacrh Result-->
            <div v-if="searchResults.length" class="flex flex-col px-2 mt-2">
              <button
                v-for="(path, index) in searchResults"
                :key="`${path.basePath}-${index}-${path.label}`"
                class="flex items-center justify-between px-5 py-3 cursor-pointer hoverNoBG rounded-xl box-border"
                @click="setSelectedPath(path)"
              >
                <div class="flex justify-between items-center w-full">
                  <p>{{ path.label }}</p>
                  <p class="text-info">{{ path.basePath }}</p>
                </div>
              </button>
            </div>
            <!-- Seacrh not found-->
            <div v-else>
              <div class="flex justify-center mt-10 h-[400px] text-info">
                <p>{{ $t('derivation_path.not_found') }}: {{ searchInput }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </app-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import AppDialog from '@/components/AppDialog.vue'
import AppSearchInput from '@/components/AppSearchInput.vue'
import { useDerivationStore } from '@/stores/derivationStore'
import { storeToRefs } from 'pinia'
import type { PathType } from '@/stores/derivationStore'
import { HWwalletType } from '@enkryptcom/types'

const props = defineProps({
  isBtnGroup: {
    type: Boolean,
    default: false,
  },
  paths: {
    type: Array as () => PathType[],
    required: true,
  },
  walletType: {
    type: String as () => HWwalletType | null,
    default: HWwalletType.trezor,
  },
})

const derivationStore = useDerivationStore()
const { trezorSelectedDerivation, ledgerSelectedDerivation } =
  storeToRefs(derivationStore)
const { setSelectedTrezorDerivation, setSelectedLedgerDerivation } =
  derivationStore

const selectedPath = defineModel<PathType>('selectedPath', {})

const setSelectedPath = (path: PathType) => {
  selectedPath.value = path
  storeHardwarePath(path)
  setOpenDialog(false)
}

const storeHardwarePath = (path: PathType) => {
  if (props.walletType === HWwalletType.ledger) {
    setSelectedLedgerDerivation(path)
  } else if (props.walletType === HWwalletType.trezor) {
    setSelectedTrezorDerivation(path)
  }
}

onMounted(() => {
  if (props.walletType === HWwalletType.ledger) {
    selectedPath.value = ledgerSelectedDerivation.value as PathType
  } else if (props.walletType === HWwalletType.trezor) {
    selectedPath.value = trezorSelectedDerivation.value as PathType
  } else {
    selectedPath.value = props.paths[0]
  }
})

watch(
  () => selectedPath.value,
  (newValue: PathType | undefined) => {
    if (newValue) {
      storeHardwarePath(newValue)
    }
  },
  { immediate: true },
)

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
    return props.paths
  }
  const search = searchInput.value.toLowerCase()
  const beginsWithLabel = props.paths.filter((path: PathType) => {
    return path.label.toLowerCase().startsWith(search)
  })
  const beginsWithPath = props.paths.filter((path: PathType) => {
    return path.basePath?.toLowerCase().startsWith(search)
  })
  const other = props.paths.filter((path: PathType) => {
    return (
      path.label.toLowerCase().includes(search) ||
      path.basePath?.toLowerCase().includes(search)
    )
  })
  const unique = new Set([...beginsWithLabel, ...beginsWithPath, ...other])
  return [...unique]
})
</script>
