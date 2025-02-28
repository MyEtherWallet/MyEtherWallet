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
          placeholder="Enter your recovery phrase"
          class="mt-4 text-center"
          is-required
          :error-message="hasMnemonicError ? 'invalid phrase' : ''"
        />

        <div class="flex items-center justify-between gap-4 my-7 w-full">
          <p class="font-medium">Do you have an extra word?</p>
          <app-toggle v-model="hasExtraWord" :label="extraWordToggleString" />
        </div>
        <!-- Extra Word -->
        <expand-transition>
          <div v-if="hasExtraWord">
            <app-input v-model="extraWord" placeholder="Enter Extra Word" />
          </div>
        </expand-transition>
        <div class="flex items-center justify-center">
          <app-base-button @click="unlockWallet" :disabled="!isValid">
            Next
          </app-base-button>
        </div>
      </div>
      <div v-if="activeStep === 1">
        <app-step-description
          :description="stepDescription[1]"
          :activeStep="activeStep"
        />
        <select-address-list
          v-model="selectedIndex"
          :walletList="walletList"
          :isLoading="isLoadingWalletList"
          class="mt-10"
          @nextpage="setPage(true)"
          @prevpage="setPage(false)"
        />
        <div class="flex items-center justify-center">
          <app-base-button
            @click="access"
            :disabled="!isValid"
            class="mt-10"
            :is-loading="isUnlockingWallet"
          >
            Access my wallet
          </app-base-button>
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
import AppInput from '@/components/AppInput.vue'
import AppTextField from '@/components/AppTextField.vue'
import AppToggle from '@/components/AppToggle.vue'
import ExpandTransition from '@/components/transitions/ExpandTransition.vue'
import SelectAddressList from './components/SelectAddressList.vue'
import { type StepDescription } from '@/types/components/appStepper'
import { validateMnemonic } from 'bip39'
import { watchDebounced } from '@vueuse/core'
import { useWalletStore } from '@/stores/walletStore'
import { ROUTES_WALLET } from '@/router/routeNames'
import MnemonicToWallet from '@/providers/ethereum/mnemonicToWallet'
import { type SelectAddress } from './types/selectAddress'
import { useRouter } from 'vue-router'

/**------------------------
 * Steps
 -------------------------*/
const activeStep = ref(0)
const steps = ['Enter Phrase', 'Address & Network']
const stepDescription: StepDescription[] = [
  {
    title: 'Enter your recovery phrase',
    description:
      'Also called mnemonic phrase, you can use 12, 15, 18, 21 or 24 words phrase to access your wallet. Just enter as many words as you have in your phrase.',
  },
  {
    title: 'Select address and network',
    description: 'Enter your password to unlock your wallet.',
  },
]

const backStep = () => {
  activeStep.value = 0
}

/**------------------------
 * Extra Word
 -------------------------*/

const hasExtraWord = ref(false)
const extraWordToggleString = computed(() =>
  hasExtraWord.value ? 'Yes' : 'No',
)
const extraWord = ref('')

/**------------------------
 * Path
 -------------------------*/
const defaultPath = "m/44'/60'/0'/0"

/**------------------------
 * Mnemonic
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

const wallet = ref<MnemonicToWallet | null>(null)
const unlockWallet = () => {
  if (activeStep.value === 0 && isValid.value) {
    const options = {
      mnemonic: formattedMnemonic.value,
      basePath: defaultPath,
      chainId: '0x1',
      extraWord: extraWord.value,
    }
    wallet.value = new MnemonicToWallet(options)
    loadList(0)
    activeStep.value = 1
  }
}

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
    await wallet.value?.getWallet(i).then(wallet => {
      if (wallet) {
        walletList.value.push({
          address: wallet.getAddress(),
          index: i,
        })
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

const walletStore = useWalletStore()
const router = useRouter()
const { setWallet } = walletStore
const isUnlockingWallet = ref(false)

const access = async () => {
  isUnlockingWallet.value = true

  await wallet.value?.getWallet(selectedIndex.value).then(wallet => {
    if (wallet) {
      setWallet(wallet)
    }
  })

  isUnlockingWallet.value = false
  router.push({ path: ROUTES_WALLET.WALLET.PATH })
}
</script>
