<template>
  <div>
    <mew6-flexible-btn>
      <div class="subtitle-1 font-weight-bold grey--text">STEP 1.</div>
      <div class="headline font-weight-bold mb-5">Create password</div>
      <PasswdField btnlabel="Create" fldlabel="Password" />
      <mew6-std-btn size="x-small" min-width="0" @click.native="linkToStep(2)">
        Next page -->
      </mew6-std-btn>
    </mew6-flexible-btn>
    <warning-sheet
      title="NOT RECOMMENDED"
      description='This information is sensitive, and these options should only be used in offline settings by experienced crypto users. And MEW "CAN NOT" change your password. Please "DO NOT FORGET" to save your password, and it is your private key. You will need this "Password + Keystore file" to access your wallet.'
    />
    <mew6-warning-not-recommended class="mt-6" />
  </div>
</template>

<script>
import PasswdField from '@/web/components/PasswdField';

export default {
  components: { PasswdField },
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
