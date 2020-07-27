<template>
  <div>
    <v-sheet color="white" class="border-radius--10px pa-12">
      <div class="subtitle-1 font-weight-bold grey--text">STEP 2.</div>
      <div class="headline font-weight-bold mb-5">Download keystore file</div>
      <v-row class="align-stretch">
        <v-col v-for="(d, key) in warningData" :key="key">
          <mew-super-button
            :title="d.title"
            :subtitle="d.description"
            is-column
            icon-type="img"
            :right-icon="d.img"
          />
        </v-col>
      </v-row>
      <div class="d-flex justify-center mt-6">
        <mew-button
          title="Acknowledge & Download"
          button-size="xlarge"
          :has-full-width="false"
          @click.native="linkToStep(3)"
        />
      </div>
    </v-sheet>
    <warning-sheet
      title="NOT RECOMMENDED"
      description='This information is sensitive, and these options should only be used in offline settings by experienced crypto users. And MEW "CAN NOT" change your password. Please "DO NOT FORGET" to save your password, and it is your private key. You will need this "Password + Keystore file" to access your wallet.'
    />
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
