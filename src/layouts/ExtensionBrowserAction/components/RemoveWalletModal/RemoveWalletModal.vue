<template>
  <div>
    <b-modal
      ref="removeWalletModal"
      :title="$t('mewCx.remove-wallet')"
      hide-footer
      hide-header
      centered
      class="bootstrap-modal"
    >
      <div class="modal-contents">
        <div class="warning-text-container">
          <h2>{{ $t('mewCx.remove-wallet') }}</h2>
          <div v-show="walletType === 'wallet'" class="text-container">
            {{ $t('mewCx.remove-wallet-desc') }}
          </div>
          <h3 v-show="walletType === 'watchOnly'">
            {{ $t('mewCX.are-you-sure-delete') }} {{ `${nickname}` }}?
          </h3>
        </div>
        <div class="remove-modal-buttons">
          <div class="cancel" @click="cancelRemove">
            {{ $t('common.cancel') }}
          </div>
          <div class="remove" @click="removeWallet">
            {{ $t('mewCx.remove') }}
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { Toast, ExtensionHelpers } from '@/helpers';

export default {
  props: {
    cancelRemove: {
      type: Function,
      default: () => {}
    },
    walletType: {
      type: String,
      default: ''
    },
    nickname: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    }
  },
  methods: {
    removeWallet() {
      ExtensionHelpers.deleteWalletFromStore(this.address, this.removeCb);
    },
    removeCb() {
      this.$refs.removeWalletModal.hide();
      Toast.responseHandler(
        this.$t('mew-cx.wallet-remove-success'),
        Toast.SUCCESS
      );
    }
  }
};
</script>

<style scoped lang="scss">
@import 'RemoveWalletModal.scss';
</style>
