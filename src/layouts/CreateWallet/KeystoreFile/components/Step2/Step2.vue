<template>
  <v-sheet class="d-flex flex-column">
    <div>
      <v-sheet class="pt-8 px-3" width="100%">
        <div class="subtitle-1 font-weight-bold grey--text">STEP 2.</div>
        <div class="headline font-weight-bold mb-3">Download keystore file</div>
        <div class="my-2" />
        <v-row class="align-stretch">
          <v-col v-for="d in warningData" :key="d.key">
            <div class="warning-box pa-6">
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
      <div class="my-5" />
      <StdButton
        buttonclass="button--green"
        class="mx-auto display--block"
        @click.native="linkToStep(2)"
        >Acknowledge &amp; Download</StdButton
      >
    </div>
    <div class="my-4" />
    <v-spacer />
    <NotRecommended class="mx-n6 border-radius-bottom" />
  </v-sheet>
</template>

<script>
import StdButton from '@/components/StdButton';
import NotRecommended from '@/components/NotRecommended';
import PaperPlane from '@/assets/images/Etc/CreateWallet/PaperPlane.svg';
import Stolen from '@/assets/images/Etc/CreateWallet/Stolen.svg';
import Copy from '@/assets/images/Etc/CreateWallet/Copy.svg';

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
.warning-box {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.border-radius-bottom {
  border-radius: 0 0 10px 10px;
}
</style>
