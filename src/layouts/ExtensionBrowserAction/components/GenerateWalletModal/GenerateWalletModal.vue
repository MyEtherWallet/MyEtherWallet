<template>
  <div>
    <b-modal
      ref="generateNewWallet"
      hide-footer
      centered
      title="Generate a New Wallet"
    >
      <div class="modal-contents">
        <form>
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
          <b-btn
            :class="[
              validInputs ? '' : 'disabled',
              !loading ? '' : 'disabled',
              'submit-button'
            ]"
            type="submit"
            @click.prevent="generateWallet"
          >
            <span v-show="!loading"> Add Wallet </span>
            <i v-show="loading" class="fa fa-spinner fa-spin" />
          </b-btn>
        </form>
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
  },
  mounted() {
    this.$refs.generateNewWallet.$on('hidden', () => {
      this.locPassword = '';
      this.locNickname = '';
    });
  }
};
</script>

<style scoped lang="scss">
@import 'GenerateWalletModal.scss';
</style>
