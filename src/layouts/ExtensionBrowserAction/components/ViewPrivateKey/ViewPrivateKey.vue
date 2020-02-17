<template>
  <div>
    <b-modal
      ref="viewPriv"
      :title="$t('accessWallet.private-key.string')"
      hide-footer
      centered
      no-padding
      class="bootstrap-modal"
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
        <i18n
          path="accessWallet.private-key.do-not-share"
          tag="p"
          class="red-warning"
        >
          <b slot="do-not">{{ $t('common.do-not') }}</b>
        </i18n>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Toast } from '@/helpers';
export default {
  computed: {
    ...mapState('main', ['wallet']),
    privKey() {
      return this.wallet.getPrivateKeyString();
    }
  },
  methods: {
    copy() {
      this.$refs.privKey.select();
      document.execCommand('copy');
      Toast.responseHandler(
        this.$t('interface.addr.copied-private-key'),
        Toast.SUCCESS
      );
    }
  }
};
</script>

<style scoped lang="scss">
@import 'ViewPrivateKey.scss';
</style>
