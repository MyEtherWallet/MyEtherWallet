<template>
  <div>
    <b-modal
      ref="importPrivateKey"
      :title="$t('mewCX.private-key')"
      hide-footer
      centered
      class="bootstrap-modal"
    >
      <div class="modal-contents">
        <form>
          <div class="input-container">
            <label for="privateKeyInput">{{
              $t('mewCX.your-private-key')
            }}</label>
            <textarea
              v-model="locPrivKey"
              :placeholder="$t('mewCX.enter-private-key')"
              name="privateKeyInput"
            />
          </div>
          <div class="input-container">
            <label for="privateKeyInput">{{ $t('mewCX.password') }}</label>
            <div class="password-input">
              <input
                :type="show ? 'text' : 'password'"
                v-model="locPassword"
                :placeholder="$t('mewCX.enter-pw-hash')"
                name="privateKeyInput"
              />
              <img
                :src="show ? showIcon : hide"
                @click.prevent="switchViewPassword"
              />
            </div>
          </div>
          <div class="submit-button-container">
            <button
              :class="[
                validInputs ? '' : 'disabled',
                !loading ? '' : 'disabled',
                'large-round-button-green-filled add-wallet-button'
              ]"
              type="submit"
              @click.prevent="
                () => {
                  generateWallet(locPrivKey, 'priv');
                }
              "
            >
              <span v-show="!loading"> {{ $t('mewCX.add-wallet') }} </span>
              <i v-show="loading" class="fa fa-spinner fa-spin" />
            </button>
          </div>
        </form>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { isValidPrivate } from 'ethereumjs-util';
import hide from '@/assets/images/icons/hide-password.svg';
import showIcon from '@/assets/images/icons/show-password.svg';
import { Toast } from '@/helpers';

export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      default: ''
    },
    privKey: {
      type: String,
      default: ''
    },
    generateWallet: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      show: false,
      locPassword: this.password,
      showIcon: showIcon,
      hide: hide,
      locPrivKey: this.privKey,
      validPriv: false
    };
  },
  computed: {
    validInputs() {
      return (
        this.locPassword !== '' && this.locPrivKey !== '' && this.validPriv
      );
    }
  },
  watch: {
    password(newVal) {
      this.locPassword = newVal;
    },
    privKey(newVal) {
      this.locPrivKey = newVal;
    },
    locPrivKey(newVal) {
      try {
        this.validPriv = isValidPrivate(Buffer.from(newVal, 'hex'));
        this.$emit('privateKey', newVal);
      } catch (e) {
        Toast.responseHandler(e, Toast.ERROR);
      }
    },
    locPassword(newVal) {
      this.$emit('passwordUpdated', newVal);
    }
  },
  methods: {
    switchViewPassword() {
      this.show = !this.show;
    }
  }
};
</script>

<style scoped lang="scss">
@import 'ImportPrivateKeyModal.scss';
</style>
