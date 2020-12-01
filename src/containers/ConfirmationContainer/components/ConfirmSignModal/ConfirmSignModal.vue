<template>
  <div class="modal-container">
    <b-modal
      ref="signConfirmation"
      :title="$t('common.confirmation')"
      hide-footer
      centered
      class="bootstrap-modal-wide confirmation-modal nopadding"
      static
      lazy
    >
      <div class="modal-content qrcode-modal">
        <div class="tx-info">
          <div class="tx-data tx-from">
            <div class="address-info">
              <p class="title address-title">
                {{ $t('confirmation.signing-addr') }}
              </p>
              <div class="from-address">
                <blockie
                  :address="account.address"
                  width="30px"
                  height="30px"
                />
                <span>{{ from }}</span>
              </div>
            </div>
          </div>
          <div v-if="hexToUtf8(messageToSign)" class="tx-data tx-to">
            <div class="address-info">
              <p class="title address-title">
                {{ $t('signMessage.message') }}
              </p>
              <p class="message-to-sign">{{ hexToUtf8(messageToSign) }}</p>
            </div>
          </div>
          <div class="tx-data tx-to">
            <div class="address-info">
              <p class="title address-title">
                {{ $t('confirmation.message-in-hex') }}
              </p>
              <p class="message-to-sign">{{ messageToSign }}</p>
            </div>
          </div>
        </div>
        <div class="submit-button-container">
          <div class="flex-center-align">
            <div class="button-with-helper">
              <div
                ref="ConfirmAndSendButton"
                :class="[
                  signedMessage !== '' ? '' : 'disabled',
                  'submit-button large-round-button-green-filled clickable'
                ]"
                @click="signMessage"
              >
                {{ $t('confirmation.confirm-signing') }}
              </div>
            </div>
          </div>
          <p class="learn-more">
            {{ $t('common.have-issues') }}
            <a
              href="https://kb.myetherwallet.com"
              target="_blank"
              rel="noopener noreferrer"
              >{{ $t('common.learn-more') }}</a
            >
          </p>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Blockie from '@/components/Blockie';
import utils from 'web3-utils';
import { mapState } from 'vuex';

export default {
  components: {
    blockie: Blockie
  },
  props: {
    confirmSignMessage: {
      type: Function,
      default: function () {}
    },
    signedMessage: {
      type: String,
      default: ''
    },
    messageToSign: {
      type: String,
      default: ''
    },
    from: {
      type: String,
      default: ''
    },
    isHardwareWallet: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modalDetailInformation: false,
      transactionSigned: false
    };
  },
  computed: {
    ...mapState('main', ['account']),
    signedMessageSignature() {
      if (this.signedMessage) {
        return this.signedMessage;
      } else if (this.isHardwareWallet) {
        return 'Please Approve on Hardware Wallet';
      }
      return '';
    }
  },
  methods: {
    signMessage() {
      if (this.signedMessage !== '') {
        this.confirmSignMessage();
      }
    },
    hexToUtf8(hex) {
      try {
        return utils.hexToUtf8(hex);
      } catch (e) {
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ConfirmModal';
</style>
