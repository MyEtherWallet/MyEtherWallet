<template>
  <div>
    <app-block-title
      max-width="600px"
      no-page-title
      :data="title"
      class="mb-7"
    />
    <v-textarea
      v-model="message"
      outlined
      label="Signature"
      :value="message"
    ></v-textarea>
    <div v-if="signResult">
      <span v-if="didSign">Did Sign</span>
      <span v-if="didntSign">Didn't sign</span>
    </div>
    <mew-button
      title="Verify"
      btn-size="xlarge"
      class="display--block mx-auto mt-5"
      @click.native="verifyMessage"
    />
    <mew-button
      btn-style="transparent"
      title="Clean all"
      btn-size="small"
      class="display--block mx-auto mt-5"
      @click.native="clearAll"
    />
  </div>
</template>

<script>
import AppBlockTitle from '@/core/components/AppBlockTitle';
import SignAndVerifyMessage from '@/modules/message/handlers';

export default {
  name: 'ModuleMessageVerify',
  components: { AppBlockTitle },
  data() {
    return {
      title: {
        title: 'Verify Message',
        description: 'Verify the address signed the message'
      },
      didSign: false,
      didntSign: false,
      signResult: false,
      message: ''
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
      if (signCheck) {
        this.didSign = true;
      } else {
        this.didntSign = true;
      }
    },
    clearAll() {
      this.didntSign = false;
      this.didSign = false;
      this.signResult = false;
    }
  }
};
</script>

<style lang="scss" scoped></style>
