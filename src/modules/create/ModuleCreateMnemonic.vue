<template>
  <div class="flex justify-center w-full">
    <div
      class="max-w-[624px] w-full flex flex-col items-center justify-center sm:pt-1"
    >
      <app-not-recommended class="mb-4 w-full" />
      <app-sheet sheet-class="px-4 sm:px-6 lg:px-10">
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
            <div class="flex justify-between items-center gap-4 mt-6 mb-4">
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
              <app-btn-text
                class="text-primary hoverOpacity"
                @click="updateMnemonic"
              >
                <arrow-path-icon class="inline w-5 h-5 mr-1" />
                Update
              </app-btn-text>
            </div>
            <div
              class="grow rounded-20 lg:rounded-32 text-s-17 rounded-24 p-6 sm:p-8 flex justify-center bg-appBackground/50"
            >
              <div
                class="grid grid-cols-2 gap-x-4 gap-y-3 w-full max-w-[500px]"
              >
                <div
                  v-for="(phrase, index) in mnemonic.split(' ')"
                  :key="index"
                  class="flex items-center bg-white/80 px-4 py-2 rounded-12 shadow-sm"
                >
                  <span class="text-info text-s-12 w-6 shrink-0"
                    >{{ index + 1 }}.</span
                  >
                  <span class="font-medium text-s-17">{{ phrase }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-center mt-8">
              <app-base-button
                class="w-full xs:w-auto xs:min-w-[200px]"
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

            <div class="pt-8">
              <div class="flex flex-col gap-8">
                <!-- First Sample -->
                <div v-if="generatedVerifySamples.length">
                  <p
                    class="text-s-12 mb-2 text-info font-bold uppercase tracking-wider px-1"
                  >
                    Select Word #{{
                      generatedVerifySamples[0].indexToVerify + 1
                    }}
                  </p>
                  <app-btn-group
                    v-model:selected="sampleOneSelected"
                    :btn-list="generatedVerifySamples[0].items"
                    :size="isMobile ? 'medium' : 'large'"
                    has-full-width
                  >
                    <template #btn-content="{ data }">
                      {{ data.label }}
                    </template>
                  </app-btn-group>
                </div>
                <!-- Second Sample -->
                <div
                  v-if="
                    generatedVerifySamples.length && generatedVerifySamples[1]
                  "
                >
                  <p
                    class="text-s-12 mb-2 text-info font-bold uppercase tracking-wider px-1"
                  >
                    Select Word #{{
                      generatedVerifySamples[1].indexToVerify + 1
                    }}
                  </p>
                  <app-btn-group
                    v-model:selected="sampleTwoSelected"
                    :btn-list="generatedVerifySamples[1].items"
                    :size="isMobile ? 'medium' : 'large'"
                    has-full-width
                  >
                    <template #btn-content="{ data }">
                      {{ data.label }}
                    </template>
                  </app-btn-group>
                </div>
                <!-- Third Sample -->
                <div
                  v-if="
                    generatedVerifySamples.length && generatedVerifySamples[2]
                  "
                >
                  <p
                    class="text-s-12 mb-2 text-info font-bold uppercase tracking-wider px-1"
                  >
                    Select Word #{{
                      generatedVerifySamples[2].indexToVerify + 1
                    }}
                  </p>
                  <app-btn-group
                    v-model:selected="sampleThreeSelected"
                    :btn-list="generatedVerifySamples[2].items"
                    :size="isMobile ? 'medium' : 'large'"
                    has-full-width
                  >
                    <template #btn-content="{ data }">
                      {{ data.label }}
                    </template>
                  </app-btn-group>
                </div>
              </div>
              <div
                class="flex flex-col sm:flex-row-reverse items-center justify-center gap-3 mt-10 lg:mt-14"
              >
                <app-base-button
                  class="w-full xs:w-auto xs:min-w-[180px]"
                  :disabled="!verifyMnemonic"
                  @click="showStepTwo"
                >
                  {{ $t('common.next') }}
                </app-base-button>
                <app-base-button
                  :is-outline="true"
                  class="w-full xs:w-auto xs:min-w-[180px]"
                  @click="activeStep = 0"
                >
                  {{ $t('common.back') }}
                </app-base-button>
              </div>
            </div>
          </div>

          <div v-if="activeStep === 2">
            <div class="flex flex-col items-center justify-center pt-8 pb-4">
              <check-icon class="w-10 h-10 text-primary stroke-[3px] mb-4" />
              <h3
                class="font-bold text-s-24 sm:text-s-32 mb-2 leading-p-120 text-center"
              >
                {{ stepDescription[2].title }}
              </h3>
              <p
                class="text-s-14 sm:text-s-16 text-info leading-p-150 text-center"
              >
                {{ stepDescription[2].description }}
              </p>
            </div>

            <div class="pt-4 pb-2">
              <div class="flex flex-col items-center justify-center gap-4">
                <app-base-button
                  class="w-full xs:w-auto xs:min-w-[240px]"
                  @click="closeCreateOpenAccess()"
                >
                  Connect wallet
                </app-base-button>
                <app-btn-text
                  class="w-full xs:w-auto xs:min-w-[240px] flex items-center justify-center group"
                  @click="activeStep = 0"
                >
                  Create another wallet
                  <arrow-long-right-icon
                    class="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
                  />
                </app-btn-text>
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
import AppBtnText from '@/components/AppBtnText.vue'
import AppBtnGroup from '@/components/AppBtnGroup.vue'
import AppSheet from '@/components/AppSheet.vue'
import AppNotRecommended from '@/components/AppNotRecommended.vue'
import AppSelect from '@/components/AppSelect.vue'
import { type StepDescription } from '@/types/components/appStepper'
import { english, generateMnemonic } from 'viem/accounts'
import { ArrowPathIcon, CheckIcon } from '@heroicons/vue/24/outline'
import { useCreateStore } from '@/stores/createStore'
import { useAccessStore } from '@/stores/accessStore'
import { ArrowLongRightIcon } from '@heroicons/vue/24/outline'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { analytics, ConnectWalletEvent, CreateWalletEvent } from '@/analytics'

const { closeCreateDialog } = useCreateStore()
const { openAccessDialog, setCurrentView } = useAccessStore()
const { isMobile } = useAppBreakpoints()
/**------------------------
 * Steps
 -------------------------*/
const activeStep = ref(0)
const steps = ['create', 'verify', ' done']
const stepDescription: StepDescription[] = [
  {
    title: 'Your phrase',
    description:
      'Write your recovery phrase on paper and keep it somewhere secure. Do not email it or take screenshots.',
  },
  {
    title: "Let's double check it",
    description: 'Please select correct words based on their numbers.',
  },
  {
    title: 'All Done',
    description:
      'You are now ready to take advantage of all that Ethereum has to offer! Please store your phrase in a secure place, access with mnemonic phrase should only be used in an offline setting.',
  },
]

const backStep = () => {
  activeStep.value = 0
  updateMnemonic()
}

const nextStep = () => {
  activeStep.value = 1
}
const showStepTwo = () => {
  activeStep.value = 2
  analytics.trackCreateWalletEvent(CreateWalletEvent.SUCCESS)
}

const closeCreateOpenAccess = () => {
  closeCreateDialog()
  analytics.trackConnectWalletEvent(ConnectWalletEvent.CLICKED, {
    source: 'Create_Mnemonic',
  })
  openAccessDialog()
  setCurrentView('mnemonic')
}
/**------------------------
 * Verify Indexes
 -------------------------*/

const shuffleArray = (array: number[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const sampleArray = (array: number[]) => {
  const shuffled = shuffleArray([...array])
  return shuffled.slice(0, 3)
}

interface VerifyItem {
  originalIndex: number
  label: string
}
interface VerifySample {
  indexToVerify: number
  items: VerifyItem[]
}
const generatedVerifySamples = computed<VerifySample[]>(() => {
  const samples: VerifySample[] = []
  if (!mnemonic.value || activeStep.value === 0) return samples
  const usedIndexes = new Set<number>()
  const totalWords = mnemonic.value.split(' ')
  const shuffledIndexes = shuffleArray(
    Array.from({ length: totalWords.length }, (_, i) => i),
  )

  for (let i = 0; i < 3; i++) {
    const availableIndexes = shuffledIndexes.filter(
      idx => !usedIndexes.has(idx),
    )
    if (availableIndexes.length < 3) break

    const itemsIndexes = sampleArray(availableIndexes).slice(0, 3)
    itemsIndexes.forEach(idx => usedIndexes.add(idx))
    const indexToVerify = itemsIndexes[0]
    const items = shuffleArray(itemsIndexes).map(idx => ({
      originalIndex: idx,
      label: totalWords[idx],
    }))

    samples.push({
      indexToVerify,
      items: items,
    })
  }

  return samples
})

/**------------------------
 * Selected Options
 -------------------------*/
const sampleOneSelected = ref<VerifyItem | null>(null)
const sampleTwoSelected = ref<VerifyItem | null>(null)
const sampleThreeSelected = ref<VerifyItem | null>(null)

const verifyMnemonic = computed(() => {
  let isValid = false
  if (
    sampleOneSelected.value &&
    sampleTwoSelected.value &&
    sampleThreeSelected.value
  ) {
    isValid =
      sampleOneSelected.value.originalIndex ===
        generatedVerifySamples.value[0].indexToVerify &&
      sampleTwoSelected.value.originalIndex ===
        generatedVerifySamples.value[1].indexToVerify &&
      sampleThreeSelected.value.originalIndex ===
        generatedVerifySamples.value[2].indexToVerify
  }

  return isValid
})
/**------------------------
 * Mnemonic phrase
 -------------------------*/

const mnemonic = ref('')
const length = ref({ label: '12 words', value: '12' })

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
