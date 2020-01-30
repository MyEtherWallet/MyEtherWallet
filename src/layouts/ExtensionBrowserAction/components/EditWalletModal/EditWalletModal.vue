<template>
  <mewcx-modal-wrapper ref="editWalletModal">
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
  </mewcx-modal-wrapper>
</template>

<script>
import MewcxModalWrapper from '../../wrappers/MewcxModalWrapper';
import { Toast, ExtensionHelpers } from '@/helpers';
export default {
  components: {
    'mewcx-modal-wrapper': MewcxModalWrapper
  },
  props: {
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
      locName: ''
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
      Toast.responseHandler(
        this.$t('mewcx.wallet-update-success'),
        Toast.SUCCESS
      );
      this.$refs.editModal.$refs.modalWrapper.hide();
    }
  }
};
</script>

<style scoped lang="scss">
@import 'EditWalletModal.scss';
</style>
