<template>
  <div class="expandHeader">
    <v-sheet color="transparent" max-width="800px" class="mx-auto">
      <mew-stepper :items="steppers" :on-step="1">
        <template v-slot:outsideStepContent0>
          <div class="mnemonic-step1">
            <v-sheet>
              <div class="subtitle-1 font-weight-bold grey--text">STEP 1.</div>
              <div class="headline font-weight-bold mb-5">
                Write down the words
              </div>

              <div class="d-flex align-center justify-end pb-4">
                <mew-button
                  button-size="medium"
                  icon="mdi-sync"
                  icon-type="mdi"
                  icon-align="left"
                  title="Random"
                  btn-style="transparent"
                  color-theme="basic"
                  @click.native="setPhrases"
                />

                <div class="selector ml-3">
                  <mew-select :items="mnemonicOptions" />
                </div>
              </div>
              <phrase-block class="mb-8">
                <mnemonic-phrase-table :data="phrases" />
              </phrase-block>

              <mew-expand-panel is-toggle has-dividers :panel-items="exPanel">
                <template v-slot:panelBody1> Input needs to be added </template>
              </mew-expand-panel>

              <div class="d-flex justify-center mt-6">
                <mew-button
                  title="I wrote them down"
                  button-size="xlarge"
                  :has-full-width="false"
                  @click.native="linkToStep(2)"
                />
              </div>
            </v-sheet>
            <warning-sheet
              class="mt-5"
              title="Caution"
              description="DO NOT take a screenshot or
            share this phrase with anyone. This phrase acts as the PRIVATE KEY to access
            your wallet."
              :link-obj="link"
            />
          </div>
        </template>

        <template v-slot:outsideStepContent1>
          <div>
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

            <warning-sheet
              title="NOT RECOMMENDED"
              description="Not recommanded"
            />
          </div>
        </template>

        <template v-slot:outsideStepContent2>
          <v-sheet>
            <div class="d-flex align-center">
              <div class="mr-8">
                <div class="subtitle-1 font-weight-bold grey--text">
                  STEP 3.
                </div>
                <div class="headline font-weight-bold mb-3">You are done!</div>
                <p class="mb-6">
                  Congratulation! Please use the MEWconnect App to scan this QR
                  code in order to access your new wallet. And you are done!
                </p>

                <mew-button
                  title="Access my wallet"
                  button-size="xlarge"
                  :has-full-width="false"
                  @click.native="linkToStep(3)"
                />

                <p class="mt-4 mb-0">
                  Need help?
                  <router-link
                    class="primary--text text-decoration--none font-weight-bold"
                    to="/"
                    >Get helps from MEWconnect</router-link
                  >
                </p>
              </div>
              <v-img
                max-width="250px"
                src="@/assets/images/icons/icon-keystore-mew.png"
              />
            </div>
          </v-sheet>
        </template>
      </mew-stepper>
    </v-sheet>
    <div class="spacer-y-medium" />
  </div>
</template>

<script>
import phraseBlock from '../phrase-block/PhraseBlock';
import mnemonicPhraseTable from '../mnemonic-phrase-table/MnemonicPhraseTable';
import MnemonicTools from '@/helpers/mnemonicTools';
export default {
  name: 'MewConnect',
  components: {
    phraseBlock,
    mnemonicPhraseTable
  },
  data: () => ({
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
    phrases: []
  }),
  method: {
    setPhrases() {
      if (this.phraseSize == '12 words') {
        this.phrases = MnemonicTools.phrase12();
      } else {
        this.phrases = MnemonicTools.phrase24();
      }
    }
  }
};
</script>
