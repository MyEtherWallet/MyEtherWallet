<template>
  <v-sheet color="transparent">
    <mew-stepper :items="steppers" :on-step="step">
      <template v-if="step === 1" #outsideStepContent1>
        <div>
          <v-sheet class="pa-12">
            <v-container>
              <v-row align-items="center" justify="space-between">
                <v-col cols="6">
                  <div class="subtitle-1 font-weight-bold grey--text">
                    STEP 1.
                  </div>
                  <div class="headline font-weight-bold mb-5">
                    Write down the words
                  </div>
                </v-col>
                <v-col cols="6">
                  <v-row align-content="center" justify="end">
                    <mew-button
                      button-size="medium"
                      icon="mdi-sync"
                      icon-type="mdi"
                      icon-align="left"
                      title="Random"
                      btn-style="transparent"
                      color-theme="basic"
                      @click.native="setPhrase"
                    />

                    <div class="selector ml-3">
                      <mew-select
                        v-model="phraseSize"
                        :items="mnemonicOptions"
                      />
                    </div>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
            <v-sheet class="mnemonic-phrase-container pa-10" elevation="2">
              <v-container>
                <v-row align="center" justify="space-around">
                  <v-col
                    v-for="(word, idx) in phrase"
                    :key="`mnemonicInput${idx}`"
                    cols="2"
                  >
                    <div class="mnemonic-input">
                      <label :for="`mnemonicInput${idx}`"
                        >{{ idx + 1 }}.
                      </label>
                      <input
                        :ref="`mnemonicInput${idx}`"
                        :name="`mnemonicInput${idx}`"
                        readonly
                        :value="word"
                      />
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-sheet>

            <div class="mt-10">
              <mew-expand-panel
                :has-dividers="true"
                :is-toggle="true"
                :interactive-content="true"
                :panel-items="[
                  {
                    name: 'Extra Word'
                  }
                ]"
              >
                <template #panelBody1>
                  <mew-input
                    v-model="extraWord"
                    type="password"
                    label="Extra word"
                    placeholder="Extra word"
                  />
                </template>
              </mew-expand-panel>
            </div>
            <v-container class="password-container">
              <v-col align="center" justify="center">
                <mew-button
                  title="I wrote them down"
                  button-size="large"
                  :disabled="!isValidMnemonic"
                  @click.native="next"
                />
              </v-col>
            </v-container>
          </v-sheet>
          <mew-warning-sheet
            class="mt-5"
            title="Caution"
            description="DO NOT take a screenshot or
            share this phrase with anyone. This phrase acts as the PRIVATE KEY to access
            your wallet."
            :link-obj="link"
          />
        </div>
      </template>

      <template v-if="step === 2" #outsideStepContent2>
        <v-sheet class="pa-12">
          <div class="subtitle-1 font-weight-bold grey--text">STEP 2.</div>
          <div class="mb-10">
            <div class="headline font-weight-bold">Verification</div>
            <div>
              Please select the correct words based on their numbers, and enter
              the extra word if you have one.
            </div>
          </div>
          <div class="pa-12">
            <div v-for="(item, idx) in generatedVerification" :key="item + idx">
              <p>{{ Object.keys(item)[0] }}.</p>
              <v-container>
                <v-row align="center" justify="space-around" class="text-left">
                  <div
                    v-for="word in Object.values(Object.values(item)[0])"
                    :key="word"
                  >
                    {{ word }}
                  </div>
                </v-row>
              </v-container>
            </div>
            <div class="mt-10">
              <mew-input
                v-model="extraWord"
                type="password"
                label="Extra word"
                placeholder="Extra word"
              />
            </div>
            <v-container class="password-container">
              <v-col align="center" justify="center">
                <mew-button
                  title="Verify"
                  button-size="large"
                  :disabled="!isValidMnemonic"
                  @click.native="next"
                />
              </v-col>
            </v-container>
          </div>
        </v-sheet>
        <!-- <div>
          <v-sheet>
            <div class="subtitle-1 font-weight-bold grey--text">STEP 2.</div>
            <div class="mb-10">
              <div class="headline font-weight-bold">Verification</div>
              <div>
                Please select the correct words based on their numbers, and
                enter the extra word if you have one.
              </div>
            </div>

            <v-sheet max-width="600px" class="mx-auto">
              <phrase-block class="mb-2 d-flex align-center">
                <div style="min-width: 60px">5.</div>
                <v-radio-group
                  v-model="radioGroup1"
                  hide-details
                  class="full-width-percent"
                >
                  <v-row>
                    <v-col v-for="n in 3" :key="n" lg="4">
                      <v-radio :label="`Radio ${n}`" :value="n"></v-radio>
                    </v-col>
                  </v-row>
                </v-radio-group>
              </phrase-block>
              <phrase-block class="mb-2 d-flex align-center">
                <div style="min-width: 60px">5.</div>
                <v-radio-group
                  v-model="radioGroup2"
                  hide-details
                  class="full-width-percent"
                >
                  <v-row>
                    <v-col v-for="n in 3" :key="n" lg="4">
                      <v-radio :label="`Radiaaaao ${n}`" :value="n"></v-radio>
                    </v-col>
                  </v-row>
                </v-radio-group>
              </phrase-block>
              <phrase-block class="mb-2 d-flex align-center">
                <div style="min-width: 60px">5.</div>
                <v-radio-group
                  v-model="radioGroup3"
                  hide-details
                  class="full-width-percent"
                >
                  <v-row>
                    <v-col v-for="n in 3" :key="n" lg="4">
                      <v-radio :label="`Radiaaaao ${n}`" :value="n"></v-radio>
                    </v-col>
                  </v-row>
                </v-radio-group>
              </phrase-block>
              <mew-input
                label="Extra word"
                placeholder="Please confirm your extra word"
                class="mt-10 mb-3"
              />
            </v-sheet>
            <div class="d-flex justify-center mb-3">
              <mew-button
                title="Verify"
                button-size="xlarge"
                :has-full-width="false"
                @click.native="linkToStep(3)"
              />
            </div>
          </v-sheet>

          <mew-warning-sheet
            title="NOT RECOMMENDED"
            description="Not recommanded"
          />
        </div> -->
      </template>

      <template v-if="step === 3" #outsideStepContent3>
        Hello step 3
        <!-- <v-sheet>
          <div class="d-flex align-center">
            <div class="mr-8">
              <div class="subtitle-1 font-weight-bold grey--text">STEP 3.</div>
              <div class="headline font-weight-bold mb-3">Well done!</div>
              <p class="mb-6">
                Congratulations! You have created a new wallet successfully.
              </p>

              <mew-button
                title="Access my wallet"
                button-size="xlarge"
                :has-full-width="false"
                @click.native="linkToStep(3)"
              />

              <p class="mt-4 mb-0">
                <router-link
                  class="primary--text text-decoration--none font-weight-bold"
                  to="/"
                  >Back to homepages</router-link
                >
              </p>
            </div>
            <v-img
              max-width="250px"
              src="@/assets/images/icons/icon-keystore-mew.png"
            />
          </div>
        </v-sheet> -->
      </template>
    </mew-stepper>
  </v-sheet>
</template>

<script>
// import phraseBlock from '../phrase-block/PhraseBlock';
import MnemonicTools from '@/helpers/mnemonicTools';
export default {
  name: 'CreateMnemonicPhrase',
  // components: {
  //   phraseBlock
  // },
  data: () => ({
    extraWord: '',
    extraWordVerification: '',
    link: {
      title: 'Learn more',
      url: 'https://www.myetherwallet.com/terms-of-service'
    },
    titleData: {
      textProps: 'white--text',
      toptitle: '',
      title: 'Mnemonic phrase',
      titleMaxWidth: '',
      description:
        'An official, free companion App for MyEtherWallet that helps you secure your funds as never before.',
      descriptionMaxWidth: '400px',
      centered: true
    },
    steppers: [
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
    ],
    mnemonicOptions: [
      {
        name: '12 words',
        value: 12
      },
      {
        name: '24 words',
        value: 24
      }
    ],
    phraseSize: {
      name: '12 words',
      value: 12
    },
    phrase: [],
    step: 1
  }),
  computed: {
    isValidMnemonic() {
      return this.phrase.length === this.phraseSize.value;
    },
    extraWordMatch() {
      return this.extraWord === this.extraWordVerification;
    },
    generatedVerification() {
      const words = MnemonicTools.phrase24();
      const idxs = [];
      while (idxs.length < 3) {
        const random = Math.floor(Math.random() * this.phrase.length) + 1;
        if (idxs.indexOf(random) === -1) {
          idxs.push(random);
        }
      }

      const output = idxs.map(item => {
        return {
          [item]: {
            1: this.phrase[item],
            2: words[this.randomNumberGenerator()],
            3: words[this.randomNumberGenerator()]
          }
        };
      });
      return output;
    }
  },
  watch: {
    phraseSize: {
      deep: true,
      handler: function (newVal) {
        this.phraseSize = newVal;
        this.setPhrase();
      }
    },
    phrase: {
      deep: true
    }
  },
  mounted() {
    this.setPhrase();
  },
  methods: {
    setPhrase() {
      this.phraseSize.value === 12
        ? (this.phrase = MnemonicTools.phrase12())
        : (this.phrase = MnemonicTools.phrase24());
    },
    next() {
      this.step += 1;
    },
    randomNumberGenerator() {
      return Math.floor(Math.random() * 24) + 1;
    }
  }
};
</script>

<style lang="scss" scoped>
.mnemonic-phrase-container {
  border-radius: 5px !important;
  border: 1px solid rgb(230, 235, 239) !important; // hard coding this color for now based on abstract

  .mnemonic-input {
    width: 100%;
    position: relative;

    input {
      width: 100%;
      padding-left: 21px;
      padding-bottom: 2px;
      border-bottom: 1px solid rgb(230, 235, 239) !important; // hard coding this color for now based on abstract

      &:focus {
        outline: none !important;
        border-bottom: 1px solid black !important; // hard coding this color for now based on abstract
      }
    }

    label {
      position: absolute;
    }
  }
}
</style>
