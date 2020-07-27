<template>
  <div>
    <v-sheet color="white" class="border-radius--10px pa-12">
      <div class="subtitle-1 font-weight-bold grey--text">STEP 1.</div>
      <div class="headline font-weight-bold mb-5">Create password</div>
      <div class="d-flex align-start">
        <mew-input
          hint="Password must be 8 or more charactors"
          label="Password"
          placeholder=" "
          class="mr-3 flex-grow-1"
        />
        <mew-button
          title="Create"
          button-size="xlarge"
          :has-full-width="false"
          @click.native="linkToStep(2)"
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
  data: () => ({}),
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
