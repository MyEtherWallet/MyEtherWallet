<template>
  <div>
    <b-modal
      ref="importPrivateKey"
      :title="$t('mewcx.private-key')"
      hide-footer
      centered
      class="bootstrap-modal"
    >
      <div class="modal-contents">
        <form>
          <div class="input-container">
            <label for="privateKeyInput">{{
              $t('mewcx.your-private-key')
            }}</label>
            <textarea
              v-model="locPrivKey"
              :placeholder="$t('mewcx.enter-private-key')"
              name="privateKeyInput"
            />
          </div>
          <div class="input-container">
            <label for="privateKeyInput">{{ $t('mewcx.password') }}</label>
            <div class="password-input">
              <input
                v-model="locPassword"
                :type="show ? 'text' : 'password'"
                :placeholder="$t('mewcx.enter-pw-hash')"
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
              <span v-show="!loading"> {{ $t('mewcx.add-wallet') }} </span>
              <i v-show="loading" class="fa fa-spinner fa-spin" />
            </button>
          </div>
        </form>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { isHexString } from 'ethereumjs-util';
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
      locPrivKey: this.privKey
    };
  },
  computed: {
    validInputs() {
      return (
        this.locPassword !== '' && this.locPrivKey !== '' && this.validPriv
      );
    },
    validPriv() {
      const _priv = this.locPrivKey.replace('0x', '');
      return isHexString('0x' + _priv, 32);
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
