<template>
  <div>
    <b-modal
      ref="importPrivateKey"
      title="Private Key"
      hide-footer
      centered
      class="bootstrap-modal"
    >
      <div class="modal-contents">
        <div class="not-recommended">
          {{ $t('accessWallet.notARecommendedWay') }}
        </div>
        <form>
          <div class="input-container">
            <label for="privateKeyInput">Your Private Key</label>
            <textarea
              v-model="locPrivKey"
              name="privateKeyInput"
              placeholder="Enter private key"
            />
          </div>
          <div class="input-container">
            <label for="privateKeyInput">Password</label>
            <div class="password-input">
              <input
                :type="show ? 'text' : 'password'"
                v-model="locPassword"
                name="privateKeyInput"
                placeholder="Enter password for hashing"
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
                'large-round-button-green-filled add-wallet-button'
              ]"
              type="submit"
              @click.prevent="
                () => {
                  generateWallet(locPrivKey);
                }
              "
            >
              <span v-show="!loading"> Add Wallet </span>
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
    locPrivKey(newVal) {
      this.validPriv = isValidPrivate(Buffer.from(newVal, 'hex'));
      this.$emit('privateKey', newVal);
    },
    locPassword(newVal) {
      this.$emit('password', newVal);
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
