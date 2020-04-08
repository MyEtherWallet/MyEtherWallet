<template lang="html">
  <div>
    <div class="stripe-container">
      <div class="domain-header">
        <h4>{{ domainName }}</h4>
        <h4 class="domain-price">${{ domainPrice }}</h4>
      </div>
      <div class="stripe-form-container">
        <div class="stripe-form-header">
          <h3>{{ $t('unstoppable.pay-with-credit-card') }}</h3>
          <h5 class="pay-with-crypto" @click="handlePayWithCryptoClick">
            {{ $t('unstoppable.pay-with-crypto') }}
          </h5>
        </div>
        <div class="stripe-form-body">
          <div class="stripe-form-field-container">
            <h6>{{ $t('unstoppable.stripe-card-prompt') }}</h6>
            <div class="stripe-card-input">
              <card
                :class="{ complete }"
                :stripe="publishableKey"
                :options="stripeOptions"
                @change="complete = $event.complete"
              />
            </div>
          </div>
          <div class="stripe-form-field-container">
            <h6 class="secured-by-stripe">
              {{ $t('unstoppable.secured-by-stripe') }} Stripe
            </h6>
          </div>
          <div v-show="paymentError">
            <h5 class="error-message">
              {{ $t('unstoppable.error.stripe-payment') }}
            </h5>
          </div>
          <div class="stripe-form-field-container">
            <button
              :class="[
                !complete ? 'disabled' : '',
                'large-round-button-green-filled clickable pay-button'
              ]"
              :disabled="!complete || loading"
              @click="submit"
            >
              <span v-show="!loading">
                {{ $t('unstoppable.continue') }}
              </span>
              <i v-show="loading" class="fa fa-spinner fa-spin" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import stripeImg from '@/assets/images/icons/domain.svg';
import { Card, createToken } from 'vue-stripe-elements-plus';

export default {
  components: { Card },
  props: {
    domainName: {
      type: String,
      default: ''
    },
    domainPrice: {
      type: Number,
      default: 0
    },
    setTokenId: { type: Function, default: function () {} }
  },
  data() {
    return {
      complete: false,
      stripeOptions: {},
      stripeImg,
      publishableKey:
        'pk_test_bERlHfGH5lT9rTIhKPg74H0o' ||
        'pk_live_HAPE6Nv5bfhCJYKe6Nfaaj4P',
      token: null,
      charge: null,
      loading: false,
      paymentError: false
    };
  },
  beforeMount() {
    if (this.domainName === '' || !this.domainPrice) {
      this.$router.push('/interface/dapps/unstoppable');
    }
  },
  methods: {
    handlePayWithCryptoClick() {
      this.$router.push(
        '/interface/dapps/unstoppable/buy/payment-method/crypto'
      );
    },
    submit() {
      this.loading = true;
      createToken()
        .then(data => {
          this.setTokenId(data.token.id);
          this.$router.push('/interface/dapps/unstoppable/buy/confirm');
        })
        .catch(() => {
          this.paymentError = true;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'StripeContainer.scss';
</style>
