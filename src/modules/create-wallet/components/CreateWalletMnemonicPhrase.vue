<template>
  <div class="mew-component--create--mnemonic-phrase" style="max-width: 800px">
    <mew-stepper class="mx-md-0" :items="steppers" :on-step="step">
      <!-- ===================================================================================== -->
      <!-- Step 1: Write Down Words -->
      <!-- ===================================================================================== -->
      <template v-if="step === 1" #stepperContent1>
        <div class="subtitle-1 font-weight-bold grey--text">STEP 1.</div>
        <div class="headline font-weight-bold mb-5">Write down these words</div>

        <!-- ===================================================================================== -->
        <!-- Update Button & Word Number Selector -->
        <!-- ===================================================================================== -->
        <div class="d-flex align-center justify-end pb-4">
          <div
            class="greenPrimary--text cursor--pointer d-flex align-center mr-2 pa-2"
            @click="setPhrase"
          >
            <v-icon small color="greenPrimary" class="mr-1">mdi-sync</v-icon>
            <div class="font-weight-medium">Update</div>
          </div>
          <v-select
            v-model="phraseSize"
            style="max-width: 150px"
            hide-details
            dense
            item-text="name"
            item-value="value"
            :items="mnemonicOptions"
            label=""
            outlined
          ></v-select>
        </div>
        <!--
          =====================================================================================
            Phrase Table
          =====================================================================================
          -->
        <phrase-block class="mb-8 CreateWalletMnemonicTable">
          <mnemonic-phrase-table :data="phrase" />
        </phrase-block>

        <!-- ===================================================================================== -->
        <!-- Extra Word -->
        <!-- ===================================================================================== -->
        <div class="mt-10">
          <mew-expand-panel
            :has-dividers="true"
            :is-toggle="true"
            :interactive-content="true"
            :panel-items="[{ name: 'Add Extra Word' }]"
          >
            <template #panelBody1>
              <div class="px-5">
                <mew-input
                  v-model="extraWord"
                  label="Extra word"
                  placeholder="Extra word"
                />
              </div>
            </template>
          </mew-expand-panel>
        </div>
        <!--
          =====================================================================================
           Button
          =====================================================================================
          -->
        <div class="MnemonicWroteThemDown d-flex justify-center mt-6">
          <mew-button
            title="I wrote them down"
            btn-size="xlarge"
            :has-full-width="false"
            @click.native="trackIWroteThemDown()"
          />
        </div>
        <mew-warning-sheet
          class="mt-5 mb-0"
          title="NOT RECOMMENDED"
          description="This information is sensitive, and these options should only be used in offline settings by experienced crypto users. Your phrase is the key to your wallet. Please make sure to write it down and save it in a secure location. We CAN NOT retrieve or reset your phrase if you lose it."
        />
      </template>

      <!-- ===================================================================================== -->
      <!-- Step 2: Verification -->
      <!-- ===================================================================================== -->
      <template v-if="step === 2" #stepperContent2>
        <div class="subtitle-1 font-weight-bold grey--text">STEP 2.</div>
        <div class="headline font-weight-bold">Verification</div>
        <div class="mb-5">
          {{ stepTwoText }}
        </div>
        <!--
          =====================================================================================
           Words Radio Group
          =====================================================================================
          -->
        <v-sheet max-width="600px" class="MnemonicRadioOptions mx-auto">
          <v-radio-group
            v-for="(item, idx) in generatedVerification"
            :key="`${idx}verification`"
            v-model="validateMnemonicValues[getOnlyKey(item)]"
            hide-details
            mandatory
            row
            class="radio-group pa-5"
          >
            <template #label>
              <div
                class="mew-heading-3 mb-3 mb-sm-0"
                style="min-width: 30px; line-height: 25px"
              >
                {{ getOnlyKey(item) + 1 }}.
              </div>
            </template>
            <v-row>
              <v-col
                v-for="(entries, id) in getEntries(item)"
                :key="entries + id"
                class="Options"
                cols="12"
                sm="4"
              >
                <v-radio :label="entries" :value="`${entries}_${id}`"></v-radio>
              </v-col>
            </v-row>
          </v-radio-group>
          <mew-input
            v-if="extraWord && extraWord !== ''"
            v-model="extraWordVerification"
            label="Confirm extra word"
            placeholder="Please confirm your extra word"
            class="mt-10 mb-3"
          />
        </v-sheet>

        <!-- ===================================================================================== -->
        <!-- Back Button & Verify Button -->
        <!-- ===================================================================================== -->
        <div class="d-flex flex-column flex-md-row justify-center mt-6">
          <mew-button
            title="Back"
            btn-size="xlarge"
            btn-style="outline"
            class="mx-md-1 my-1"
            @click.native="trackBackToStepOne"
          />
          <mew-button
            title="Verify"
            btn-size="xlarge"
            :disabled="!canVerify"
            class="CreateMnemonicVerify mx-md-1 my-1"
            @click.native="verify"
          />
        </div>
        <mew-warning-sheet
          class="mt-5 mb-0"
          title="NOT RECOMMENDED"
          description="This information is sensitive, and these options should only be used in offline settings by experienced crypto users. Your phrase is the key to your wallet. Please make sure to write it down and save it in a secure location. We CAN NOT retrieve or reset your phrase if you lose it."
        />
      </template>

      <!-- ===================================================================================== -->
      <!-- Step 3: Done -->
      <!-- ===================================================================================== -->
      <template v-if="step === 3" #stepperContent3>
        <div class="d-flex align-center">
          <div>
            <div class="subtitle-1 font-weight-bold grey--text">STEP 3.</div>
            <div class="headline font-weight-bold mb-3">Well done!</div>
            <p class="mb-6">
              You are now ready to take advantage of all that Ethereum has to
              offer! Access with mnemonic phrase should only be used in an
              offline setting
            </p>
            <v-img
              class="d-block d-sm-none mx-auto mt-12 mb-12"
              max-width="170px"
              src="@/assets/images/icons/icon-keystore-mew.png"
            />

            <div class="d-flex flex-column">
              <mew-button
                title="Access Wallet"
                btn-size="xlarge"
                :has-full-width="false"
                class="CreateMnemonicAccessWallet mb-5"
                @click.native="goToAccess"
              />
              <mew-button
                title="Create Another Wallet"
                :has-full-width="false"
                btn-style="transparent"
                @click.native="createAnotherWallet()"
              />
            </div>
          </div>
          <v-img
            class="d-none d-sm-block ml-8"
            max-width="250px"
            src="@/assets/images/icons/icon-keystore-mew.png"
          />
        </div>
      </template>
    </mew-stepper>
  </div>
</template>

<script setup>
import { watch, ref, computed, onMounted } from 'vue';

import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { ROUTES_HOME } from '@/core/configs/configRoutes';
import { CREATE_WALLET } from '@/modules/analytics-opt-in/handlers/configs/events.js';
import mnemonicPhraseTable from '@/core/components/MnemonicPhraseTable.vue';
import phraseBlock from '@/core/components/PhraseBlock.vue';

import { useAmplitude } from '@/core/composables/amplitude';
import { useRouter } from 'vue-router/composables';

// injections/use
const { trackCreateWalletAmplitude } = useAmplitude();
const router = useRouter();

// props
const props = defineProps({
  handlerCreateWallet: {
    type: Object,
    default: () => {
      return {};
    }
  }
});

// data
const steppers = [
  {
    step: 1,
    name: 'STEP 1. Write down the words'
  },
  {
    step: 2,
    name: 'STEP 2. Verification'
  },
  {
    step: 3,
    name: 'STEP 3. Well done'
  }
];
const mnemonicOptions = [
  {
    name: '12 words',
    value: 12
  },
  {
    name: '24 words',
    value: 24
  }
];
// reactive
const step = ref(1);
const validateMnemonicValues = ref({});
const extraWord = ref('');
const extraWordVerification = ref('');
const phraseSize = ref(12);
const phrase = ref([]);
const generatedVerification = ref([]);

// computed
const canVerify = computed(() => {
  return isValidMnemonic.value && extraWordMatch.value;
});

const isValidMnemonic = computed(() => {
  return phrase.value.length === phraseSize.value;
});

const extraWordMatch = computed(() => {
  return extraWord.value
    ? extraWord.value === extraWordVerification.value
    : true;
});

const stepTwoText = computed(() => {
  return extraWord.value === ''
    ? 'Please select correct words based on their numbers.'
    : 'Please select correct words based on their numbers, and enter your extra word.';
});

// watch
watch(
  () => phraseSize,
  () => {
    phrase.value = [];
    setPhrase();
  },
  () => ({ deep: true })
);

watch(
  () => phrase,
  () => {},
  () => ({ deep: true })
);

// mounted
onMounted(() => {
  setPhrase();
});

// methods
const generateVerification = () => {
  generatedVerification.value = props.handlerCreateWallet.getVerification();
  generatedVerification.value.sort(function (a, b) {
    return a.itemNumber - b.itemNumber;
  });
};

const getOnlyKey = obj => {
  return Number(Object.keys(obj)[0]);
};

const getEntries = obj => {
  return Object.values(obj[getOnlyKey(obj)]);
};

const setPhrase = () => {
  props.handlerCreateWallet
    .generateMnemonic(phraseSize.value)
    .then(res => {
      phrase.value = res;
      generateVerification();
    })
    .catch(e => {
      generateVerification();
      Toast(e, {}, ERROR);
    });
};

const verify = () => {
  props.handlerCreateWallet
    .validateMnemonic(validateMnemonicValues.value)
    .then(() => {
      trackCreateWalletAmplitude(CREATE_WALLET.MNEMONIC_SUCCESS);
      updateStep(3);
    })
    .catch(e => {
      Toast(e, {}, ERROR);
    });
};

const goToAccess = () => {
  trackCreateWalletAmplitude(CREATE_WALLET.MNEMONIC_SUCCESS_ACCESS);
  router.push({ name: ROUTES_HOME.ACCESS_WALLET.NAME });
};

const trackIWroteThemDown = () => {
  trackCreateWalletAmplitude(CREATE_WALLET.MNEMONIC_WROTE_DOWN);
  updateStep(2);
};

const trackBackToStepOne = () => {
  trackCreateWalletAmplitude(CREATE_WALLET.MNEMONIC_BACK);
  updateStep(1);
};

const updateStep = newStep => {
  if (step.value === 3 && newStep === 1) {
    validateMnemonicValues.value = {};
    setPhrase();
  }
  step.value = newStep;
};

const createAnotherWallet = () => {
  extraWord.value = '';
  extraWordVerification.value = '';
  trackCreateWalletAmplitude(CREATE_WALLET.MNEMONIC_SUCCESS_CREATE);
  updateStep(1);
};
</script>

<style lang="scss">
.mew-component--create--mnemonic-phrase .v-input--radio-group__input {
  flex-wrap: nowrap !important;
}
</style>

<style lang="scss" scoped>
.mew-component--create--mnemonic-phrase .mew-stepper.v-stepper {
  background: transparent !important;
}

.radio-group {
  box-shadow: 0 0px 10px var(--v-greyMedium-base) !important;
  border: 1px solid var(--v-greyMedium-base);
  border-radius: 5px;
}
</style>
