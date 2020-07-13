<template>
  <div>
    <form
      v-if="formData"
      id="payment_form"
      ref="payment_form"
      :action="formData.payment_post_url"
      method="POST"
      target="_blank"
    >
      <input :value="formData.version" type="hidden" name="version" />
      <input :value="formData.partner" type="hidden" name="partner" />
      <input type="hidden" name="payment_flow_type" value="wallet" />
      <input :value="formData.return_url" type="hidden" name="return_url" />
      <input :value="formData.quote_id" type="hidden" name="quote_id" />
      <input :value="formData.payment_id" type="hidden" name="payment_id" />
      <input :value="formData.user_id" type="hidden" name="user_id" />
      <input
        :value="formData.destination_wallet_address"
        type="hidden"
        name="destination_wallet[address]"
      />
      <input
        :value="formData.destination_wallet_currency"
        type="hidden"
        name="destination_wallet[currency]"
      />
      <input
        :value="formData.fiat_total_amount_amount"
        type="hidden"
        name="fiat_total_amount[amount]"
      />
      <input
        :value="formData.fiat_total_amount_currency"
        type="hidden"
        name="fiat_total_amount[currency]"
      />
      <input
        :value="formData.digital_total_amount_amount"
        type="hidden"
        name="digital_total_amount[amount]"
      />
      <input
        :value="formData.digital_total_amount_currency"
        type="hidden"
        name="digital_total_amount[currency]"
      />
    </form>
    <div v-if="!submitted" class="confirm-send-button" @click="submit()">
      <button-with-qrcode
        :qrcode="qrcode"
        :buttonname="$t('sendTx.confirmation.button')"
      />
    </div>
    <div v-if="submitted" class="submit-button-container">
      <div
        class="disabled submit-button large-round-button-green-filled clickable"
      >
        <i class="fa fa-spinner fa-spin" />
        {{ $t('swap.button-loading') }}
      </div>
    </div>
  </div>
</template>
<script>
import ButtonWithQrCode from '@/components/Buttons/ButtonWithQrCode';
import { providerNames } from '@/partners';
import { Toast } from '@/helpers';

export default {
  components: {
    'button-with-qrcode': ButtonWithQrCode
  },
  props: {
    swapDetails: {
      type: Object,
      default: function () {
        return {};
      }
    },
    swap: {
      type: Object,
      default: function () {
        return {};
      }
    },
    continueAction: {
      type: Function,
      default: function () {}
    },
    qrcode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formData: {},
      submitted: false
    };
  },
  methods: {
    async submit() {
      if (!this.submitted) {
        try {
          this.submitted = true;
          const swapDetails = await this.swap.extraActions(
            providerNames.simplex,
            'createOrder',
            this.swapDetails
          );
          this.formData = this.swapDetails.dataForInitialization;
          this.continueAction(swapDetails);
          this.$nextTick(() => {
            document.querySelector('#payment_form').submit();
            this.submitted = false;
          });
        } catch (e) {
          Toast.responseHandler(
            this.$t('swap.warning.error-generating-swap'),
            1
          );
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'CheckoutForm.scss';
</style>
