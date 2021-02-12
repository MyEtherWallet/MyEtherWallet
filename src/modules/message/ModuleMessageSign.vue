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

<script>
import AppBlockTitle from '@/core/components/AppBlockTitle';
import SignAndVerifyMessage from '@/modules/message/handlers';
import { mapGetters } from 'vuex';

export default {
  name: 'ModuleMessageVerify',
  components: { AppBlockTitle },
  data() {
    return {
      title: {
        title: 'Sign Message',
        description: 'Sign '
      },
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
