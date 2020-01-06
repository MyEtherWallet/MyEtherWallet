<template>
  <div>
    <b-modal
      ref="generateNewWallet"
      :title="$t('mewcx.generate-wallet')"
      hide-footer
      centered
    >
      <div class="modal-contents">
        <form>
          <div class="input-container">
            <label for="walletName"> {{ $t('mewcx.wallet-name') }} </label>
            <input
              v-model="locNickname"
              :placeholder="$t('mewcx.add-wallet-nickname')"
              name="walletName"
            />
          </div>
          <div class="input-container">
            <label for="walletPassword"> {{ $t('mewcx.password') }} </label>
            <div class="password-input">
              <input
                v-model="locPassword"
                :type="show ? 'text' : 'password'"
                :placeholder="$t('mewcx.create-pw')"
                name="walletPassword"
              />
              <img
                :src="show ? showIcon : hide"
                @click.prevent="show = !show"
              />
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
            <span v-show="!loading"> {{ $t('mewcx.add-wallet') }} </span>
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
    password(newVal) {
      this.locPassword = newVal;
    },
    nickname(newVal) {
      this.locNickname = newVal;
    },
    locPassword(newVal) {
      this.$emit('passwordUpdated', newVal);
    },
    locNickname(newVal) {
      this.$emit('nicknameUpdated', newVal);
    }
  }
};
</script>

<style scoped lang="scss">
@import 'GenerateWalletModal.scss';
</style>
