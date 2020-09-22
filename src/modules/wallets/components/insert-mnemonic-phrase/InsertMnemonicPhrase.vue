<template>
  <div class="mew-component--insert-mnemonic-phrase">
    <v-sheet color="transparent" max-width="800px" class="mx-auto">
      <div v-if="step === 1">
        <h2 class="text-center mb-10">1. Enter your mnemonic phrase</h2>
        <mew6-white-sheet class="border-radius--10px pa-4 pa-sm-12">
          <div class="headline font-weight-bold mb-2">Mnemonic phrase</div>
          <div class="mb-5">
            Please type the mnemonic phrase you wrote down in the right order.
          </div>
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
            <template v-slot:panelBody1> Input needs to be added </template>
          </mew-expand-panel>

          <div class="d-flex justify-center mt-6">
            <mew-button
              title="I wrote them down"
              button-size="xlarge"
              :has-full-width="false"
              @click.native="step = 2"
            />
          </div>
        </mew6-white-sheet>
        <warning-sheet
          title="NOT RECOMMENDED"
          description='This information is sensitive, and these options should only be used in offline settings by experienced crypto users. And MEW "CAN NOT" change your password. Please "DO NOT FORGET" to save your password, and it is your private key. You will need this "Password + Keystore file" to access your wallet.'
        />
      </div>

      <div v-if="step === 2">
        <h2 class="text-center mb-10">2. Confirm network & address</h2>
        <mew6-white-sheet class="border-radius--10px pa-4 pa-sm-12">
          aaaaa
        </mew6-white-sheet>

        <div class="d-flex justify-center mt-6">
          <mew-button
            title="I wrote them down"
            button-size="xlarge"
            :has-full-width="false"
            @click.native="step = 1"
          />
        </div>
      </div>

      <div class="spacer-y-medium" />
    </v-sheet>
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
    step: 1,
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
