<template>
  <div class="flex justify-center w-full">
    <div
      class="max-w-[624px] flex flex-col items-center justify-center sm:pt-1"
    >
      <app-not-recommended />
      <app-sheet class="mt-1">
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
            <div class="flex justify-end items-center gap-4 mt-4 xs:mt-7">
              <!-- TODO: add icon, refresh mnemonic on press -->
              <div
                class="cursor-pointer text-primaryActive"
                @click="updateMnemonic"
              >
                <arrow-path-icon class="inline w-5 h-5 mr-1" />
                Update
              </div>
              <div>
                <app-select
                  v-model:selected="length"
                  :options="[
                    { label: '12 words', value: '12' },
                    { label: '18 words', value: '18' },
                    { label: '24 words', value: '24' },
                  ]"
                  placeholder="Select length"
                />
              </div>
            </div>
            <app-text-field
              v-model="mnemonic"
              placeholder="Your recovery phrase"
              class="mt-2 xs:mt-4 text-center"
              :readonly="true"
            />
            <div
              class="flex items-center justify-between gap-4 mt-4 xs:mt-7 mb-7 w-full"
            >
              <p class="font-medium text-s-14 xs:text-s-16 leading-p-130">
                {{
                  $t('access_wallet_recovery_phrase.do_you_have_an_extra_word')
                }}
              </p>
              <app-toggle
                v-model="hasExtraWord"
                :label="extraWordToggleString"
              />
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
              <app-base-button
                class="w-full xs:w-auto xs:min-w-[250px]"
                @click="nextStep"
              >
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

            <div class="pt-4">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  v-for="index in indexesToVerify"
                  :key="index"
                  class="flex flex-col"
                >
                  <app-input
                    v-model="verifyMnemonicObj[index]"
                    :placeholder="`Word #${index + 1}`"
                  />
                </div>
              </div>
              <div v-if="verifyMnemonicError" class="text-error mb-5">
                Could not verify mnemonic, please check the entered words.
              </div>
              <div v-if="extraWord !== ''">
                <app-input
                  v-model="verifyExtraWord"
                  :placeholder="
                    $t('access_wallet_recovery_phrase.enter_extra_word')
                  "
                />
              </div>
              <div v-if="verifyExtraWordError" class="text-error">
                Could not verify extra word.
              </div>
              <div class="flex flex-col items-center justify-center mt-2">
                <app-base-button
                  class="w-full xs:w-auto xs:min-w-[250px]"
                  :disabled="!verifyMnemonic"
                  @click="activeStep = 2"
                >
                  {{ $t('common.next') }}
                </app-base-button>
                <app-base-button
                  :is-outline="true"
                  class="w-full xs:w-auto xs:min-w-[250px] mt-4"
                  @click="activeStep = 0"
                >
                  {{ $t('common.back') }}
                </app-base-button>
              </div>
            </div>
          </div>

          <div v-if="activeStep === 2">
            <app-step-description
              :description="stepDescription[2]"
              :activeStep="activeStep"
            />

            <div class="pt-4">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4"></div>
              <div class="flex flex-col items-center justify-center mt-2">
                <app-base-button
                  class="w-full xs:w-auto xs:min-w-[250px]"
                  :disabled="!verifyMnemonic"
                  @click="closeCreateOpenAccess()"
                >
                  Access Wallet
                </app-base-button>
                <app-base-button
                  :is-outline="true"
                  class="w-full xs:w-auto xs:min-w-[250px] mt-4"
                  @click="activeStep = 0"
                >
                  Create another wallet
                </app-base-button>
              </div>
            </div>
          </div>
        </app-stepper>
      </app-sheet>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import AppStepper from '@/components/AppStepper.vue'
import AppStepDescription from '@/components/AppStepDescription.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppInput from '@/components/AppInput.vue'
import AppToggle from '@/components/AppToggle.vue'
import ExpandTransition from '@/components/transitions/ExpandTransition.vue'
import AppSheet from '@/components/AppSheet.vue'
import AppNotRecommended from '@/components/AppNotRecommended.vue'
import AppTextField from '@/components/AppTextField.vue'
import AppSelect from '@/components/AppSelect.vue'
import { useI18n } from 'vue-i18n'
import { type StepDescription } from '@/types/components/appStepper'
import { english, generateMnemonic } from 'viem/accounts'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import BigNumber from 'bignumber.js'
const { t } = useI18n()

import { useCreateStore } from '@/stores/createStore'
import { useAccessStore } from '@/stores/accessStore'

const { closeCreateDialog } = useCreateStore()
const { openAccessDialog } = useAccessStore()

/**------------------------
 * Steps
 -------------------------*/
const activeStep = ref(0)
const steps = ['Write down the words', 'Verification', 'Well done']
const stepDescription: StepDescription[] = [
  {
    title: 'Write down these words',
  },
  {
    title: 'Verification',
    description: 'Please select correct words based on their numbers.',
  },
  {
    title: 'Well done',
    description:
      'You are now ready to take advantage of all that Ethereum has to offer! Access with mnemonic phrase should only be used in an offline setting',
  },
]

const backStep = () => {
  activeStep.value = 0
  updateMnemonic()
  extraWord.value = ''
  hasExtraWord.value = false
  verifyExtraWord.value = ''
  verifyMnemonicObj.value = {}
}

const nextStep = () => {
  activeStep.value = 1
}

const closeCreateOpenAccess = () => {
  closeCreateDialog()
  openAccessDialog()
}

const indexesToVerify = computed(() => {
  const indexes: number[] = []
  while (indexes.length < BigNumber(length.value.value).toNumber() / 2) {
    const randIndex = Math.floor(
      Math.random() * mnemonic.value.split(' ').length,
    )
    if (!indexes.includes(randIndex)) {
      indexes.push(randIndex)
    }
  }
  return indexes.sort((a, b) => a - b)
})

/**------------------------
 * Extra Word
 -------------------------*/

const hasExtraWord = ref(false)
const verifyExtraWordError = computed(() => {
  if (verifyExtraWord.value === '') {
    return false
  }
  return verifyExtraWord.value === extraWord.value
})
const verifyExtraWord = ref('')
const extraWordToggleString = computed(() =>
  hasExtraWord.value ? t('common.yes') : t('common.no'),
)
const extraWord = ref('')

/**------------------------
 * Mnemonic phrase
 -------------------------*/

const mnemonic = ref('')
const length = ref({ label: '12 words', value: '12' })
const verifyMnemonicObj = ref<Record<number, string>>({})
const verifyMnemonicError = computed(() => {
  if (Object.keys(verifyMnemonicObj.value).length === 0) {
    return false
  }
  let error = false
  indexesToVerify.value.forEach(index => {
    if (mnemonic.value.split(' ')[index] !== verifyMnemonicObj.value[index]) {
      error = true
    }
  })
  return error
})
const verifyMnemonic = computed(() => {
  let isValid = true
  indexesToVerify.value.forEach(index => {
    if (verifyMnemonicObj.value[index] !== mnemonic.value.split(' ')[index]) {
      isValid = false
    }
  })
  if (hasExtraWord.value && extraWord.value !== '') {
    if (verifyExtraWord.value !== extraWord.value) {
      isValid = false
    }
  }
  return isValid
})

watch(length, () => {
  updateMnemonic()
})

const updateMnemonic = () => {
  const bits =
    length.value.value === '12' ? 128 : length.value.value === '18' ? 192 : 256
  mnemonic.value = generateMnemonic(english, bits)
}

onMounted(() => {
  updateMnemonic()
})
</script>
