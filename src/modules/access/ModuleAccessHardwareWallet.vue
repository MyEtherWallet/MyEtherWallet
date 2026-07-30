<template>
  <div class="flex justify-center w-full">
    <div class="max-w-[640px] w-full flex flex-col items-center justify-center">
      <app-sheet class="mt-6">
        <div>
          <app-stepper
            :steps="walletSteps"
            :description="walletStepsDescription"
            :active-step="activeStep"
            @update:active-step="backStep"
          >
            <div v-if="activeStep === 0">
              <app-step-description
                :description="walletStepsDescription[0]"
                :activeStep="activeStep"
              />
              <div
                class="flex flex-col items-center justify-center mt-[40px] gap-3"
              >
                <app-base-button
                  v-if="currentView !== 'ledger' || usbSupported"
                  @click="
                    currentView === 'ledger' ? connectViaUSB() : unlockWallet()
                  "
                  :is-loading="connectingWallet"
                  :disabled="connectingWallet"
                >
                  {{
                    currentView === 'ledger'
                      ? t('access_wallet_ledger.connect_usb')
                      : connectButtonText
                  }}
                </app-base-button>
                <span
                  v-if="currentView === 'ledger' && bleSupported"
                  class="underline cursor-pointer text-sm"
                  @click="!connectingWallet && connectViaBluetooth()"
                >
                  {{ t('access_wallet_ledger.connect_bluetooth') }}
                </span>
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
                <select-chain-for-app
                  :can-store="false"
                  :preselected-chain="selectedChain"
                  @update:selected-chain="updateChain"
                />
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
      <ButtonNoWallet class="mt-5" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSheet from '@/components/AppSheet.vue'
import ButtonNoWallet from './components/ButtonNoWallet.vue'
import { ref, watch, markRaw, computed, onMounted } from 'vue'
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
import {
  walletConfigs,
  WalletConfigType,
} from '@/modules/access/common/walletConfigs'
import { useRecentWalletsStore } from '@/stores/recentWalletsStore'
import { MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import { useI18n } from 'vue-i18n'
import { getLocalizedWalletError } from '@/utils/walletUtils'
import { useDerivationStore } from '@/stores/derivationStore'
import { storeToRefs } from 'pinia'
import LedgerManager from '@/providers/hw/ledger'
import { getTrezorManager } from '@/providers/hw/trezorManager'
import type { HWManager } from '@/providers/hw/types'
import {
  getLedgerWebUSBTransport,
  getLedgerBLETransport,
  isWebUSBSupported,
  isWebBLESupported,
} from '@/providers/hw/ledger/transport'
import { HWwalletType } from '@enkryptcom/types'
import { chainToEnum } from '@/providers/ethereum/chainToEnum'
import type { PathType } from '@/stores/derivationStore'
import type { Chain, TokenBalancesRaw } from '@/mew_api/types'
import EvmHardwareWallet from '@/providers/ethereum/evmHardwareWallet'
import type { HexPrefixedString } from '@/providers/types'
import type { WalletInterface } from '@/providers/common/walletInterface'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import type { WalletConfig } from '@/modules/access/common/walletConfigs'
import { NetworkNames } from '@enkryptcom/types'
import { useAccessStore } from '@/stores/accessStore'
import { useGlobalStore } from '@/stores/globalStore'
import { isTrezorSupported } from '@/utils/walletUtils'
import { formatUnits } from 'viem'
import BtcHardwareWallet from '@/providers/bitcoin/btcHardwareWallet'
import { analytics, ConnectWalletEvent } from '@/analytics'
import { captureException } from '@sentry/vue'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'
import {
  evmSupportedPaths,
  btcSupportedPaths,
} from '@/providers/hw/ledger/configs'

// store instantiation needs to be at the top level
// to avoid late initialization issues
const derivationStore = useDerivationStore()
const { trezorSelectedDerivation, ledgerSelectedDerivation } =
  storeToRefs(derivationStore)
const recentWalletsStore = useRecentWalletsStore()
const { addWallet } = recentWalletsStore
const walletStore = useWalletStore()
const { setSelectedTrezorDerivation, setSelectedLedgerDerivation } =
  derivationStore
const { wallet } = storeToRefs(walletStore)
const { t } = useI18n()
const globalStore = useGlobalStore()
const { setSelectedNetwork: setSelectedChainGlobalStore } = globalStore

/**------------------------
 * Access Store and Chain in the store
 -------------------------*/
const accessStore = useAccessStore()
const { currentView, selectedChain, isEvmChain } = storeToRefs(accessStore)

// Reuse one Trezor manager for the whole session: creating a fresh manager on
// every connect / chain / derivation change re-ran the process-wide
// `TrezorConnect.init()`, which threw "TrezorConnect has been already
// initialized" and poisoned the cached provider (MEW-2042). Ledger keeps a
// fresh manager per connection.
const createHwManager = (): HWManager =>
  currentView.value === 'ledger' ? new LedgerManager() : getTrezorManager()

// Wallet instance
let hwWalletInstance: HWManager | null = createHwManager()

const updateChain = (chain: Chain) => {
  accessStore.setSelectedChain(chain)
}

/**------------------------
 * Derivation Path
 -------------------------*/
const paths = ref<PathType[]>([])
let isChainSwitching = false

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
  // Gate Trezor on browser capability: @enkryptcom/hw-wallets `getTrezorConnect`
  // references the bare `chrome` global, which is undefined on non-Chromium
  // browsers (e.g. iOS Safari) and throws an uncaught ReferenceError. Fail
  // gracefully with a friendly message instead. See MEW-2041.
  if (currentView.value === 'trezor' && !isTrezorSupported()) {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('access_wallet_trezor.not_supported'),
    })
    return
  }

  connectingWallet.value = true
  const networkName = chainToEnum[
    selectedChain.value?.name as string
  ] as NetworkNames

  // Ensure the manager matches the current view (ledger vs trezor)
  hwWalletInstance = createHwManager()

  try {
    await hwWalletInstance!
      .isConnected({
        wallet: selectedHwWalletType.value as HWwalletType,
        networkName: networkName as any,
      })
      .then(() => {
        return new Promise(r => setTimeout(r, 1000))
      })
    paths.value = (await hwWalletInstance!.getSupportedPaths({
      wallet: selectedHwWalletType.value as HWwalletType,
      networkName: networkName as any,
    })) as PathType[]

    // Guard against empty paths array
    if (paths.value.length === 0) {
      throw new Error('No supported derivation paths found for this wallet')
    }

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

    // Only advance to step 2 after all validations pass
    activeStep.value = 1
    loadList()
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e)
    const isNoDerivationPaths =
      errorMessage === 'No supported derivation paths found for this wallet'
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('error_connecting'),
      textSecondary: isNoDerivationPaths
        ? t('access.no_supported_derivation_paths')
        : errorMessage,
    })
    // Don't report expected user errors to Sentry
    if (!errorMessage.includes('Make sure you have')) {
      captureException(e, SENTRY_MODULE_TAGS.ACCESS)
    }
  } finally {
    connectingWallet.value = false
  }
}

const usbSupported = ref(false)
const bleSupported = ref(false)

onMounted(async () => {
  if (currentView.value === 'ledger') {
    ;[usbSupported.value, bleSupported.value] = await Promise.all([
      isWebUSBSupported(),
      isWebBLESupported(),
    ])
  }
})

// User dismissing the WebUSB/BLE device picker is an expected action, not an
// error. WebUSB surfaces it as TransportOpenUserCancelled / "No device selected"
// (or a DOMException NotFoundError); the BLE flow surfaces it as a generic
// "...was cancelled" message. Detect all of these so we don't toast or report
// the cancellation to Sentry as noise.
const isUserCancelledTransport = (e: unknown): boolean => {
  const name = (e as { name?: string })?.name
  const message = e instanceof Error ? e.message : String(e ?? '')
  return (
    name === 'TransportOpenUserCancelled' ||
    name === 'NotFoundError' ||
    /no device selected|was cancelled|user cancel(l)?ed/i.test(message)
  )
}

const openTransport = async (getTransport: () => Promise<unknown>) => {
  try {
    await getTransport()
    return true
  } catch (e) {
    if (isUserCancelledTransport(e)) return false
    const errorMessage = e instanceof Error ? e.message : String(e)
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('error_connecting'),
      textSecondary: errorMessage,
    })
    captureException(e, SENTRY_MODULE_TAGS.ACCESS)
    return false
  }
}

const connectViaUSB = async () => {
  if (!(await openTransport(getLedgerWebUSBTransport))) return
  return unlockWallet()
}

const connectViaBluetooth = async () => {
  if (!(await openTransport(getLedgerBLETransport))) return
  return unlockWallet()
}

/**------------------------
 *  Wallet List
 ------------------------*/
const walletList = ref<SelectAddress[]>([])
const isLoadingWalletList = ref(true)
const selectedIndex = ref(0)
const page = ref(0)
const toastStore = useToastStore()

let loadListGeneration = 0

const loadList = async (page: number = 0) => {
  const generation = ++loadListGeneration
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

  try {
    for (let i = startIndex; i < startIndex + 5; i++) {
      if (selectedDerivation.value?.basePath === '') return
      if (generation !== loadListGeneration) return
      const addressResponse = await instance!.getAddress({
        confirmAddress: false,
        networkName: networkName as any,
        pathType: selectedDerivation.value as PathType,
        pathIndex: i.toString(),
        wallet: selectedHwWalletType.value as HWwalletType,
      })
      if (generation !== loadListGeneration) return

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
            addressResponse.publicKey as HexPrefixedString,
            chainName,
            i.toString(),
            selectedDerivation.value as PathType,
            selectedHwWalletType.value as HWwalletType,
            instance!,
          )
      const fetchBalance = await hardwareWalletInstance.getBalance()
      if (generation !== loadListGeneration) return

      const mainToken = (fetchBalance as TokenBalancesRaw).result.find(
        token => token.contract === MAIN_TOKEN_CONTRACT,
      )

      walletList.value.push({
        address: await hardwareWalletInstance.getAddress(),
        index: i,
        balance: formatUnits(BigInt(mainToken!.balance), mainToken!.decimals!),
        walletInstance: hardwareWalletInstance,
      })
      if (walletList.value.length === 1) {
        selectedIndex.value = walletList.value[0].index
        isLoadingWalletList.value = false
      }
    }
  } catch (e) {
    if (generation !== loadListGeneration) return
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('common.something_went_wrong'),
      textSecondary:
        getLocalizedWalletError(e instanceof Error ? e.message : String(e)) ??
        (e instanceof Error ? e.message : String(e)),
    })
    captureException(e, SENTRY_MODULE_TAGS.ACCESS)
  } finally {
    if (generation === loadListGeneration) {
      isLoadingWalletList.value = false
    }
  }
}

watch(
  () => selectedChain.value,
  async (newValue, oldValue) => {
    if (!oldValue) return
    if (newValue !== null) {
      paths.value = []
      isLoadingWalletList.value = true
      hwWalletInstance = createHwManager()
      if (activeStep.value === 1) {
        const networkName = chainToEnum[newValue.name as string] as NetworkNames

        // For Ledger, pre-populate paths from local config immediately — no transport needed.
        // This avoids the UI showing empty paths while isConnected switches the Ledger app (~6s).
        if (currentView.value === 'ledger') {
          const localPaths = (evmSupportedPaths[networkName] ??
            btcSupportedPaths[networkName] ??
            []) as PathType[]
          if (localPaths.length > 0) {
            isChainSwitching = true
            paths.value = localPaths
            if (
              !localPaths.some(p => p.path === selectedDerivation.value?.path)
            ) {
              setSelectedDerivation(localPaths[0])
            }
          }
        }

        try {
          await hwWalletInstance!.isConnected({
            wallet: selectedHwWalletType.value as HWwalletType,
            networkName: networkName as any,
          })
          const newPaths = (await hwWalletInstance!.getSupportedPaths({
            wallet: selectedHwWalletType.value as HWwalletType,
            networkName: networkName as any,
          })) as PathType[]
          paths.value = newPaths
          if (
            newPaths.length > 0 &&
            (selectedDerivation.value?.path === '' ||
              !newPaths.some(p => p.path === selectedDerivation.value?.path))
          ) {
            setSelectedDerivation(newPaths[0])
          }
        } catch (e) {
          const errorMessage = e instanceof Error ? e.message : String(e)
          toastStore.addToastMessage({
            type: ToastType.Error,
            text: t('error_connecting'),
            textSecondary: errorMessage,
          })
          captureException(e, SENTRY_MODULE_TAGS.ACCESS)
        } finally {
          isChainSwitching = false
        }
      }
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
    // skip while the chain watcher is mid-switch to avoid a premature loadList()
    if (isChainSwitching) return
    if (newValue) {
      isLoadingWalletList.value = true
      hwWalletInstance = createHwManager()
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
  // `selectedIndex` holds the derivation index (set by SelectAddressList from
  // `walletList[i].index`), not the array position. On page 2+ those differ, so
  // indexing the array directly returned undefined and crashed in
  // markRaw(undefined). Look the entry up by its derivation index and bail out
  // if none matches.
  const wallet = walletList.value.find(
    item => item.index === selectedIndex.value,
  )?.walletInstance
  if (!wallet) return
  isUnlockingWallet.value = true

  setWallet(
    markRaw(wallet as EvmHardwareWallet) as WalletInterface,
    walletConfig.value?.name || 'hardware',
    WalletConfigType.HARDWARE,
  )
  addWallet(walletConfig.value as WalletConfig)
  isUnlockingWallet.value = false
  hwWalletInstance = null
  setSelectedChainGlobalStore(selectedChain.value?.name || '')
  analytics.trackConnectWalletEvent(ConnectWalletEvent.SUCCESS, {
    walletName: walletConfig.value?.name || 'hardware',
    walletType: WalletConfigType.HARDWARE,
    network: selectedChain.value?.name,
  })
  closeAccessDialog()
}
</script>
