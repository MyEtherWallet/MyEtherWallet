<template>
  <v-sheet min-height="500px" class="d-flex flex-column">
    <div>
      <v-sheet class="pt-8 px-3" width="100%">
        <div class="subtitle-1 font-weight-bold grey--text">STEP 2.</div>
        <div class="headline font-weight-bold mb-3">Download keystore file</div>
        <div class="my-5" />
        <div class="d-flex"></div>
      </v-sheet>

      <StdButton
        buttonclass="button--green"
        class="mx-auto display--block"
        @click.native="linkToStep(2)"
        >Acknowledge &amp; Download</StdButton
      >
    </div>
    <v-spacer />
    <NotRecommended class="mx-n6 border-radius-bottom" />
  </v-sheet>
</template>

<script>
import StdButton from '@/components/StdButton';
import NotRecommended from '@/components/NotRecommended';

export default {
  components: { StdButton, NotRecommended },
  data: () => ({}),
  methods: {
    linkToStep(step) {
      this.$router.push({
        path: '/create-wallet/mewconnect',
        query: { step: step }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.border-radius-bottom {
  border-radius: 0 0 10px 10px;
}
</style>
