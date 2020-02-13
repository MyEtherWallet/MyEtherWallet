<template>
  <div>
    <mewcx-modal-wrapper ref="removeWalletModal" direction="up">
      <template v-slot:modalContentTitle>
        {{ $t('mewcx.remove-wallet') }}
      </template>
      <div class="warning-text-container">
        <div v-show="walletType === 'wallet'">
          <div class="input-container">
            <label for="walletPassword">
              {{ $t('mewcx.wallet-password') }}
            </label>
            <div class="password-input">
              <input
                v-model="locPassword"
                :type="show ? 'text' : 'password'"
                :placeholder="$t('mewcx.wallet-password')"
                name="walletPassword"
              />
              <img
                :src="show ? showIcon : hide"
                @click.prevent="show = !show"
              />
            </div>
          </div>
        </div>
        <h3 v-show="walletType === 'watchOnly'">
          {{ $t('mewcx.are-you-sure-delete') }} <b>{{ nickname }}</b>
        </h3>
        <div class="remove-modal-buttons">
          <div
            :class="[locPassword !== '' ? '' : 'disabled', 'remove']"
            @click="removeWallet"
          >
            {{ $t('mewcx.confirm-remove') }}
          </div>
          <div class="remove-wallet-warning">
            <div class="warning-image">
              <img src="@/assets/images/icons/exclamation.svg" />
            </div>
            <i18n
              path="mewcx.remove-wallet-verification"
              tag="div"
              class="warning-text"
            >
              <span slot="privKey"> {{ $t('mewcx.private-key') }}</span>
              <span slot="mnemPhrase"> {{ $t('mewcx.mnemonic-phraase') }}</span>
              <span slot="keystoreFile">
                {{ $t('mewcx.keystore-file-text') }}</span
              >
              <span slot="password"> {{ $t('mewcx.password') }}</span>
            </i18n>
          </div>
        </div>
      </div>
    </mewcx-modal-wrapper>
  </div>
</template>

<script>
import MewcxModalWrapper from '../../wrappers/MewcxModalWrapper';
import hide from '@/assets/images/icons/hide-password.svg';
import showIcon from '@/assets/images/icons/show-password.svg';
export default {
  components: {
    'mewcx-modal-wrapper': MewcxModalWrapper
  },
  props: {
    walletType: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    removeWallet: {
      type: Function,
      default: () => {}
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
      locPassword: ''
    };
  },
  watch: {
    locPassword(newVal) {
      this.$emit('password', newVal);
    }
  }
};
</script>

<style scoped lang="scss">
@import 'RemoveWalletModal.scss';
</style>
