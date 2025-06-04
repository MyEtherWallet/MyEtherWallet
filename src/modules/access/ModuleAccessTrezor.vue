<template>
  <div>
    <app-stepper
      :steps="steps"
      :description="stepDescription"
      :active-step="activeStep"
      @update:active-step="backStep"
    >
      <!-- Enter Mnemonic -->
      <div v-if="activeStep === 0">
        <app-step-description
          :description="stepDescription[0]"
          :activeStep="activeStep"
        />
        <div class="flex items-center justify-center mt-[40px]">
          <app-base-button @click="unlockWallet">
            {{ $t('access_wallet_trezor.connect') }}
          </app-base-button>
        </div>
      </div>
      <!-- Select Network, Address, DP -->
      <div v-if="activeStep === 1">
        <app-step-description
          :description="stepDescription[1]"
          :activeStep="activeStep"
        />
        <div
          class="grid grid-cols-1 xs:grid-cols-2 justify-space-beween gap-4 my-5"
        >
          <app-select-chain />
          <trezor-derivation :paths="paths" />
        </div>
        <select-address-list
          v-model="selectedIndex"
          :walletList="walletList"
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
          <app-btn-text @click="backStep" is-large class="mt-2 text-primary">
            {{ $t('common.back') }}
          </app-btn-text>
        </div>
      </div>
    </app-stepper>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, markRaw } from 'vue'
import AppStepper from '@/components/AppStepper.vue'
import AppStepDescription from '@/components/AppStepDescription.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import SelectAddressList from './components/SelectAddressList.vue'
import { type StepDescription } from '@/types/components/appStepper'
import { useWalletStore } from '@/stores/walletStore'
import { ROUTES_MAIN } from '@/router/routeNames'
import MnemonicToWallet from '@/providers/ethereum/mnemonicToWallet'
import { type SelectAddress } from './types/selectAddress'
import { useRouter } from 'vue-router'
import AppSelectChain from '@/components/AppSelectChain.vue'
import TrezorDerivation from './components/HWwalletDerivationPath.vue'
import { walletConfigs } from '@/modules/access/common/walletConfigs'
import { useRecentWalletsStore } from '@/stores/recentWalletsStore'
import { MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import { useI18n } from 'vue-i18n'
import { useDerivationStore } from '@/stores/derivationStore'
import { storeToRefs } from 'pinia'
import { useChainsStore } from '@/stores/chainsStore'
import HWwallet from '@enkryptcom/hw-wallets'
import { HWwalletType } from '@enkryptcom/types'
import { chainToEnum } from '@/providers/ethereum/trezorSupportedEnum'
import type { PathType } from '@/stores/derivationStore'
import type { Chain } from '@/mew_api/types'
import EvmTrezorWallet from '@/providers/ethereum/evmTrezorWallet'
import type { HexPrefixedString } from '@/providers/types'
import { fromWei } from 'web3-utils'

// store instantiation needs to be at the top level
// to avoid late initialization issues
const derivationStore = useDerivationStore()
const chainsStore = useChainsStore()
const { trezorSelectedDerivation } = storeToRefs(derivationStore)
const { selectedChain } = storeToRefs(chainsStore)
const recentWalletsStore = useRecentWalletsStore()
const { addWallet } = recentWalletsStore
const walletStore = useWalletStore()
const { setSelectedTrezorDerivation } = derivationStore

const { t } = useI18n()

// Wallet instance
const hwWalletInstance = new HWwallet()

/**------------------------
 * Derivation Path
 -------------------------*/
const paths = ref<PathType[]>([])

/**------------------------
 * Steps
 -------------------------*/
const activeStep = ref(0)
const steps = [
  t('access_wallet_trezor.step.step1.short'),
  t('access_wallet_trezor.step.step2.short'),
]
const stepDescription: StepDescription[] = [
  {
    title: t('access_wallet_trezor.step.step1.title'),
    description: t('access_wallet_trezor.step.step1.description'),
  },
  {
    title: t('access_wallet_trezor.step.step2.title'),
  },
]

const backStep = () => {
  activeStep.value = 0
  wallet.value = null
}

const wallet = ref<MnemonicToWallet | null>(null)
const connectingWallet = ref(false)

// TODO: Handle non EVM networks
const unlockWallet = async () => {
  // const walletHandler = new HWwallet()
  connectingWallet.value = true
  await hwWalletInstance.isConnected({
    wallet: HWwalletType.trezor,
    networkName: chainToEnum[selectedChain.value?.chainID || '1'],
  })
  connectingWallet.value = false
  activeStep.value = 1
  paths.value = await hwWalletInstance.getSupportedPaths({
    wallet: HWwalletType.trezor,
    networkName: chainToEnum[selectedChain.value?.chainID || '1'],
  })
  // if path is empty, set a path
  // if currently selected path is not in the list, set the first one
  if (
    trezorSelectedDerivation.value.path === '' ||
    !paths.value.some(
      // This handles Ledger case where user may have selected a different app or an app only supports certain paths
      (path: PathType) => path.path === trezorSelectedDerivation.value.path,
    )
  ) {
    setSelectedTrezorDerivation(paths.value[0])
  }
  loadList()
}

watch(
  () => selectedChain.value,
  (newValue: Chain) => {
    if (newValue) {
      paths.value = []
      unlockWallet()
    }
  },
)

watch(
  () => trezorSelectedDerivation.value.path,
  (newValue: PathType, oldValue: PathType) => {
    // if old value was empty, it means this is the first time the path is set
    if (oldValue.label === '') return
    if (newValue) {
      unlockWallet()
    }
  },
)

/**------------------------
 *  Wallet List
 ------------------------*/
const walletList = ref<SelectAddress[]>([])
const isLoadingWalletList = ref(true)
const selectedIndex = ref(0)
const page = ref(0)

const loadList = async (page: number = 0) => {
  isLoadingWalletList.value = true
  walletList.value = []
  const startIndex = page * 5
  const chainId = selectedChain.value?.chainID || '1'
  const networkName = chainToEnum[chainId]

  for (let i = startIndex; i < startIndex + 5; i++) {
    const addressResponse = await hwWalletInstance.getAddress({
      confirmAddress: false,
      networkName: networkName,
      pathType: trezorSelectedDerivation.value,
      pathIndex: i.toString(),
      wallet: HWwalletType.trezor,
    })

    const trezorWallet = new EvmTrezorWallet(
      chainId,
      addressResponse.address as HexPrefixedString,
      networkName,
      i.toString(),
      trezorSelectedDerivation.value,
      HWwalletType.trezor,
      hwWalletInstance,
    )

    const fetchBalance = await trezorWallet.getBalance()
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
      walletInstance: trezorWallet,
    })
  }

  selectedIndex.value = walletList.value[0].index
  isLoadingWalletList.value = false
}

const setPage = (isNext: boolean) => {
  if (!isNext && page.value === 0) return
  page.value = isNext ? page.value + 1 : page.value - 1
  loadList(page.value)
}

/** ------------------------
 * Access Wallet
 ------------------------*/

const router = useRouter()
const { setWallet } = walletStore
const isUnlockingWallet = ref(false)

const access = async () => {
  const wallet = walletList.value[selectedIndex.value]?.walletInstance
  isUnlockingWallet.value = true

  setWallet(markRaw(wallet))
  addWallet(walletConfigs.trezor)

  isUnlockingWallet.value = false
  router.push({ path: ROUTES_MAIN.HOME.PATH })
}
</script>
