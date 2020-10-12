<template>
  <div class="mew-component--mnemonic-phrase">
    <v-sheet color="transparent" max-width="800px" class="mx-auto">
      <mew-stepper-header :tabs="tabs" :active-tab="step" class="mb-6" />
      <div v-if="step === 1">
        <v-sheet color="white" class="border-radius--10px pa-4 pa-sm-12">
          <div class="subtitle-1 font-weight-bold grey--text">STEP 1.</div>
          <div class="headline font-weight-bold mb-5">Write down the words</div>
          <div class="d-flex align-center justify-end pb-4">
            <mew-button
              button-size="medium"
              icon="mdi-sync"
              icon-type="mdi"
              icon-align="left"
              title="Random"
              btn-style="transparent"
              color-theme="primary"
              @click.native="setPhrases"
            />
            <v-select
              v-model="phraseSize"
              style="max-width: 150px"
              hide-details
              dense
              item-text="label"
              item-value="value"
              :items="mnemonicOptions"
              label=""
              outlined
              @change="setPhrases"
            ></v-select>
          </div>
          <phrase-block class="mb-8">
            <mnemonic-phrase-table :data="phrases" />
          </phrase-block>

          <mew-expand-panel
            is-toggle
            has-dividers
            :panel-items="extraWordsPanel"
          >
            <template #panelBody1>
              <mew-input label="Extra word" placeholder=" " />
            </template>
          </mew-expand-panel>

          <div class="d-flex justify-center mt-6">
            <mew-button
              title="I wrote them down"
              button-size="xlarge"
              :has-full-width="false"
              @click.native="step = 2"
            />
          </div>
        </v-sheet>
        <warning-sheet
          title="NOT RECOMMENDED"
          description='This information is sensitive, and these options should only be used in offline settings by experienced crypto users. And MEW "CAN NOT" change your password. Please "DO NOT FORGET" to save your password, and it is your private key. You will need this "Password + Keystore file" to access your wallet.'
        />
      </div>

      <div v-if="step === 2">
        <v-sheet color="white" class="border-radius--10px pa-4 pa-sm-12">
          <div class="subtitle-1 font-weight-bold grey--text">STEP 2.</div>
          <div class="headline font-weight-bold">Verification</div>
          <div class="mb-5">
            Please select the correct words based on their numbers, and enter
            the extra word if you have one.
          </div>

          <v-sheet max-width="600px" class="mx-auto">
            <border-block sm-border class="mb-2 d-flex align-center px-5 py-1">
              <div style="min-width: 30px">5.</div>
              <v-radio-group
                v-model="radioGroup"
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
            <border-block sm-border class="mb-2 d-flex align-center px-5 py-1">
              <div style="min-width: 30px">5.</div>
              <v-radio-group
                v-model="radioGroup"
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
            <border-block sm-border class="mb-2 d-flex align-center px-5 py-1">
              <div style="min-width: 30px">5.</div>
              <v-radio-group
                v-model="radioGroup"
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
              title="Acknowledge & Download"
              button-size="xlarge"
              :has-full-width="false"
              @click.native="step = 3"
            />
          </div>
        </v-sheet>
        <warning-sheet
          title="NOT RECOMMENDED"
          description='This information is sensitive, and these options should only be used in offline settings by experienced crypto users. And MEW "CAN NOT" change your password. Please "DO NOT FORGET" to save your password, and it is your private key. You will need this "Password + Keystore file" to access your wallet.'
        />
      </div>

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
                button-size="xlarge"
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
  </div>
</template>

<script>
import phraseBlock from '../phrase-block/PhraseBlock';
import mnemonicPhraseTable from '../mnemonic-phrase-table/MnemonicPhraseTable';
import MnemonicTools from '@/helpers/mnemonicTools';
import borderBlock from '@/components/border-block/BorderBlock.vue';

export default {
  name: 'MewConnect',
  components: {
    phraseBlock,
    mnemonicPhraseTable,
    borderBlock
  },
  data: () => ({
    step: 1,
    tabs: [
      {
        label: 'Write down the words'
      },
      {
        label: 'Verification'
      },
      {
        label: 'Well done'
      }
    ],
    mnemonicOptions: [
      {
        label: '12 words',
        value: 12
      },
      {
        label: '24 words',
        value: 24
      }
    ],
    phrases: [],
    phraseSize: 12,
    extraWordsPanel: [
      {
        name: 'Add extra word',
        subtext: 'ETH - myetherapi.com'
      }
    ]
  }),
  mounted() {
    this.setPhrases();
  },
  methods: {
    setPhrases() {
      if (this.phraseSize == 12) {
        this.phrases = MnemonicTools.phrase12();
      } else {
        this.phrases = MnemonicTools.phrase24();
      }
    }
  }
};
</script>

<style lang="scss">
.mew-component--mnemonic-phrase {
  .v-input--selection-controls {
    margin-top: 0;
    padding-top: 0;
  }
}
</style>
