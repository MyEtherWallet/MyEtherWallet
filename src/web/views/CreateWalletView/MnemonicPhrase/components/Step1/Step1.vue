<template>
  <div>
    <mew6-flexible-btn>
      <div class="subtitle-1 font-weight-bold grey--text">STEP 1.</div>
      <div class="headline font-weight-bold mb-5">Write down the words</div>
      <PhraseBlock>
        <div>aaaa</div>
        <div></div>
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

export default {
  components: { Caution, PhraseBlock },
  data: () => ({}),
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
