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
          <app-base-button @click="clickNext"> Next </app-base-button>
        </div>
      </div>
      <div v-if="activeStep === 1">
        <app-step-description
          :description="stepDescription[1]"
          :activeStep="activeStep"
        />
      </div>
    </app-stepper>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AppStepper from '@/components/AppStepper.vue'
import AppStepDescription from '@/components/AppStepDescription.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { type StepDescription } from '@/types/components/appStepper'
import AppInput from '@/components/AppInput.vue'
import AppTextField from '@/components/AppTextField.vue'
import AppToggle from '@/components/AppToggle.vue'
import ExpandTransition from '@/components/transitions/ExpandTransition.vue'

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
 * Mnemonic
 -------------------------*/

const mnemonic = ref('')

const clickNext = () => {
  if (activeStep.value === 0) {
    activeStep.value = 1
  }
}
</script>
