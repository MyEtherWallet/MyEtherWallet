<template>
  <div class="mnemonic-step1">
    <v-sheet>
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
          color-theme="basic"
          @click.native="setPhrases"
        />

        <div class="selector ml-3">
          <mew-select :items="items" />
        </div>
      </div>
      <PhraseBlock class="mb-8">
        <MnemonicPhraseTable :data="phrases" />
      </PhraseBlock>

      <mew-expand-panel is-toggle has-dividers :panel-items="exPanel">
        <template v-slot:panelBody0>
          Input needs to be added
        </template>
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

<script>
import PhraseBlock from '../PhraseBlock';
import MnemonicPhraseTable from '@/components/MnemonicPhrase/MnemonicPhraseTable';
import MnemonicTools from '@/common/helpers/mnemonicTools';

export default {
  components: { PhraseBlock, MnemonicPhraseTable },
  data: () => ({
    link: { title: 'Learn more', url: 'https://www.myetherwallet.com/' },
    exPanel: [
      {
        name: 'Add extra words'
      }
    ],
    items: [
      {
        name: '12 words',
        value: '12 words'
      },
      {
        name: '24 words',
        value: '12 words'
      }
    ],
    phraseSize: '24 words',
    phrases: []
  }),
  watch: {
    phraseSize() {
      this.setPhrases();
    }
  },
  mounted() {
    this.setPhrases();
  },
  methods: {
    setPhrases() {
      if (this.phraseSize == '12 words') {
        this.phrases = MnemonicTools.phrase12();
      } else {
        this.phrases = MnemonicTools.phrase24();
      }
    },
    linkToStep(step) {
      this.$router.push({
        path: '/create-wallet/mnemonic',
        query: { step: step }
      });
    }
  }
};
</script>
