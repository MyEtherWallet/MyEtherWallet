<template>
  <div>
    <b-modal
      ref="editModal"
      :title="$t('mewcx.edit-modal')"
      hide-footer
      class="bootstrap-modal"
      centered
    >
      <div class="modal-contents">
        <form>
          <div class="input-container">
            <label for="walletName"> {{ $t('mewcx.wallet-name') }} </label>
            <input
              v-model="locName"
              :placeholder="$t('mewcx.add-wallet-nickname')"
              name="walletName"
            />
          </div>
          <button
            class="submit-button large-round-button-green-filled"
            type="submit"
            @click.prevent="saveWallet"
          >
            {{ $t('mewcx.submit') }}
          </button>
        </form>
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
  methods: {
    saveWallet() {
      const wallet = Object.assign({}, this.wallet);
      ExtensionHelpers.addWalletToStore(
        this.address,
        wallet.priv,
        this.locName,
        wallet.type,
        'edit',
        this.saveWalletCb
      );
    },
    saveWalletCb() {
      this.$refs.editModal.hide();
      Toast.responseHandler(
        this.$t('mewcx.wallet-update-success'),
        Toast.SUCCESS
      );
    }
  }
};
</script>

<style scoped lang="scss">
@import 'EditWalletModal.scss';
</style>
