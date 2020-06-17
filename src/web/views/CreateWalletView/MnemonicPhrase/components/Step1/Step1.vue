<template>
  <div class="mnemonic-step1">
    <mew6-flexible-btn>
      <div class="subtitle-1 font-weight-bold grey--text">STEP 1.</div>
      <div class="headline font-weight-bold mb-5">Write down the words</div>
      <div class="d-flex align-center justify-end pb-4">
        <mew6-std-btn
          size="small"
          min-width="0"
          text
          @click.native="setPhrases"
        >
          <v-icon style="font-size: 18px;">mdi-sync</v-icon> Random
        </mew6-std-btn>
        <div class="selector ml-3">
          <v-select
            v-model="phraseSize"
            hide-details
            :items="items"
            outlined
            dense
            width="200px"
          ></v-select>
        </div>
      </div>
      <PhraseBlock>
        <MnemonicPhraseTable :data="phrases" />
      </PhraseBlock>
      <mew6-std-btn size="x-small" min-width="0" @click.native="linkToStep(2)">
        Next page -->
      </mew6-std-btn>
    </mew6-flexible-btn>
    <Caution class="mt-6" />
  </div>
</template>

<script>
import Caution from '@/components/WarningBlocks/MnemonicCaution';
import PhraseBlock from '../PhraseBlock';
import MnemonicPhraseTable from '@/components/MnemonicPhrase/MnemonicPhraseTable';
import MnemonicTools from '@/common/helpers/mnemonicTools';

export default {
  components: { Caution, PhraseBlock, MnemonicPhraseTable },
  data: () => ({
    items: ['12 words', '24 words'],
    phraseSize: '12 words',
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

<style lang="scss" scoped>
.mnemonic-step1 .selector {
  max-width: 120px;
}
</style>
