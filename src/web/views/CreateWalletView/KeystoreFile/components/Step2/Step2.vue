<template>
  <div>
    <mew6-flexible-btn>
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
      <div class="d-flex justify-center mt-6">
        <mew-button
          title="Acknowledge & Download"
          button-size="xlarge"
          :has-full-width="false"
        />
      </div>
      <div class="d-flex justify-center mt-6">
        <mew6-std-btn
          size="x-large"
          buttonclass="button--green"
          @click.native="linkToStep(3)"
        >
          Acknowledge &amp; Download
        </mew6-std-btn>
      </div>
    </mew6-flexible-btn>
    <warning-sheet
      title="NOT RECOMMENDED"
      description='This information is sensitive, and these options should only be used in offline settings by experienced crypto users. And MEW "CAN NOT" change your password. Please "DO NOT FORGET" to save your password, and it is your private key. You will need this "Password + Keystore file" to access your wallet.'
    />
    <mew6-warning-not-recommended class="mt-6 border-radius--10px" />
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({
    warningData: [
      {
        img: require('@/assets/images/icons/icon-paper-plane-mew.svg'),
        title: "Don't lose it",
        description: 'Be careful, it can not be recovered if you lose it.'
      },
      {
        img: require('@/assets/images/icons/icon-money-bag-mew.svg'),
        title: "Don't share it",
        description:
          'Your funds will be stolen if you use this file on a malicious phishing site.'
      },
      {
        img: require('@/assets/images/icons/icon-copy-mew.svg'),
        title: 'Make a backup',
        description:
          'Secure it like the millions of dollars it may one day be worth.'
      }
    ]
  }),
  methods: {
    linkToStep(step) {
      this.$router.push({
        path: '/create-wallet/keystore',
        query: { step: step }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.warning-box {
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.05);
  height: 100%;
}
</style>
