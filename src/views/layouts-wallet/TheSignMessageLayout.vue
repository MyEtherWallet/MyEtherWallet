

<template>
  <div>
    <app-block-title
      max-width="600px"
      no-page-title
      :data="title"
      class="mb-7"
    />
    <v-textarea outlined label="Signature" :value="message" v-model="message" ></v-textarea>
    {{message}}
    {{signature}}
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
    />

  </div>
</template>

<script>
import AppBlockTitle from '@/core/components/AppBlockTitle';
import {mapGetters} from 'vuex';

export default {
  name: 'ModuleMessageVerify',
  components: { AppBlockTitle },
  data(){
    return {
      title: {
        title: 'sign message',
        description:
          'This is a recommended way to view your balance. You can only view your balance via this option.'
      },
      message: '',
      signature: ''
    }

  },
  computed:{
    ...mapGetters('wallet', ['web3', 'address'])
  },
  methods:{
    signMessage() {
      console.log('sign'); // todo remove dev item
      const _this = this;
      try {
        this.web3.eth
          .sign(this.message, this.address)
          .then(_signedMessage => {
            console.log(_signedMessage); // todo remove dev item
            _this.signature = JSON.stringify(
              {
                address: _this.account.address,
                msg: _this.message,
                sig: _signedMessage,
                version: '3',
                signer: _this.account.isHardware
                  ? _this.account.identifier
                  : 'MEW'
              },
              null,
              2
            );
            // _this.$refs.signatureModal.$refs.signatureModal.show();
          })
          .catch(e => {
            console.log(e); // todo remove dev item
            // Toast.responseHandler(e, Toast.ERROR);
          });
      } catch (e) {
        // Toast.responseHandler(e, Toast.ERROR);
      }
    },
  }
};
</script>

<style lang="scss" scoped></style>
