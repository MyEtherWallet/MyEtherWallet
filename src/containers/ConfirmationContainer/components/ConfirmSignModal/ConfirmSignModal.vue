<template>
  <div class="modal-container">
    <b-modal
      ref="signConfirmation"
      hide-footer
      centered
      class="bootstrap-modal-wide confirmation-modal nopadding"
      title="Confirmation"
    >
      <div class="modal-content qrcode-modal">
        <div class="tx-info">
          <div class="tx-data tx-from">
            <div class="address-info">
              <p class="title address-title">
                {{ $t('confirmation.signingAddr') }}
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
          <div class="tx-data tx-to">
            <div class="address-info">
              <p class="title address-title">
                {{ $t('interface.txSideMenuMessage') }}
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
                {{ $t('confirmation.confirmSigning') }}
              </div>
            </div>
          </div>
          <p class="learn-more">
            Have any issues?
            <a
              href="https:/kb.myetherwallet.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
            </a>
          </p>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Blockie from '@/components/Blockie';
import { mapGetters } from 'vuex';

export default {
  components: {
    blockie: Blockie
  },
  props: {
    confirmSignMessage: {
      type: Function,
      default: function() {}
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
    ...mapGetters({
      account: 'account'
    }),
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ConfirmModal';
</style>
