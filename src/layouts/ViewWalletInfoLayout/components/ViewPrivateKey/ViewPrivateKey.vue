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
          {{ $t('common.copy') }}
          <input ref="privKey" :value="privKey" />
        </div>
        <p class="red-warning">
          {{ $t('common.please') }} <b>{{ $t('common.do-not') }}</b>
          {{ $t('accessWallet.private-key.do-not-share') }}!
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
      Toast.responseHandler(this.$t('interface.addr.copied-private-key'), Toast.SUCCESS);
    }
  }
};
</script>

<style scoped lang="scss">
@import 'ViewPrivateKey.scss';
</style>
