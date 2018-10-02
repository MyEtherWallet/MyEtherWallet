<template>
  <b-modal
    ref="password"
    :title="$t('accessWallet.password')"
    hide-footer
    class="bootstrap-modal modal-software"
    centered>
    <form class="password-form">
      <div class="input-container">
        <input
          :type="show ? 'text': 'password'"
          v-model="password"
          name="Password"
          autocomplete="off" >
        <img
          v-if="show"
          src="@/assets/images/icons/show-password.svg"
          @click.prevent="switchViewPassword">
        <img
          v-if="!show"
          src="@/assets/images/icons/hide-password.svg"
          @click.prevent="switchViewPassword">
      </div>
      <p
        v-show="error !== ''"
        class="error"> {{ error }} </p>
      <button
        :disabled=" password === '' && password.length === 0 && password.length < 9"
        class="submit-button large-round-button-green-filled"
        type="submit"
        @click.prevent="unlockWallet">
        {{ $t("accessWallet.unlock") }}
      </button>
    </form>
  </b-modal>
</template>

<script>
import { BasicWallet } from '@/wallets';
import { UnlockJsonWallet } from '@/helpers';
export default {
  props: {
    file: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      show: false,
      password: '',
      error: ''
    };
  },
  watch: {
    password() {
      this.error = '';
    }
  },
  methods: {
    unlockWallet() {
      UnlockJsonWallet(this.password, this.file)
        .then(privKey => {
          this.$store.dispatch(
            'decryptWallet',
            BasicWallet.unlock({
              type: 'manualPrivateKey',
              manualPrivateKey: '0x' + privKey.toString('hex')
            })
          );
          this.$router.push({ path: 'interface' });
        })
        .catch(error => {
          this.error = error.message;
        });
    },
    switchViewPassword() {
      this.show = !this.show;
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'PasswordModal.scss';
</style>
