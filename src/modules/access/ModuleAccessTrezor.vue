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
          <derivation-path />
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
            :disabled="true"
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
import { ref, watch } from 'vue'
import AppStepper from '@/components/AppStepper.vue'
import AppStepDescription from '@/components/AppStepDescription.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import SelectAddressList from './components/SelectAddressList.vue'
import { type StepDescription } from '@/types/components/appStepper'
import { useWalletStore } from '@/stores/walletStore'
import { ROUTES_ACCESS } from '@/router/routeNames'
import MnemonicToWallet from '@/providers/ethereum/mnemonicToWallet'
import { type SelectAddress } from './types/selectAddress'
import { useRouter } from 'vue-router'
import AppSelectChain from '@/components/AppSelectChain.vue'
import DerivationPath from './components/DerivationPath.vue'
import { walletConfigs } from '@/modules/access/common/walletConfigs'
import { useRecentWalletsStore } from '@/stores/recentWalletsStore'
import { useI18n } from 'vue-i18n'
import { useDerivationStore } from '@/stores/derivationStore'
import { storeToRefs } from 'pinia'
import { useChainsStore } from '@/stores/chainsStore'
import HWwallet from '@enkryptcom/hw-wallets'
import { HWwalletType } from '@enkryptcom/types'
import { chainToEnum } from '@/providers/ethereum/trezorSupportedEnum'

// store instantiation needs to be at the top level
// to avoid late initialization issues
const derivationStore = useDerivationStore()
const chainsStore = useChainsStore()
const { selectedDerivation } = storeToRefs(derivationStore)
const { selectedChain } = storeToRefs(chainsStore)
const recentWalletsStore = useRecentWalletsStore()
const { addWallet } = recentWalletsStore
const walletStore = useWalletStore()

const { t } = useI18n()
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

const unlockWallet = () => {
  const walletHandler = new HWwallet()
  connectingWallet.value = true
  walletHandler
    .isConnected({
      wallet: HWwalletType.trezor,
      networkName: chainToEnum[selectedChain.value?.chainID || '1'],
    })
    .then(() => {
      activeStep.value = 1
    })
}

watch(
  () => selectedDerivation.value.path,
  (newValue, oldValue) => {
    console.log(newValue, oldValue)
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
  for (let i = startIndex; i < startIndex + 5; i++) {
    // const address = await walletHandler.value?.getAddress({
    //   confirmAddress: false,
    //   networkName: chainToEnum[selectedChain.value?.chainID || '1'],
    //   pathType:
    // })
    // await wallet.value?.getWallet(i).then(async wallet => {
    //   if (wallet) {
    //     walletList.value.push({
    //       address: await wallet.getAddress(),
    //       index: i,
    //     })
    //   }
    // })
  }
  //TODO: Load balance
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
  isUnlockingWallet.value = true

  await wallet.value?.getWallet(selectedIndex.value).then(wallet => {
    if (wallet) {
      setWallet(wallet)
      addWallet(walletConfigs.mnemonic)
    }
  })

  isUnlockingWallet.value = false
  router.push({ path: ROUTES_ACCESS.WALLET.PATH })
}
</script>
