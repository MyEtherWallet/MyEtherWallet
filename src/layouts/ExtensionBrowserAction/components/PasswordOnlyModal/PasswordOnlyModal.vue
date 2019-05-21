<template>
  <div>
    <b-modal
      ref="passwordOnlyModal"
      hide-footer
      centered
      class="bootstrap-modal"
      title="Wallet Password"
    >
      <div class="modal-contents">
        <p>Your wallet is encrypted. Please enter the password</p>
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
            disabled ? '' : 'disabled',
            'submit-button large-round-button-green-filled'
          ]"
          @click="submit"
        >
          <span v-show="!loading"> {{ title }} </span>
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
    submit: {
      type: Function,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    path: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showIcon: showIcon,
      hide: hide,
      show: false,
      locPassword: this.password
    };
  },
  computed: {
    title() {
      if (this.path === 'access') {
        return 'Access Wallet';
      }

      return 'View Wallet Info';
    }
  },
  watch: {
    locPassword(newVal) {
      this.$emit('password', newVal);
    }
  }
};
</script>

<style scoped lang="scss">
@import 'PasswordOnlyModal.scss';
</style>
