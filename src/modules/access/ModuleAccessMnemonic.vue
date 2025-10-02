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
        <app-text-field
          v-model="mnemonic"
          :placeholder="$t('access_wallet_recovery_phrase.enter_phrase')"
          class="mt-4 text-center"
          is-required
          :error-message="
            hasMnemonicError
              ? $t('access_wallet_recovery_phrase.invalid_phrase')
              : ''
          "
        />
        <div class="flex items-center justify-between gap-4 my-7 w-full">
          <p class="font-medium">
            {{ $t('access_wallet_recovery_phrase.do_you_have_an_extra_word') }}
          </p>
          <app-toggle v-model="hasExtraWord" :label="extraWordToggleString" />
        </div>
        <!-- Extra Word -->
        <expand-transition>
          <div v-if="hasExtraWord">
            <app-input
              v-model="extraWord"
              :placeholder="
                $t('access_wallet_recovery_phrase.enter_extra_word')
              "
            />
          </div>
        </expand-transition>
        <div class="flex items-center justify-center">
          <app-base-button @click="unlockWallet" :disabled="!isValid">
            {{ $t('common.next') }}
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
          <select-chain-for-app />
          <derivation-path />
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
            :disabled="!isValid"
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
import { computed, ref } from 'vue'
import AppStepper from '@/components/AppStepper.vue'
import AppStepDescription from '@/components/AppStepDescription.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import AppInput from '@/components/AppInput.vue'
import AppTextField from '@/components/AppTextField.vue'
import AppToggle from '@/components/AppToggle.vue'
import ExpandTransition from '@/components/transitions/ExpandTransition.vue'
import SelectAddressList from './components/SelectAddressList.vue'
import { type StepDescription } from '@/types/components/appStepper'
import { validateMnemonic } from 'bip39'
import { watchDebounced } from '@vueuse/core'
import { MAIN_TOKEN_CONTRACT, useWalletStore } from '@/stores/walletStore'
import { ROUTES_MAIN } from '@/router/routeNames'
import MnemonicToWallet from '@/providers/ethereum/mnemonicToWallet'
import MnemonicToBitcoinWallet from '@/providers/bitcoin/mnemonicToBitcoinWallet'
import { type SelectAddress } from './types/selectAddress'
import { useRouter } from 'vue-router'
import SelectChainForApp from '@/components/select_chain/SelectChainForApp.vue'
import DerivationPath from './components/DerivationPath.vue'
import { walletConfigs } from '@/modules/access/common/walletConfigs'
import { useRecentWalletsStore } from '@/stores/recentWalletsStore'
import { useI18n } from 'vue-i18n'
import { useDerivationStore } from '@/stores/derivationStore'
import { storeToRefs } from 'pinia'
import { useChainsStore } from '@/stores/chainsStore'
import { useAccessRedirectStore } from '@/stores/accessRedirectStore'
import type { HexPrefixedString } from '@/providers/types'
import { fromWei } from 'web3-utils'
import { fromBase } from '@/utils/unit'
import type { Chain } from '@/mew_api/types'
import type { DerivationPath as DerivationPathType } from './common/configs/configPaths'

const { t } = useI18n()
/**------------------------
 * Steps
 -------------------------*/
const activeStep = ref(0)
const steps = [
  t('access_wallet_recovery_phrase.step.step1.short'),
  t('access_wallet_recovery_phrase.step.step2.short'),
]
const stepDescription: StepDescription[] = [
  {
    title: t('access_wallet_recovery_phrase.step.step1.title'),
    description: t('access_wallet_recovery_phrase.step.step1.description'),
  },
  {
    title: t('access_wallet_recovery_phrase.step.step2.title'),
  },
]

const backStep = () => {
  activeStep.value = 0
  wallet.value = null
  mnemonic.value = ''
  extraWord.value = ''
  hasExtraWord.value = false
}

/**------------------------
 * Extra Word
 -------------------------*/

const hasExtraWord = ref(false)
const extraWordToggleString = computed(() =>
  hasExtraWord.value ? t('common.yes') : t('common.no'),
)
const extraWord = ref('')

/**------------------------
 * Path
 -------------------------*/
const defaultPath = "m/44'/60'/0'/0"

/**------------------------
 * Mnemonic phrase
 -------------------------*/

const mnemonic = ref('')
const hasMnemonicError = ref(false)

const formattedMnemonic = computed(() => {
  const words = mnemonic.value.match(/\b(\w+)\b/g)
  if (!words) return ''
  return words.join(' ')
})

const isValid = computed<boolean>(() => {
  return validateMnemonic(formattedMnemonic.value)
})

watchDebounced(
  mnemonic,
  () => {
    if (mnemonic.value === '') {
      hasMnemonicError.value = false
    } else {
      hasMnemonicError.value = !isValid.value
    }
  },
  { debounce: 2000 },
)

const wallet = ref<MnemonicToWallet | MnemonicToBitcoinWallet | null>(null)
const derivationStore = useDerivationStore()
const chainsStore = useChainsStore()
const { selectedDerivation } = storeToRefs(derivationStore)
const { selectedChain } = storeToRefs(chainsStore)
const unlockWallet = () => {
  if (isValid.value) {
    const options = {
      mnemonic: formattedMnemonic.value,
      basePath: selectedDerivation.value?.path || defaultPath,
      chainId: selectedChain.value?.chainID ?? '1',
      extraWord: extraWord.value,
      chainName: selectedChain.value?.name || 'ETHEREUM',
    }
    wallet.value =
      selectedChain.value?.type === 'EVM'
        ? new MnemonicToWallet(options)
        : new MnemonicToBitcoinWallet(options)
    loadList(0)
    activeStep.value = 1
  }
}

watchDebounced<[Chain | undefined, DerivationPathType | undefined]>(
  () =>
    [selectedChain.value, selectedDerivation.value] as [
      Chain | undefined,
      DerivationPathType | undefined,
    ],
  newValue => {
    // verify if values actually changed
    const chainChanged = newValue[0]?.name !== selectedChain.value?.name
    const derivationChanged =
      newValue[1]?.path !== selectedDerivation.value?.path

    if (chainChanged && !derivationChanged) {
      loadList()
    } else if (derivationChanged && chainChanged) {
      unlockWallet()
    } else if (!derivationChanged && !chainChanged) {
      unlockWallet()
    }
  },
  { debounce: 300 },
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
    await wallet.value?.getWallet(i).then(async wallet => {
      if (wallet) {
        const fetchBalance = await wallet.getBalance()
        if (Array.isArray(fetchBalance.result)) {
          const mainToken = fetchBalance.result.find(
            token => token.contract === MAIN_TOKEN_CONTRACT,
          )
          walletList.value.push({
            address: await wallet.getAddress(),
            index: i,
            balance: fromWei(
              (mainToken?.balance || '0x0') as HexPrefixedString,
              'ether',
            ).toString(),
          })
        } else {
          // TODO: change this once api changes are made to return consistent data
          // for all networks
          const newFetchBalance = fetchBalance as unknown as {
            balance: { nativeValue: string }
          }
          walletList.value.push({
            address: await wallet.getAddress(),
            index: i,
            balance: fromBase(
              newFetchBalance.balance.nativeValue,
              8,
            ).toString(),
          })
        }
      }
    })
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

const recentWalletsStore = useRecentWalletsStore()
const { addWallet } = recentWalletsStore
const walletStore = useWalletStore()
const router = useRouter()
const { setWallet } = walletStore
const isUnlockingWallet = ref(false)
const accessRedirectStore = useAccessRedirectStore()

const access = async () => {
  isUnlockingWallet.value = true

  await wallet.value?.getWallet(selectedIndex.value).then(wallet => {
    if (wallet) {
      setWallet(wallet)
      addWallet(walletConfigs.mnemonic)
    }
  })

  isUnlockingWallet.value = false
  router.push({
    name: accessRedirectStore.lastVisitedRouteName || ROUTES_MAIN.HOME.NAME,
  })
}
</script>
