<template lang="html">
  <div>
    <div class="crypto-container">
      <div class="domain-header">
        <h4>{{ domainName }}</h4>
        <h4 class="domain-price">${{ domainPrice }}</h4>
      </div>
      <div class="crypto-form-container">
        <div class="crypto-form-header">
          <h3>Pay with Crypto</h3>
          <h5 class="pay-with-crypto">Pay with credit card</h5>
        </div>
        <div class="email-form-body">
          <div class="email-form-field-container">
            <h6>{{ $t('unstoppable.crypto-email-prompt') }}</h6>
            <input
              v-model="email"
              :placeholder="$t('unstoppable.ph.crypto-email-placeholder')"
              type="text"
            />
          </div>
          <button
            :class="[
              invalidEmail ? 'disabled' : '',
              'large-round-button-green-filled clickable pay-button'
            ]"
            :disabled="loading || invalidEmail"
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
</template>

<script>
import cryptoImg from '@/assets/images/icons/domain.svg';

// eslint-disable-next-line security/detect-unsafe-regex, no-useless-escape
const validEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default {
  props: {
    domainName: {
      type: String,
      default: ''
    },
    domainPrice: {
      type: Number,
      default: 0
    },
    account: {
      type: Object,
      default: function() {}
    }
  },
  data() {
    return {
      complete: false,
      invalidEmail: true,
      cryptoOptions: {},
      cryptoImg,
      loading: false,
      email: '',
      paymentError: true,
      emailSubmitted: false
    };
  },
  watch: {
    email(newVal) {
      this.email = newVal;
      this.invalidEmail = !validEmailRegex.test(this.email);
    }
  },
  beforeMount() {
    if (this.domainName === '' || !this.domainPrice) {
      this.$router.replace('/interface/dapps/unstoppable');
    }
  },
  methods: {
    submit() {
      if (this.invalidEmail || !this.account || !this.account.address) {
        return;
      }
      this.loading = true;
      fetch(
        `https://unstoppabledomains.com/api/v1/resellers/myetherwallet/users/${this.email}/orders`,
        {
          method: 'POST',
          headers: {
            'content-type': 'Application/JSON'
          },
          body: JSON.stringify({
            order: {
              domains: [
                {
                  name: this.domainName,
                  owner: { address: this.account.address },
                  resolution: {
                    crypto: { ETH: { address: this.account.address } }
                  }
                }
              ],
              payment: { type: 'crypto' }
            }
          })
        }
      )
        .then(resp => {
          if (resp.status === 200) {
            return resp.json();
          }
          throw new Error('Failed to submit payment');
        })
        .then(console.log);
    },
    sendTokenToServer(charge) {
      console.log(charge);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CryptoContainer.scss';
</style>
