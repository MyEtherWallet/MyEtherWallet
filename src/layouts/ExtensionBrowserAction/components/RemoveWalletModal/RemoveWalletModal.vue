<template>
  <div>
    <b-modal
      ref="removeWalletModal"
      hide-footer
      hide-header
      centered
      class="bootstrap-modal"
      title="Remove Wallet Wallet"
    >
      <div class="modal-contents">
        <div class="warning-text-container">
          <div v-show="walletType === 'wallet'">
            Be sure you have saved the private key and/or Keystore File and the
            password before you remove it. If you want to use this wallet with
            your MyEtherWallet CX in the future, you will need to manually
            re-add it using the private key/JSON and password..
          </div>
          <h3 v-show="walletType === 'watchOnly'">
            Are you sure you want to delete wallet {{ `${nickname}` }}?
          </h3>
        </div>
        <div class="remove-modal-buttons">
          <div class="cancel" @click="cancelRemove">
            Cancel
          </div>
          <div class="remove" @click="removeWallet">
            Remove
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
      Toast.responseHandler('Wallet successfully removed!', Toast.SUCCESS);
    }
  }
};
</script>

<style scoped lang="scss">
@import 'RemoveWalletModal.scss';
</style>
