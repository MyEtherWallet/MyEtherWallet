<template lang="html">
  <div>
    <div class="stripe-container">
      <div class="domain-header">
        <div class="items-container">
          <h4
            v-for="cartItem of cart"
            :key="cartItem.label + '.' + cartItem.extension"
          >
            {{ cartItem.label + '.' + cartItem.extension }} - ${{
              cartItem.price
            }}
          </h4>
        </div>
        <h4 class="domain-price">
          <span class="eth-text"
            >{{ convertedEthPrice }} {{ $t('common.currency.eth') }}</span
          >
          <span class="price-text">(${{ cartTotal }})</span>
        </h4>
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
            <span class="form-title">{{
              $t('unstoppable.stripe-card-prompt')
            }}</span>
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
              {{ $t('unstoppable.secured-by-stripe') }}
            </h6>
          </div>
          <div v-show="paymentError">
            <h5 class="error-message">
              {{ $t('unstoppable.error.stripe-payment') }}
            </h5>
          </div>
          <div class="stripe-form-field-container btn-container">
            <button class="back-btn" @click="goBack()">
              <span>
                {{ $t('common.back') }}
              </span>
            </button>
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
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';
import { Toast } from '@/helpers';

export default {
  components: { Card },
  props: {
    cart: {
      type: Array,
      default: () => {
        return [];
      }
    },
    setTokenId: { type: Function, default: function () {} }
  },
  data() {
    return {
      complete: false,
      stripeOptions: {},
      stripeImg,
      publishableKey: 'pk_live_HAPE6Nv5bfhCJYKe6Nfaaj4P',
      token: null,
      charge: null,
      loading: false,
      paymentError: false,
      ethPrice: 0
    };
  },
  computed: {
    ...mapState('main', ['online']),
    cartTotal() {
      return this.cart.reduce((a, b) => {
        return a + b.price;
      }, 0);
    },
    convertedEthPrice() {
      let ethConvertPrice = 0;
      if (this.cartTotal > 0) {
        ethConvertPrice = new BigNumber(this.cartTotal)
          .dividedBy(this.ethPrice)
          .toFixed(8);
      }
      return ethConvertPrice;
    }
  },
  mounted() {
    if (this.online) this.getEthPrice();
  },
  beforeMount() {
    if (!this.cart.length || !this.cartTotal) {
      this.$router.push({ name: 'unstoppableInitialState' });
    }
  },
  methods: {
    async getEthPrice() {
      const price = await fetch(
        'https://cryptorates.mewapi.io/ticker?filter=ETH'
      )
        .then(res => {
          return res.json();
        })
        .catch(e => {
          Toast.responseHandler(e, Toast.ERROR);
        });
      this.ethPrice =
        typeof price === 'object' ? price.data.ETH.quotes.USD.price : 0;
    },
    goBack() {
      this.$router.push({ name: 'unstoppableInitialState' });
    },
    handlePayWithCryptoClick() {
      this.$router.push({ name: 'payWithCrypto' });
    },
    submit() {
      this.loading = true;
      createToken()
        .then(data => {
          this.setTokenId(data.token.id);
          this.$router.push({ name: 'confirmPayment' });
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
