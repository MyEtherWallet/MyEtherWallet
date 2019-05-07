<template>
  <div>
    <b-modal
      ref="generateNewWallet"
      hide-footer
      centered
      class="bootstrap-modal"
      title="Generate a New Wallet"
    >
      <div class="modal-contents">
        <div class="input-container">
          <label for="walletName"> Wallet Name </label>
          <input
            placeholder="Please add a wallet nickname"
            name="walletName"
            @change="nickname"
          />
        </div>
        <div class="input-container">
          <label for="walletPassword"> Password </label>
          <input
            placeholder="Create your password here"
            name="walletPassword"
            @change="password"
          />
        </div>
        <div
          class="submit-button large-round-button-green-filled"
          @click="generateWallet"
        >
          <span v-show="!loading"> Add Wallet </span>
          <i v-show="loading" class="fa fa-spinner fa-spin" />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    generateWallet: {
      type: Function,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    nickname(e) {
      this.$emit('nickname', e.target.value);
    },
    password(e) {
      this.$emit('password', e.target.value);
    }
  }
};
</script>

<style scoped lang="scss">
@import 'GenerateWalletModal.scss';
</style>
