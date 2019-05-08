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
            v-model="locNickname"
            placeholder="Please add a wallet nickname"
            name="walletName"
          />
        </div>
        <div class="input-container">
          <label for="walletPassword"> Password </label>
          <div class="password-input">
            <input
              v-model="locPassword"
              :type="show ? 'text' : 'password'"
              placeholder="Create your password here"
              name="walletPassword"
            />
            <img :src="show ? showIcon : hide" @click.prevent="show = !show" />
          </div>
        </div>
        <div
          :class="[
            validInputs ? '' : 'disabled',
            'submit-button large-round-button-green-filled'
          ]"
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
import hide from '@/assets/images/icons/hide-password.svg';
import showIcon from '@/assets/images/icons/show-password.svg';
export default {
  props: {
    generateWallet: {
      type: Function,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      default: ''
    },
    nickname: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showIcon: showIcon,
      hide: hide,
      show: false,
      locPassword: this.password,
      locNickname: this.nickname
    };
  },
  computed: {
    validInputs() {
      return this.locPassword !== '' && this.locNickname !== '';
    }
  },
  watch: {
    locPassword(newVal) {
      this.$emit('password', newVal);
    },
    locNickname(newVal) {
      this.$emit('nickname', newVal);
    }
  }
};
</script>

<style scoped lang="scss">
@import 'GenerateWalletModal.scss';
</style>
