<template>
  <div>
    <form
      v-if="formData"
      id="payment_form"
      ref="payment_form"
      :action="formData.payment_post_url"
      method="POST"
      target="_self"
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
    <div class="confirm-send-button" @click="submit()">
      <button-with-qrcode :qrcode="qrcode" buttonname="Confirm and Send" />
    </div>
  </div>
</template>
<script>
import ButtonWithQrCode from '@/components/Buttons/ButtonWithQrCode';

export default {
  components: {
    'button-with-qrcode': ButtonWithQrCode
  },
  props: {
    formData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    continueAction: {
      type: Function,
      default: function() {}
    },
    qrcode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  methods: {
    submit() {
      this.continueAction();
      document.querySelector('#payment_form').submit();
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'CheckoutForm.scss';
</style>
