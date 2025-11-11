<template>
  <div class="flex justify-center w-full">
    <div class="max-w-[624px] flex flex-col items-center justify-center">
      <app-sheet class="mt-6">
        <div>
          <app-stepper
            :steps="walletSteps"
            :description="walletStepsDescription"
            :active-step="activeStep"
            @update:active-step="backStep"
          >
            <!-- Enter Mnemonic -->
            <div v-if="activeStep === 0">
              <app-step-description
                :description="walletStepsDescription[0]"
                :activeStep="activeStep"
              />
              <div class="flex items-center justify-center mt-[40px]">
                <app-base-button
                  @click="unlockWallet"
                  :is-loading="connectingWallet"
                  :disabled="connectingWallet"
                >
                  {{ connectButtonText }}
                </app-base-button>
              </div>
            </div>
            <!-- Select Network, Address, DP -->
            <div v-if="activeStep === 1">
              <app-step-description
                :description="walletStepsDescription[1]"
                :activeStep="activeStep"
              />
              <div
                class="grid grid-cols-1 xs:grid-cols-2 justify-space-beween gap-4 my-5"
              >
                <select-chain-for-app />
                <hardware-wallet-derivation
                  :paths="paths"
                  :wallet-type="selectedHwWalletType"
                />
              </div>
              <select-address-list
                v-model="selectedIndex"
                :walletList="walletList as SelectAddress[]"
                :isLoading="isLoadingWalletList"
                class="mt-5"
                @nextpage="setPage(true)"
                @prevpage="setPage(false)"
              />
              <div class="flex items-center flex-col justify-center">
                <app-base-button
                  @click="access"
                  :disabled="walletList.length === 0 || isLoadingWalletList"
                  class="mt-10"
                  :is-loading="isUnlockingWallet"
                >
                  {{ $t('common.access_wallet') }}
                </app-base-button>
                <app-btn-text
                  @click="backStep"
                  is-large
                  class="mt-2 text-primary"
                >
                  {{ $t('common.back') }}
                </app-btn-text>
              </div>
            </div>
          </app-stepper>
        </div>
      </app-sheet>
      <!-- TODO: add link-->
      <div
        class="mt-5 block text-info text-s-14 sm:text-s-17 leading-p-150 hoverOpacity"
      >
        {{ $t('wc_dialog.no_wallet') }}
        <span class="underline">
          {{ $t('wc_dialog.get_wallet') }}
          <span class="text-sm"> →</span></span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSheet from '@/components/AppSheet.vue'
import { ref, watch, markRaw, computed } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import AppStepper from '@/components/AppStepper.vue'
import AppStepDescription from '@/components/AppStepDescription.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import SelectAddressList from './components/SelectAddressList.vue'
import { type StepDescription } from '@/types/components/appStepper'
import { useWalletStore } from '@/stores/walletStore'
import { type SelectAddress } from './types/selectAddress'
import SelectChainForApp from '@/components/select_chain/SelectChainForApp.vue'
import HardwareWalletDerivation from './components/HWwalletDerivationPath.vue'
import { walletConfigs } from '@/modules/access/common/walletConfigs'
import { useRecentWalletsStore } from '@/stores/recentWalletsStore'
import { MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import { useI18n } from 'vue-i18n'
import { useDerivationStore } from '@/stores/derivationStore'
import { storeToRefs } from 'pinia'
import { useChainsStore } from '@/stores/chainsStore'
import HWwallet from '@enkryptcom/hw-wallets'
import { HWwalletType } from '@enkryptcom/types'
import { chainToEnum } from '@/providers/ethereum/chainToEnum'
import type { PathType } from '@/stores/derivationStore'
import type { Chain } from '@/mew_api/types'
import EvmHardwareWallet from '@/providers/ethereum/evmHardwareWallet'
import type { HexPrefixedString } from '@/providers/types'
import { fromWei } from 'web3-utils'
import type { WalletInterface } from '@/providers/common/walletInterface'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import type { WalletConfig } from '@/modules/access/common/walletConfigs'
import { NetworkNames } from '@enkryptcom/types'
import BtcHardwareWallet from '@/providers/bitcoin/btcHardwareWallet'
import { fromBase } from '@/utils/unit'

import { useAccessStore } from '@/stores/accessStore'
// store instantiation needs to be at the top level
// to avoid late initialization issues
const derivationStore = useDerivationStore()
const chainsStore = useChainsStore()
const { trezorSelectedDerivation, ledgerSelectedDerivation } =
  storeToRefs(derivationStore)
const { selectedChain, isEvmChain } = storeToRefs(chainsStore)
const recentWalletsStore = useRecentWalletsStore()
const { addWallet } = recentWalletsStore
const walletStore = useWalletStore()
const { setSelectedTrezorDerivation, setSelectedLedgerDerivation } =
  derivationStore
const { wallet } = storeToRefs(walletStore)
const { t } = useI18n()
// used to define which hardware wallet is being accessed
const accessStore = useAccessStore()

// Wallet instance
let hwWalletInstance: HWwallet | null = new HWwallet()
const { currentView } = storeToRefs(accessStore)

/**------------------------
 * Derivation Path
 -------------------------*/
const paths = ref<PathType[]>([])

/**------------------------
 * Steps
 -------------------------*/
const activeStep = ref(0)

/**
 * Wallet identifier
 *
 * route based selection since the enkrypt hw-wallets library
 * allows for uniformity in accessing different hardware wallets
 */
const selectedHwWalletType = computed(() => {
  switch (currentView.value) {
    case 'trezor':
      return HWwalletType.trezor
    case 'ledger':
      return HWwalletType.ledger
    default:
      return null
  }
})

const connectButtonText = computed(() => {
  switch (currentView.value) {
    case 'trezor':
      return t('access_wallet_trezor.connect')
    case 'ledger':
      return t('access_wallet_ledger.connect')
    default:
      return ''
  }
})

const walletStepsDescription: Ref<StepDescription[]> = computed(() => {
  switch (currentView.value) {
    case 'trezor':
      return [
        {
          title: t('access_wallet_trezor.step.step1.title'),
          description: t('access_wallet_trezor.step.step1.description'),
        },
        {
          title: t('access_wallet_trezor.step.step2.title'),
        },
      ]
    case 'ledger':
      return [
        {
          title: t('access_wallet_ledger.step.step1.title'),
          description: t('access_wallet_ledger.step.step1.description'),
        },
        {
          title: t('access_wallet_ledger.step.step2.title'),
        },
      ]
    default:
      return []
  }
})

const walletSteps = computed(() => {
  switch (currentView.value) {
    case 'trezor':
      return [
        t('access_wallet_trezor.step.step1.short'),
        t('access_wallet_trezor.step.step2.short'),
      ]
    case 'ledger':
      return [
        t('access_wallet_ledger.step.step1.short'),
        t('access_wallet_ledger.step.step2.short'),
      ]
    default:
      return []
  }
})

const selectedDerivation: ComputedRef<PathType | undefined> = computed(() => {
  switch (currentView.value) {
    case 'trezor':
      return trezorSelectedDerivation.value
    case 'ledger':
      return ledgerSelectedDerivation.value
    default:
      return {
        basePath: '',
        path: '',
        label: '',
      }
  }
})

const setSelectedDerivation = (path: PathType) => {
  if (currentView.value === 'trezor') {
    setSelectedTrezorDerivation(path)
  } else if (currentView.value === 'ledger') {
    setSelectedLedgerDerivation(path)
  }
}

const backStep = () => {
  activeStep.value = 0
}

const connectingWallet = ref(false)

const unlockWallet = async () => {
  connectingWallet.value = true
  const networkName = chainToEnum[
    selectedChain.value?.name as string
  ] as NetworkNames

  if (!wallet.value) {
    await hwWalletInstance!
      .isConnected({
        wallet: selectedHwWalletType.value as HWwalletType,
        networkName: networkName,
      })
      .then(() => {
        return new Promise(r => setTimeout(r, 1000))
      })
  }
  activeStep.value = 1
  paths.value = (await hwWalletInstance!.getSupportedPaths({
    wallet: selectedHwWalletType.value as HWwalletType,
    networkName: networkName,
  })) as PathType[]

  // if path is empty, set a path
  // if currently selected path is not in the list, set the first one
  if (
    selectedDerivation.value?.path === '' ||
    !paths.value.some(
      // This handles Ledger case where user may have selected a different app or an app only supports certain paths
      (path: PathType) => path.path === selectedDerivation.value?.path,
    )
  ) {
    setSelectedDerivation(paths.value[0])
  }
  loadList()
}

/**------------------------
 *  Wallet List
 ------------------------*/
const walletList = ref<SelectAddress[]>([])
const isLoadingWalletList = ref(true)
const selectedIndex = ref(0)
const page = ref(0)
const toastStore = useToastStore()

const loadList = async (page: number = 0) => {
  isLoadingWalletList.value = true
  walletList.value = []
  const startIndex = page * 5
  const chainId = selectedChain.value?.chainID ?? '1'
  const chainName = selectedChain.value?.name ?? 'ETHEREUM'
  const networkName = chainToEnum[chainName] ?? 'Ethereum'
  const instance = wallet.value
    ? wallet.value.getWalletInstance?.()
      ? wallet.value.getWalletInstance()
      : hwWalletInstance
    : hwWalletInstance

  for (let i = startIndex; i < startIndex + 5; i++) {
    try {
      const addressResponse = await instance!.getAddress({
        confirmAddress: false,
        networkName: networkName,
        pathType: selectedDerivation.value as PathType,
        pathIndex: i.toString(),
        wallet: selectedHwWalletType.value as HWwalletType,
      })
      const hardwareWalletInstance = isEvmChain.value
        ? new EvmHardwareWallet(
            chainId,
            addressResponse.address as HexPrefixedString,
            networkName,
            i.toString(),
            selectedDerivation.value as PathType,
            selectedHwWalletType.value as HWwalletType,
            instance!,
          )
        : new BtcHardwareWallet(
            addressResponse.address as HexPrefixedString,
            networkName,
            i.toString(),
            selectedDerivation.value as PathType,
            selectedHwWalletType.value as HWwalletType,
            instance!,
          )
      const fetchBalance = await hardwareWalletInstance.getBalance()

      if (Array.isArray(fetchBalance.result)) {
        const mainToken = fetchBalance.result.find(
          token => token.contract === MAIN_TOKEN_CONTRACT,
        )

        walletList.value.push({
          address: addressResponse.address,
          index: i,
          balance: fromWei(
            (mainToken?.balance || '0x0') as HexPrefixedString,
            'ether',
          ).toString(),
          walletInstance: hardwareWalletInstance as EvmHardwareWallet,
        })
      } else {
        // TODO: change this once api changes are made to return consistent data
        // for all networks
        const newFetchBalance = fetchBalance as unknown as {
          balance: { nativeValue: string }
        }
        walletList.value.push({
          address: await hardwareWalletInstance.getAddress(),
          index: i,
          balance: fromBase(newFetchBalance.balance.nativeValue || '0', 8),
          walletInstance: hardwareWalletInstance,
        })
      }
    } catch (e) {
      toastStore.addToastMessage({
        type: ToastType.Error,
        text: e instanceof Error ? e.message : String(e),
      })
    }
  }

  selectedIndex.value = walletList.value[0]?.index
  isLoadingWalletList.value = false
}

watch(
  () => selectedChain.value as Chain | undefined,
  (newValue: Chain | undefined, oldValue: Chain | undefined) => {
    if (!oldValue) return
    if (newValue) {
      paths.value = []
      isLoadingWalletList.value = true
      hwWalletInstance = new HWwallet()
      const waiter = new Promise(r => setTimeout(r, 1000))
      waiter.then(() => loadList())
    }
  },
)

watch(
  () => selectedDerivation.value?.path,
  (newValue: string | undefined, oldValue: string | undefined) => {
    // if old value was empty or undefined, it means this is the first time the path is set
    if (!oldValue || oldValue === '') return
    if (newValue) {
      isLoadingWalletList.value = true
      hwWalletInstance = new HWwallet()
      const waiter = new Promise(r => setTimeout(r, 1000))
      waiter.then(() => loadList())
    }
  },
)

const setPage = (isNext: boolean) => {
  if (!isNext && page.value === 0) return
  page.value = isNext ? page.value + 1 : page.value - 1
  loadList(page.value)
}

/** ------------------------
 * Access Wallet
 ------------------------*/
const { setWallet } = walletStore
const isUnlockingWallet = ref(false)
const walletConfig: ComputedRef<WalletConfig | null> = computed(() => {
  switch (currentView.value) {
    case 'trezor':
      return walletConfigs.trezor
    case 'ledger':
      return walletConfigs.ledger
    default:
      return null
  }
})
const { closeAccessDialog } = useAccessStore()

const access = async () => {
  const wallet = walletList.value[selectedIndex.value]?.walletInstance
  isUnlockingWallet.value = true

  setWallet(markRaw(wallet as EvmHardwareWallet) as WalletInterface)
  addWallet(walletConfig.value as WalletConfig)
  isUnlockingWallet.value = false
  hwWalletInstance = null
  closeAccessDialog()
}
</script>
