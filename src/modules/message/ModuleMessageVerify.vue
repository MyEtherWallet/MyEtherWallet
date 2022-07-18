<template>
  <mew-module
    class="d-flex flex-grow-1 pt-6"
    :title="title"
    :has-elevation="true"
    :has-indicator="true"
  >
    <template #moduleBody>
      <v-textarea
        v-model="message"
        class="VerifyInput"
        outlined
        label="Signature"
        :value="message"
      ></v-textarea>

      <div v-if="signResult" class="walletBg pa-3 VerifyMessage">
        {{ signer }}
        <span v-if="didSign" class="font-weight-medium">
          did sign the message
        </span>
        <span v-if="didntSign" class="font-weight-medium">
          didn't sign the message
        </span>
      </div>

      <div v-if="verificationError" class="walletBg pa-3">
        {{ $t('signMessage.failed') }}
      </div>

      <mew-button
        :disabled="!message"
        title="Verify"
        btn-size="xlarge"
        class="display--block mx-auto mt-5 VerifyButton"
        @click.native="verifyMessage"
      />
      <mew-button
        btn-style="transparent"
        title="Clear All"
        btn-size="small"
        class="display--block mx-auto mt-5"
        @click.native="clearAll"
      />
    </template>
  </mew-module>
</template>

<script>
import SignAndVerifyMessage from '@/modules/message/handlers';
import { toChecksumAddress } from 'ethereumjs-util';

export default {
  name: 'ModuleMessageVerify',
  components: {},
  data() {
    return {
      title: 'Verify Message',
      didSign: false,
      didntSign: false,
      signResult: false,
      verificationError: false,
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
      try {
        this.verificationError = false;
        this.signResult = false;
        this.didSign = false;
        this.didntSign = false;
        const signCheck = this.signAndVerify.verifyMessage(this.message);
        const parsedMessage = JSON.parse(this.message);
        if (!parsedMessage.address) {
          this.verificationError = true;
          return;
        }
        if (
          signCheck.verified &&
          toChecksumAddress(parsedMessage.address) ===
            toChecksumAddress('0x' + signCheck.signer)
        ) {
          this.didSign = true;
        } else {
          this.didntSign = true;
        }
        this.signer = parsedMessage.address;
        this.signResult = true;
      } catch {
        this.verificationError = true;
      }
    },
    clearAll() {
      this.verificationError = false;
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
