<template>
  <v-sheet
    class="mew-component--mnemonic-phrase"
    max-width="800px"
    color="transparent"
  >
    <mew-stepper class="mx-n12 mx-md-0" :items="steppers" :on-step="step">
    </mew-stepper>

    <div v-if="step === 1">
      <v-sheet color="white" class="border-radius--10px pa-4 pa-sm-12">
        <div class="subtitle-1 font-weight-bold grey--text">STEP 1.</div>
        <div class="headline font-weight-bold mb-5">Write down the words</div>
        <div class="d-flex align-center justify-end pb-4">
          <mew-button
            btn-size="medium"
            icon="mdi-sync"
            icon-type="mdi"
            icon-align="left"
            title="Random"
            btn-style="transparent"
            color-theme="primary"
            @click.native="setPhrase"
          />
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
        <phrase-block class="mb-8">
          <mnemonic-phrase-table :data="phrase" />
        </phrase-block>

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

        <div class="d-flex justify-center mt-6">
          <mew-button
            title="I wrote them down"
            btn-size="xlarge"
            :has-full-width="false"
            @click.native="step = 2"
          />
        </div>
      </v-sheet>
      <mew-warning-sheet
        title="NOT RECOMMENDED"
        description='This information is sensitive, and these options should only be used in offline settings by experienced crypto users. And MEW "CAN NOT" change your password. Please "DO NOT FORGET" to save your password, and it is your private key. You will need this "Password + Keystore file" to access your wallet.'
      />
    </div>

    <div v-if="step === 2">
      <v-sheet color="white" class="border-radius--10px pa-4 pa-sm-12">
        <div class="subtitle-1 font-weight-bold grey--text">STEP 2.</div>
        <div class="headline font-weight-bold">Verification</div>
        <div class="mb-5">
          Please select the correct words based on their numbers, and enter the
          extra word if you have one.
        </div>

        <v-sheet max-width="600px" class="mx-auto">
          <border-block
            sm-border-radius
            sm-shadow
            class="mb-2 d-flex align-center px-5 py-1"
          >
            <div style="min-width: 30px">5.</div>
            <v-radio-group
              v-model="radioGroup1"
              hide-details
              class="width--full"
            >
              <v-row>
                <v-col v-for="n in 3" :key="n" cols="12" sm="4">
                  <v-radio label="Radia" :value="n"></v-radio>
                </v-col>
              </v-row>
            </v-radio-group>
          </border-block>
          <border-block
            sm-border-radius
            sm-shadow
            class="mb-2 d-flex align-center px-5 py-1"
          >
            <div style="min-width: 30px">5.</div>
            <v-radio-group
              v-model="radioGroup2"
              hide-details
              class="width--full"
            >
              <v-row>
                <v-col v-for="n in 3" :key="n" cols="12" sm="4">
                  <v-radio label="Radiaaaao" :value="n"></v-radio>
                </v-col>
              </v-row>
            </v-radio-group>
          </border-block>
          <border-block
            sm-border-radius
            sm-shadow
            class="mb-2 d-flex align-center px-5 py-1"
          >
            <div style="min-width: 30px">5.</div>
            <v-radio-group
              v-model="radioGroup3"
              hide-details
              class="width--full"
            >
              <v-row>
                <v-col v-for="n in 3" :key="n" cols="12" sm="4">
                  <v-radio label="Radiaaerge" :value="n"></v-radio>
                </v-col>
              </v-row>
            </v-radio-group>
          </border-block>
          <mew-input
            v-model="extraWord"
            label="Extra word"
            placeholder="Please confirm your extra word"
            class="mt-10 mb-3"
          />
        </v-sheet>

        <v-btn
          v-if="false"
          depressed
          x-large
          color="primary"
          class="text-transform--initial"
          @click="step = 3"
        >
          Acknowledge & Download
        </v-btn>

        <div class="d-flex justify-center mt-6">
          <mew-button
            title="Verify"
            btn-size="xlarge"
            :disabled="!isValidMnemonic"
            @click.native="next"
          />
        </div>
      </v-sheet>
      <mew-warning-sheet
        title="NOT RECOMMENDED"
        description='This information is sensitive, and these options should only be used in offline settings by experienced crypto users. And MEW "CAN NOT" change your password. Please "DO NOT FORGET" to save your password, and it is your private key. You will need this "Password + Keystore file" to access your wallet.'
      />
    </div>

    <!-- <v-sheet v-if="step === 2" class="pa-12">
      <div class="subtitle-1 font-weight-bold grey--text">STEP 2.</div>
      <div class="mb-10">
        <div class="headline font-weight-bold">Verification</div>
        <div>
          Please select the correct words based on their numbers, and enter the
          extra word if you have one.
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
              btn-size="large"
              :disabled="!isValidMnemonic"
              @click.native="next"
            />
          </v-col>
        </v-container>
      </div>
    </v-sheet>-->
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
                btn-size="xlarge"
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

    <v-sheet
      v-if="step === 3"
      color="white"
      class="border-radius--10px pa-4 pa-sm-12"
    >
      <div class="d-flex align-center">
        <div>
          <div class="subtitle-1 font-weight-bold grey--text">STEP 3.</div>
          <div class="headline font-weight-bold mb-3">Well done</div>
          <p class="mb-6">
            Congratulation! Please use the MEWconnect App to scan this QR code
            in order to access your new wallet. And you are done!
          </p>
          <v-img
            class="d-block d-sm-none mx-auto mt-12 mb-12"
            max-width="170px"
            src="@/assets/images/icons/icon-keystore-mew.png"
          />

          <div class="d-flex flex-column">
            <mew-button
              title="Access my wallet"
              btn-size="xlarge"
              :has-full-width="false"
              class="mb-5"
              @click.native="step = 1"
            />

            <div class="mt-3 mb-0 text-center">
              <router-link
                class="primary--text text-decoration--none font-weight-bold"
                to="/"
                >Back to home</router-link
              >
            </div>
          </div>
        </div>
        <v-img
          class="d-none d-sm-block ml-8"
          max-width="250px"
          src="@/assets/images/icons/icon-keystore-mew.png"
        />
      </div>
    </v-sheet>

    <div class="spacer-y-medium" />
  </v-sheet>
</template>

<script>
import borderBlock from '@/components/border-block/BorderBlock.vue';
import mnemonicPhraseTable from '../mnemonic-phrase-table/MnemonicPhraseTable';
import phraseBlock from '../phrase-block/PhraseBlock';
import MnemonicTools from '@/helpers/mnemonicTools';
export default {
  name: 'CreateMnemonicPhrase',
  components: {
    borderBlock,
    mnemonicPhraseTable,
    phraseBlock
  },
  data: () => ({
    radioGroup1: {},
    radioGroup2: {},
    radioGroup3: {},
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
    phraseSize: 12,
    phrase: [],
    step: 3
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
      console.log(this.phraseSize + ' --------------------');
      this.phraseSize === 12
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

<style lang="scss">
.mew-component--mnemonic-phrase .mew-stepper.v-stepper {
  background: transparent !important;
}
</style>
