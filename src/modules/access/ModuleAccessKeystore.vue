<template>
  <div>
    <app-stepper
      :steps="steps"
      :description="stepDescription"
      :active-step="activeStep"
      @update:active-step="backStep"
    >
      <div v-if="activeStep === 0">
        <div class="mt-5 grid grid-cols-1 xs:grid-cols-2 justify-space-between">
          <div>
            <app-step-description
              :description="stepDescription[0]"
              :activeStep="activeStep"
            />
            <img
              src="@/assets/images/access/keystore-file.jpg"
              alt="Keystore File"
              class="xs:hidden xs:mt-0 w-3/5 xs:w-3/4 mx-auto"
              width="300"
              height="285"
            />
            <app-base-button @click="clickUpload" class="mt-5 xs:mt-8">
              Select Keystore
            </app-base-button>
            <input
              ref="jsonInput"
              type="file"
              name="file"
              style="display: none"
              @change="uploadKeystoreFile"
            />
          </div>
          <img
            src="@/assets/images/access/keystore-file.jpg"
            alt="Keystore File"
            class="hidden xs:block w-2/3 lg:w-3/4 ml-auto mt-5"
            width="300"
            height="285"
          />
        </div>
      </div>
      <div v-if="activeStep === 1">
        <app-step-description
          :description="stepDescription[1]"
          :activeStep="activeStep"
        />
        <app-input
          v-model="password"
          placeholder="Enter Password"
          type="password"
          :error-message="errorPassword"
          is-required
          class="mt-7"
        />
        <div class="flex ites-center justify-center gap-4 mt-5 xs:mt-8">
          <app-base-button @click="backStep" is-outline class="!min-w-[120px]">
            Back
          </app-base-button>
          <app-base-button
            @click="enterPassword"
            class="!min-w-[120px]"
            :disabled="submitIsDisabled"
            :is-loading="isUnlockingKeystore"
          >
            Submit
          </app-base-button>
        </div>
      </div>
    </app-stepper>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ROUTES_WALLET } from '@/router/routeNames'
import { useWalletStore } from '@/stores/walletStore'
import {
  unlockKeystore,
  type V3Keystore,
  type EthSaleKeystore,
  type MEWKeystore,
} from '@/modules/access/common/helpers'
import PrivateKeyWallet from '@/providers/ethereum/privateKeyWallet'
import AppStepper from '@/components/AppStepper.vue'
import AppStepDescription from '@/components/AppStepDescription.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { type StepDescription } from '@/types/components/appStepper'
import AppInput from '@/components/AppInput.vue'
import { watchDebounced } from '@vueuse/core'
/**------------------------
 * Steps
 -------------------------*/
const activeStep = ref(0)
const steps = ['Upload Keystore', 'Enter Password']
const stepDescription: StepDescription[] = [
  {
    title: 'Select your Keystore File',
    description: 'Please select keystore file that unlocks your wallet.',
  },
  {
    title: 'Enter Password',
    description: 'Enter your password to unlock your wallet.',
  },
]

/**------------------------
 * Keystore Upload
 -------------------------*/

const jsonInput = ref<HTMLInputElement | null>(null)
const keystore = ref<EthSaleKeystore | V3Keystore | MEWKeystore | null>()
const fileError = ref(false)
const clickUpload = () => {
  if (!jsonInput.value) return
  jsonInput.value.value = ''
  jsonInput.value.click()
}

//TODO ERROR HANDLING
const uploadKeystoreFile = async (evt: Event) => {
  fileError.value = false
  const input = evt.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = async () => {
      keystore.value = JSON.parse(reader.result as string)
    }
    reader.readAsBinaryString(file)
  }
  if (jsonInput.value) {
    jsonInput.value.value = '' // clear file input
  }
  activeStep.value = 1
}
const resetKeystore = () => {
  keystore.value = null
}

/**------------------------
 * Keystore Password
 -------------------------*/
const walletStore = useWalletStore()
const router = useRouter()
const { setWallet } = walletStore

const password = ref('')
const errorPassword = ref('')
const isUnlockingKeystore = ref(false)
watchDebounced(password, () => {
  errorPassword.value = ''
})

const submitIsDisabled = computed<boolean>(() => {
  return password.value === '' || errorPassword.value !== ''
})
const enterPassword = async () => {
  try {
    isUnlockingKeystore.value = true
    const res = await unlockKeystore(
      keystore.value as unknown as V3Keystore,
      password.value,
    )
    if (res) {
      // TODO: move hardcodes
      const wallet = new PrivateKeyWallet(
        Buffer.from(res.getPrivateKey()),
        '0x1',
      )
      resetKeystore()
      setWallet(wallet)
      isUnlockingKeystore.value = false
      router.push({ path: ROUTES_WALLET.WALLET.PATH })
    }
  } catch (error) {
    //TODO any other error handling
    console.error('Keystore unlock failed:', error)
    errorPassword.value = 'Invalid password'
    isUnlockingKeystore.value = false
  }
}

/**------------------------
 * Back Step
 -------------------------*/
const backStep = () => {
  activeStep.value = 0
  password.value = ''
  resetKeystore()
}
</script>
