<template>
  <v-sheet>
    <v-sheet class="px-5 mt-8 mb-4" width="100%">
      <div class="subtitle-1 font-weight-bold grey--text">STEP 2.</div>
      <div class="headline font-weight-bold mb-5">Download keystore file</div>
      <v-row class="align-stretch">
        <v-col v-for="d in warningData" :key="d.key">
          <div class="warning-box border-radius--10px pa-6 text-center">
            <v-img
              :src="d.img"
              max-width="63px"
              max-height="76px"
              class="mx-auto mb-4"
            />
            <div class="subtitle-1 font-weight-medium mb-1">
              {{ d.title }}
            </div>
            <div>{{ d.description }}</div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
    <div class="d-flex justify-center mb-7">
      <StdButton
        size="x-large"
        buttonclass="button--green"
        @click.native="linkToStep(2)"
      >
        Acknowledge &amp; Download
      </StdButton>
    </div>
    <NotRecommended class="mx-n6 border-radius-bottom--10px" />
  </v-sheet>
</template>

<script>
import StdButton from '@/web/components/StdButton';
import NotRecommended from '@/web/components/NotRecommended';
import PaperPlane from '@/assets/images/icons/icon-paper-plane-mew.svg';
import Stolen from '@/assets/images/icons/icon-money-bag-mew.svg';
import Copy from '@/assets/images/icons/icon-copy-mew.svg';

export default {
  components: { StdButton, NotRecommended },
  data: () => ({
    warningData: [
      {
        img: PaperPlane,
        title: "Don't lose it",
        description: 'Be careful, it can not be recovered if you lose it.'
      },
      {
        img: Stolen,
        title: "Don't share it",
        description:
          'Your funds will be stolen if you use this file on a malicious phishing site.'
      },
      {
        img: Copy,
        title: 'Make a backup',
        description:
          'Secure it like the millions of dollars it may one day be worth.'
      }
    ]
  }),
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
@import '@/assets/styles/GlobalVariables.scss';

.warning-box {
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.05);
  height: 100%;
}
</style>
