<template lang="html">
  <div>
    <div class="payment-method-container">
      <div class="domain-header">
        <h4>{{ domainName }}</h4>
        <h4 class="domain-price">
          <span class="eth-text"
            >{{ convertedEthPrice }} {{ $t('common.currency.eth') }}</span
          >
          <span class="price-text">(${{ domainPrice }})</span>
        </h4>
      </div>
      <div class="select-method-container">
        <h3>Choose payment method</h3>
        <div class="payment-method-button-container">
          <div class="payment-method-button" @click="selectCreditCard()">
            <img :src="cardImg" class="card-logo" alt />
            <div class="title-container">
              <h4>Credit Card</h4>
            </div>
          </div>
          <div class="payment-method-button" @click="selectCrypto()">
            <img :src="cryptoImg" class="crypto-logo" alt />
            <div class="title-container">
              <h4>Crypto</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cardImg from '@/assets/images/icons/card.svg';
import cryptoImg from '@/assets/images/icons/crypto.svg';
import { mapState } from 'vuex';
import { Toast } from '@/helpers';
import BigNumber from 'bignumber.js';

export default {
  props: {
    domainName: {
      type: String,
      default: ''
    },
    domainPrice: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      cardImg,
      cryptoImg,
      ethPrice: 0
    };
  },
  computed: {
    ...mapState('main', ['online']),
    convertedEthPrice() {
      let ethConvertPrice = 0;
      if (this.domainPrice > 0) {
        ethConvertPrice = new BigNumber(this.domainPrice)
          .dividedBy(this.ethPrice)
          .toFixed(8);
      }
      return ethConvertPrice;
    }
  },
  beforeMount() {
    if (this.domainName === '' || !this.domainPrice) {
      this.$router.push('/interface/dapps/unstoppable');
    }
  },
  mounted() {
    if (this.online) this.getEthPrice();
  },
  methods: {
    selectCreditCard() {
      this.$router.push({ path: 'payment-method/stripe' });
    },
    selectCrypto() {
      this.$router.push({ path: 'payment-method/crypto' });
    },
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'PaymentMethodContainer.scss';
</style>
