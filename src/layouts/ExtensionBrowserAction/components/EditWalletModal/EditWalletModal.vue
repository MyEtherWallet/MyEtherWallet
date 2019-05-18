<template>
  <div>
    <b-modal
      ref="editModal"
      hide-footer
      class="bootstrap-modal"
      title="Edit Modal"
    >
      <div class="modal-contents">
        <div class="input-container">
          <label for="walletName"> Wallet Name </label>
          <input
            v-model="locName"
            placeholder="Please add a wallet nickname"
            name="walletName"
          />
        </div>
        <div
          class="submit-button large-round-button-green-filled"
          @click="saveWallet"
        >
          Submit
        </div>
        <div
          class="remove-button large-round-button-white-filled"
          @click="removeWallet"
        >
          Remove Wallet
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { Toast, ExtensionHelpers } from '@/helpers';
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    removeWallet: {
      type: Function,
      default: () => {}
    },
    address: {
      type: String,
      default: ''
    },
    wallet: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      locName: this.name
    };
  },
  mounted() {
    this.$refs.watchOnlyWallet.$on('hidden', () => {
      this.locName = '';
    });
  },
  methods: {
    saveWallet() {
      const wallet = Object.assign({}, this.wallet);
      ExtensionHelpers.addWalletToStore(
        this.address,
        wallet.priv,
        this.locName,
        wallet.type,
        this.saveWalletCb
      );
    },
    saveWalletCb() {
      this.$refs.editModal.hide();
      Toast.responseHandler('Wallet successfully updated!', Toast.SUCCESS);
    }
  }
};
</script>

<style scoped lang="scss">
@import 'EditWalletModal.scss';
</style>
