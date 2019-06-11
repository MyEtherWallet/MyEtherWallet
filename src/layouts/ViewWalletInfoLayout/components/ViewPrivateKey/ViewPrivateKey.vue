<template>
  <div>
    <b-modal
      ref="viewPriv"
      hide-footer
      centered
      no-padding
      class="bootstrap-modal"
      title="Private Key"
    >
      <div class="modal-contents">
        <qrcode :value="privKey" :options="{ size: 200 }" />
        <p class="priv-key">
          {{ privKey }}
        </p>
        <div class="copy-button" @click="copy">
          Copy
          <input ref="privKey" :value="privKey" />
        </div>
        <p class="red-warning">
          Please <b>DO NOT</b> share your private key to anyone! You may lose
          your money if you share it!
        </p>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Toast } from '@/helpers';
export default {
  computed: {
    ...mapState(['wallet']),
    privKey() {
      return this.wallet.getPrivateKeyString();
    }
  },
  methods: {
    copy() {
      this.$refs.privKey.select();
      document.execCommand('copy');
      Toast.responseHandler('Successfully copied Private Key!', Toast.SUCCESS);
    }
  }
};
</script>

<style scoped lang="scss">
@import 'ViewPrivateKey.scss';
</style>
