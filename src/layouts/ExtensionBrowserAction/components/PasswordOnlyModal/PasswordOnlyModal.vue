<template>
  <div>
    <mewcx-modal-wrapper
      ref="passwordOnlyModal"
      :title="$t('mewcx.wallet-password')"
      direction="up"
    >
      <div class="modal-contents">
        <p>{{ $t('mewcx.wallet-encrypted') }}</p>
        <form>
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
          <button
            :class="[
              disabled ? '' : 'disabled',
              'submit-button large-round-button-green-filled'
            ]"
            type="submite"
            @click.prevent="submit"
          >
            <span v-show="!loading"> {{ title }} </span>
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
