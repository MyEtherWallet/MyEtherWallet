<template>
  <mew-module
    class="d-flex flex-grow-1 pt-6"
    :title="title"
    :has-elevation="true"
    :has-indicator="true"
  >
    <template #moduleBody>
      <div>
        <v-textarea
          v-model="message"
          outlined
          label="Signature"
          :value="message"
        ></v-textarea>
        {{ message }}
        {{ signature }}
        <mew-button
          title="Sign"
          btn-size="xlarge"
          class="display--block mx-auto mt-5"
          @click.native="signMessage"
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
  </mew-module>
</template>

<script>
import SignAndVerifyMessage from '@/modules/message/handlers';
import { mapGetters } from 'vuex';

export default {
  name: 'ModuleMessageVerify',
  data() {
    return {
      title: 'Sign Message',
      message: '',
      signature: '',
      signAndVerify: ''
    };
  },
  computed: {
    ...mapGetters('wallet', ['web3', 'address'])
  },
  mounted() {
    this.signAndVerify = new SignAndVerifyMessage(this.web3, this.address);
  },
  methods: {
    signMessage() {
      try {
        this.signAndVerify.signMessage(this.message);
      } catch (e) {
        // Toast.responseHandler(e, Toast.ERROR);
      }
    },
    clearAll() {
      this.signature = '';
      this.message = '';
    }
  }
};
</script>

<style lang="scss" scoped></style>
