<template>
  <div>
    <mew6-flexible-btn>
      <div class="subtitle-1 font-weight-bold grey--text">STEP 1.</div>
      <div class="headline font-weight-bold mb-5">Write down the words</div>
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
    phrases: ['duty', 'aaa', 'bbbb']
  }),
  mounted() {
    console.log(MnemonicTools);
  },
  methods: {
    linkToStep(step) {
      this.$router.push({
        path: '/create-wallet/mnemonic',
        query: { step: step }
      });
    }
  }
};
</script>
