<template>
  <div class="flex flex-col gap-5">
    <AccessStepIndicator :step="accessStep" />

    <!-- Step 1: enter the phrase -->
    <template v-if="accessStep === 1">
      <AccessBanner
        :title="$t('access_wallet.advanced.banner_title')"
        :text="$t('access_wallet.advanced.banner_phrase')"
      />
      <AppTextField
        v-model="mnemonic"
        @keydown.enter.prevent="unlockWallet"
        data-private
        :placeholder="$t('access_wallet.advanced.phrase_placeholder')"
        :error-message="
          hasMnemonicError ? $t('access_wallet.advanced.invalid_phrase') : ''
        "
        :feedback="{
          type: 'text',
          message: $t('access_wallet.advanced.phrase_helper'),
        }"
      />
      <div class="flex items-center gap-2">
        <AppIcon name="lock-closed" size="xxs" class="text-text-subtle" />
        <span class="grow text-sm">
          {{ $t('access_wallet.advanced.add_passphrase') }}
        </span>
        <AppToggle
          v-model="hasExtraWord"
          :aria-label="$t('access_wallet.advanced.add_passphrase')"
        />
      </div>
      <AppInput
        v-if="hasExtraWord"
        v-model="extraWord"
        :submit-disabled="!isValid"
        @enter="unlockWallet"
        data-private
        type="password"
        :label="$t('access_wallet.advanced.passphrase')"
      />
      <AppBaseButton
        data-testid="phrase-continue"
        class="w-full"
        :class="PRIMARY_DISABLED_CLASS"
        :disabled="!isValid"
        @click="unlockWallet"
      >
        {{ $t('access_wallet.advanced.continue') }}
      </AppBaseButton>
    </template>

    <!-- Step 2: pick network, path and address -->
    <template v-else>
      <div class="grid grid-cols-1 gap-2 xs:grid-cols-2">
        <AccessDropdown
          :label="$t('access_wallet.advanced.network')"
          :items="mnemonicChains"
          :model-value="selectedChain ?? undefined"
          :search-placeholder="$t('access_wallet.networks.search')"
          :empty-text="$t('access_wallet.networks.not_found')"
          :item-key="chainKey"
          :search-text="chainSearchText"
          @update:model-value="accessStore.setSelectedChain"
        >
          <template #selected="{ item }">
            <AppAvatar v-if="item" type="network" size="s" :chain="item.name" />
            <span class="truncate">{{ item?.nameLong }}</span>
          </template>
          <template #item="{ item }">
            <AppAvatar type="network" size="s" :chain="item.name" />
            <span class="text-sm">{{ item.nameLong }}</span>
          </template>
        </AccessDropdown>
        <AccessDropdown
          :label="$t('access_wallet.advanced.derivation_path')"
          :items="paths"
          :model-value="selectedDerivation"
          :search-placeholder="$t('derivation_path.search')"
          :empty-text="$t('access_wallet.advanced.no_paths')"
          :item-key="pathKey"
          :search-text="pathSearchText"
          @update:model-value="setSelectedDerivation"
        >
          <template #selected="{ item }">
            <span class="truncate">{{ item?.path }}</span>
          </template>
          <template #item="{ item }">
            <span class="grow font-semibold">{{ item.label }}</span>
            <span class="shrink-0 text-text-subtle">{{ item.path }}</span>
          </template>
        </AccessDropdown>
      </div>
      <MnemonicAddressList
        v-model="selectedIndex"
        :entries="walletList"
        :is-loading="isLoadingWalletList"
        :balances-error="balancesError"
        :currency="selectedChain?.currencyName"
        @show-more="loadAddresses(false)"
        @retry="retryBalances"
      />
      <AppBaseButton
        data-testid="phrase-connect"
        class="w-full"
        :class="PRIMARY_DISABLED_CLASS"
        :disabled="!walletList.length || derivationPending"
        :is-loading="isUnlockingWallet"
        @click="access"
      >
        {{ $t('create_wallet.connect') }}
      </AppBaseButton>
    </template>

    <AccessHelpFooter />
  </div>
</template>

<script setup lang="ts">
import { PRIMARY_DISABLED_CLASS } from '@/modules/access/common/buttonStyles'
import { computed, ref, shallowRef, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { validateMnemonic } from 'bip39'
import { watchDebounced } from '@vueuse/core'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppInput from '@/components/AppInput.vue'
import AppTextField from '@/components/AppTextField.vue'
import AppToggle from '@/components/AppToggle.vue'
import AccessBanner from './components/AccessBanner.vue'
import AccessDropdown from './components/AccessDropdown.vue'
import AccessHelpFooter from './components/AccessHelpFooter.vue'
import AccessStepIndicator from './components/AccessStepIndicator.vue'
import MnemonicAddressList from './components/MnemonicAddressList.vue'
import { type SelectAddress } from './types/selectAddress'
import Bip44Paths from './common/bip44'
import {
  ethereum as ethereumPath,
  type DerivationPath,
} from './common/configs/configPaths'
import {
  WALLET_TYPES,
  walletConfigs,
} from '@/modules/access/common/walletConfigs'
import MnemonicToWallet from '@/providers/ethereum/mnemonicToWallet'
import MnemonicToBitcoinWallet from '@/providers/bitcoin/mnemonicToBitcoinWallet'
import { useAccessStore } from '@/stores/accessStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useDerivationStore } from '@/stores/derivationStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useRecentWalletsStore } from '@/stores/recentWalletsStore'
import { useWalletStore } from '@/stores/walletStore'
import type { Chain } from '@/mew_api/types'
import {
  fetchNativeBalances,
  formatNativeBalance,
} from '@/composables/useNativeBalances'
import { analytics, ConnectWalletEvent } from '@/analytics'

const accessStore = useAccessStore()
const { selectedChain, accessStep } = storeToRefs(accessStore)
const { chains } = storeToRefs(useChainsStore())
const derivationStore = useDerivationStore()
const { selectedDerivation } = storeToRefs(derivationStore)
const { setSelectedDerivation } = derivationStore
const { setSelectedNetwork } = useGlobalStore()
const { setWallet } = useWalletStore()
const { addWallet } = useRecentWalletsStore()

/**------------------------
 * Step 1: phrase + passphrase
 -------------------------*/
const mnemonic = ref('')
const hasMnemonicError = ref(false)
const hasExtraWord = ref(false)
const extraWord = ref('')

const formattedMnemonic = computed(() => {
  const words = mnemonic.value.match(/\b(\w+)\b/g)
  return words ? words.join(' ') : ''
})
const isValid = computed(() => validateMnemonic(formattedMnemonic.value))

watchDebounced(
  mnemonic,
  () => {
    hasMnemonicError.value = mnemonic.value !== '' && !isValid.value
  },
  { debounce: 2000 },
)

/**------------------------
 * Step 2: network + derivation path
 -------------------------*/
const isBitcoin = computed(() => selectedChain.value?.type === 'BITCOIN')

/** Mnemonic wallets exist for EVM and Bitcoin-family chains only. */
const mnemonicChains = computed(() =>
  chains.value.filter(
    chain => chain.type === 'EVM' || chain.type === 'BITCOIN',
  ),
)
const chainKey = (chain: Chain) => chain.name
const chainSearchText = (chain: Chain) => chain.nameLong

const paths = computed<DerivationPath[]>(() =>
  isBitcoin.value
    ? MnemonicToBitcoinWallet.getSupportedPaths(
        selectedChain.value?.name ?? 'BITCOIN',
      )
    : Bip44Paths[WALLET_TYPES.MNEMONIC],
)
const pathKey = (path: DerivationPath) => `${path.label}:${path.path}`
const pathSearchText = (path: DerivationPath) => `${path.label} ${path.path}`

// A stored path from another chain family can't derive on this chain: fall back
// to the chain's default (Ethereum's for EVM, the first supported one for Bitcoin).
const syncPathToChain = () => {
  if (!selectedChain.value) return
  const current = selectedDerivation.value
  const supported = paths.value.some(path => path.path === current?.path)
  if (current?.type === selectedChain.value.type && supported) return
  setSelectedDerivation(isBitcoin.value ? paths.value[0] : ethereumPath)
}

/**------------------------
 * Wallet + address list
 -------------------------*/
const PAGE_SIZE = 5
const wallet = ref<MnemonicToWallet | MnemonicToBitcoinWallet | null>(null)
// Replaced, never mutated; shallow keeps wallet instances out of deep reactivity.
const walletList = shallowRef<SelectAddress[]>([])
const isLoadingWalletList = ref(false)
const balancesError = ref(false)
const selectedIndex = ref(0)
/** Path the current wallet was derived with, so the watcher only rebuilds on a real change. */
const builtFor = ref({ chain: '', path: '' })
/** The picked chain or path hasn't been derived yet (re-derive is debounced). */
const derivationPending = computed(
  () =>
    builtFor.value.chain !== (selectedChain.value?.name ?? '') ||
    builtFor.value.path !== (selectedDerivation.value?.path ?? ''),
)

const unlockWallet = () => {
  if (!isValid.value) return
  syncPathToChain()
  const options = {
    mnemonic: formattedMnemonic.value,
    basePath: selectedDerivation.value?.path || ethereumPath.path,
    chainId: selectedChain.value?.chainID ?? '1',
    // A passphrase typed and then toggled off must not leak into derivation.
    extraWord: hasExtraWord.value ? extraWord.value : '',
    chainName: selectedChain.value?.name || 'ETHEREUM',
  }
  wallet.value =
    selectedChain.value?.type === 'EVM'
      ? new MnemonicToWallet(options)
      : new MnemonicToBitcoinWallet(options)
  builtFor.value = {
    chain: selectedChain.value?.name ?? '',
    path: selectedDerivation.value?.path ?? '',
  }
  accessStep.value = 2
  loadAddresses(true)
}

// Bumped on every list reset so a superseded load (chain / path change) stops
// before it writes into the newer list or fires its balance request.
let listGeneration = 0

const loadBalances = async (entries: SelectAddress[]) => {
  const chain = selectedChain.value
  if (!entries.length || !chain) return
  const generation = listGeneration
  try {
    const balances = await fetchNativeBalances(
      chain,
      entries.map(entry => entry.address),
    )
    if (generation !== listGeneration) return
    const indexes = new Set(entries.map(entry => entry.index))
    walletList.value = walletList.value.map(entry => {
      if (!indexes.has(entry.index)) return entry
      const raw = balances.get(entry.address.toLowerCase())
      return {
        ...entry,
        balance: raw === undefined ? '0' : formatNativeBalance(raw, chain.type),
      }
    })
    balancesError.value = false
  } catch {
    // Addresses stay connectable without balances (e.g. a rate-limited endpoint).
    if (generation === listGeneration) balancesError.value = true
  }
}

const retryBalances = () => loadBalances(walletList.value)

const loadAddresses = async (reset: boolean) => {
  if (reset) {
    listGeneration++
    walletList.value = []
    balancesError.value = false
  }
  const generation = listGeneration
  isLoadingWalletList.value = true
  const start = walletList.value.length
  const entries: SelectAddress[] = []
  for (let i = start; i < start + PAGE_SIZE; i++) {
    const instance = await wallet.value?.getWallet(i)
    if (generation !== listGeneration) return
    if (instance) {
      entries.push({
        address: await instance.getAddress(),
        index: i,
        balance: '',
      })
    }
  }
  if (generation !== listGeneration) return
  walletList.value = [...walletList.value, ...entries]
  if (reset && entries.length) selectedIndex.value = entries[0].index
  isLoadingWalletList.value = false
  await loadBalances(entries)
}

watchDebounced(
  () => [selectedChain.value?.name, selectedDerivation.value?.path] as const,
  ([chainName, path], [oldChainName]) => {
    if (accessStep.value !== 2 || !wallet.value) return
    if (path !== builtFor.value.path) {
      unlockWallet() // new derivation path → rebuild the wallet
    } else if (chainName !== oldChainName) {
      syncPathToChain()
      // Same family keeps the path, so only balances change; a family switch
      // changed the path above and the next run of this watcher rebuilds.
      if (selectedDerivation.value?.path === builtFor.value.path) {
        builtFor.value = { ...builtFor.value, chain: chainName ?? '' }
        loadAddresses(true)
      }
    }
  },
  { debounce: 500 },
)

// Going back to step 1 (header Back) starts over, like the old Back button.
watch(accessStep, step => {
  if (step !== 1) return
  listGeneration++
  wallet.value = null
  walletList.value = []
  mnemonic.value = ''
  extraWord.value = ''
  hasExtraWord.value = false
})

/**------------------------
 * Connect
 -------------------------*/
const isUnlockingWallet = ref(false)

const access = async () => {
  isUnlockingWallet.value = true
  try {
    const instance = await wallet.value?.getWallet(selectedIndex.value)
    if (instance) {
      setWallet(instance, 'mnemonic', walletConfigs.mnemonic.type[0])
      addWallet(walletConfigs.mnemonic)
    }
    setSelectedNetwork(selectedChain.value?.name || '')
    analytics.trackConnectWalletEvent(ConnectWalletEvent.SUCCESS, {
      walletName: walletConfigs.mnemonic.id,
      walletType: walletConfigs.mnemonic.type[0],
      network: selectedChain.value?.name,
    })
    accessStore.closeAccessDialog()
  } finally {
    isUnlockingWallet.value = false
  }
}
</script>
