<template>
  <div>
    <b-modal
      ref="watchOnlyWallet"
      hide-footer
      centered
      class="bootstrap-modal"
      title="Add Watch Only Wallet"
    >
      <div class="modal-contents">
        <form>
          <div class="input-container">
            <label for="walletName"> Wallet Name </label>
            <input
              v-model="name"
              placeholder="Please add a wallet nickname"
              name="walletName"
            />
          </div>
          <div class="input-container">
            <label for="walletAddr"> Address </label>
            <input
              v-model="address"
              placeholder="Please enter the wallet address"
              name="walletAddr"
            />
          </div>
          <button
            :class="[
              validInputs ? '' : 'disabled',
              'submit-button large-round-button-green-filled'
            ]"
            type="submit"
            @click.prevent="addWatchOnly(name, address)"
          >
            <span v-show="!loading"> Add Wallet </span>
            <i v-show="loading" class="fa fa-spinner fa-spin" />
          </button>
        </form>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { isAddress } from '@/helpers/addressUtils';

export default {
  props: {
    addWatchOnly: {
      type: Function,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      name: '',
      address: ''
    };
  },
  computed: {
    validInputs() {
      return isAddress(this.address) && this.name !== '';
    }
  },
  mounted() {
    this.$refs.watchOnlyWallet.$on('hidden', () => {
      this.name = '';
      this.address = '';
    });
  }
};
</script>

<style scoped lang="scss">
@import 'WatchOnlyModal.scss';
</style>
