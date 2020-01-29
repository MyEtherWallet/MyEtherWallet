<template>
  <div>
    <mewcx-modal-wrapper ref="passwordOnlyModal" direction="up">
      <div class="password-modal-container">
        <div class="password-modal-title">
          <h2>{{ title }}</h2>
          <p>Please enter the password of your wallet to {{ title }}</p>
        </div>
        <form>
          <div class="input-container">
            <label for="walletPassword"> Wallet Password </label>
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
          <button
            :class="[
              validInput ? '' : 'disabled',
              'submit-button large-round-button-green-filled'
            ]"
            type="submite"
            @click.prevent="submit"
          >
            <span v-show="!loading"> {{ button }} </span>
            <i v-show="loading" class="fa fa-spinner fa-spin" />
          </button>
        </form>
      </div>
    </mewcx-modal-wrapper>
  </div>
</template>

<script>
import hide from '@/assets/images/icons/hide-password.svg';
import showIcon from '@/assets/images/icons/show-password.svg';
import MewcxModalWrapper from '../../wrappers/MewcxModalWrapper';
export default {
  components: {
    'mewcx-modal-wrapper': MewcxModalWrapper
  },
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
    validInput: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showIcon: showIcon,
      hide: hide,
      show: false,
      locPassword: ''
    };
  },
  computed: {
    title() {
      if (this.path === 'access') {
        return 'Access Wallet';
      }

      return 'View Wallet Info';
    },
    button() {
      if (this.path === 'access') {
        return 'Access';
      }

      return 'View';
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
