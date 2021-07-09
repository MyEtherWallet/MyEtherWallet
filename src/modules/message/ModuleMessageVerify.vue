<template>
  <div>
    <div class="mew-heading-2 mb-12">{{ title }}</div>

    <v-textarea
      v-model="message"
      outlined
      label="Signature"
      :value="message"
    ></v-textarea>

    <div v-if="signResult">
      <span v-if="didSign"> {{ signer }} Did Sign</span>
      <span v-if="didntSign">{{ signer }} Didn't sign</span>
    </div>
    <mew-button
      title="Verify"
      btn-size="xlarge"
      class="display--block mx-auto mt-5"
      @click.native="verifyMessage"
    />
    <mew-button
      btn-style="transparent"
      title="Clear All"
      btn-size="small"
      class="display--block mx-auto mt-5"
      @click.native="clearAll"
    />
  </div>
</template>

<script>
import SignAndVerifyMessage from '@/modules/message/handlers';

export default {
  name: 'ModuleMessageVerify',
  data() {
    return {
      title: 'Verify Message',
      didSign: false,
      didntSign: false,
      signResult: false,
      message: '',
      signer: ''
    };
  },
  computed: {},
  mounted() {
    this.signAndVerify = new SignAndVerifyMessage(this.web3, this.address);
  },
  methods: {
    verifyMessage() {
      this.signResult = true;
      const signCheck = this.signAndVerify.verifyMessage(this.message);
      if (signCheck.verified) {
        this.didSign = true;
      } else {
        this.didntSign = true;
      }
      this.signer = '0x' + signCheck.signer;
    },
    clearAll() {
      this.didntSign = false;
      this.didSign = false;
      this.signResult = false;
      this.message = '';
      this.signer = '';
    }
  }
};
</script>

<style lang="scss" scoped></style>
