<template lang="html">
  <div>
    <div class="payment-method-container">
      <div class="domain-header">
        <h4>{{ domainName }}</h4>
        <h4 class="domain-price">${{ domainPrice }}</h4>
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
      cryptoImg
    };
  },
  beforeMount() {
    if (this.domainName === '' || !this.domainPrice) {
      this.$router.replace('/interface/dapps/unstoppable');
    }
  },
  methods: {
    selectCreditCard() {
      this.$router.push({ path: 'payment-method/stripe' });
    },
    selectCrypto() {
      this.$router.push({ path: 'payment-method/crypto' });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'PaymentMethodContainer.scss';
</style>
