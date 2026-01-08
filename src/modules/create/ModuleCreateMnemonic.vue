<template>
  <div class="flex justify-center w-full">
    <div
      class="max-w-[624px] flex flex-col items-center justify-center sm:pt-1"
    >
      <app-not-recommended class="mt-0 mb-2" />
      <app-sheet sheet-class="px-4 sm:px-6 lg:px-14">
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
            <div class="flex justify-between items-center gap-4 mt-4 mb-1">
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
              <app-btn-text class="text-primary" @click="updateMnemonic">
                <arrow-path-icon class="inline w-5 h-5 mr-1" />
                Update
              </app-btn-text>
            </div>
            <div
              class="grow border border-1 border-grey-outline text-s-17 rounded-16 p-4 flex justify-center"
            >
              <div class="basis-1/2">
                <div
                  v-for="(phrase, index) in firstSet"
                  :key="index"
                  class="recovery-phrase__item"
                >
                  <span class="text-info text-s-12 pr-1">{{ index + 1 }}.</span>
                  {{ phrase }}
                </div>
              </div>
              <div class="basis-1/2">
                <div
                  v-for="(phrase, index) in secondSet"
                  :key="index"
                  class="recovery-phrase__item"
                >
                  <span class="text-info text-s-12 pr-1"
                    >{{ index + firstSet.length + 1 }}.</span
                  >
                  {{ phrase }}
                </div>
              </div>
            </div>
            <div class="flex items-center justify-center mt-6">
              <app-base-button
                class="w-full xs:w-auto xs:min-w-[150px]"
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
              <div
                class="grid grid-cols-1 gap-4 lg:gap-6 justify-items-stretch"
              >
                <!-- First Sample -->
                <div v-if="generatedVerifySamples.length">
                  <p class="text-s-14 mb-2 text-info">
                    Word #{{ generatedVerifySamples[0].indexToVerify + 1 }}
                  </p>
                  <app-btn-group
                    v-model:selected="sampleOneSelected"
                    :btn-list="generatedVerifySamples[0].items"
                    :size="isMobile ? 'small' : 'large'"
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
                  <p class="text-s-14 mb-2 text-info">
                    Word #{{ generatedVerifySamples[1].indexToVerify + 1 }}
                  </p>
                  <app-btn-group
                    v-model:selected="sampleTwoSelected"
                    :btn-list="generatedVerifySamples[1].items"
                    :size="isMobile ? 'small' : 'large'"
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
                  <p class="text-s-14 mb-2 text-info">
                    Word #{{ generatedVerifySamples[2].indexToVerify + 1 }}
                  </p>
                  <app-btn-group
                    v-model:selected="sampleThreeSelected"
                    :btn-list="generatedVerifySamples[2].items"
                    :size="isMobile ? 'small' : 'large'"
                    has-full-width
                  >
                    <template #btn-content="{ data }">
                      {{ data.label }}
                    </template>
                  </app-btn-group>
                </div>
              </div>
              <div
                class="flex flex-col items-center justify-center mt-6 lg:mt-10"
              >
                <app-base-button
                  class="w-full xs:w-auto xs:min-w-[150px]"
                  :disabled="!verifyMnemonic"
                  @click="activeStep = 2"
                >
                  {{ $t('common.next') }}
                </app-base-button>
                <app-btn-text
                  class="w-full xs:w-auto xs:min-w-[150px] text-primary mt-2"
                  is-large
                  @click="activeStep = 0"
                >
                  {{ $t('common.back') }}
                </app-btn-text>
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
              <div class="flex flex-col items-center justify-center mt-8">
                <app-base-button
                  class="w-full xs:w-auto xs:min-w-[50px]"
                  @click="closeCreateOpenAccess()"
                >
                  Connect wallet
                </app-base-button>
                <app-btn-text
                  :is-outline="true"
                  class="w-full xs:w-auto xs:min-w-[150px] mt-4"
                  is-large
                  @click="activeStep = 0"
                >
                  Create another wallet
                  <arrow-long-right-icon class="inline w-5 h-5 ml-1" />
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
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import { useCreateStore } from '@/stores/createStore'
import { useAccessStore } from '@/stores/accessStore'
import { ArrowLongRightIcon } from '@heroicons/vue/24/outline'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'

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
    title: 'Well done',
    description:
      'You are now ready to take advantage of all that Ethereum has to offer! Access with mnemonic phrase should only be used in an offline setting.',
  },
]

const backStep = () => {
  activeStep.value = 0
  updateMnemonic()
}

const nextStep = () => {
  activeStep.value = 1
}

const closeCreateOpenAccess = () => {
  closeCreateDialog()
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

const firstSet = computed(() => {
  const copy = mnemonic.value.split(' ')
  return copy.splice(0, copy.length / 2)
})
const secondSet = computed(() => {
  const copy = mnemonic.value.split(' ')
  return copy.splice(copy.length / 2)
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
