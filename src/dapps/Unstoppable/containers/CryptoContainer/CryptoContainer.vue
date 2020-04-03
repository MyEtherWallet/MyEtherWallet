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
          <h5
            v-show="!chargeId"
            class="pay-with-card"
            @click="handlePayWithCardClick"
          >
            {{ $t('unstoppable.pay-with-credit-card') }}
          </h5>
        </div>
        <div v-show="!paymentAddress || !paymentAmount">
          <h5>Your balance: {{ balance }} ETH</h5>
          <h5 v-show="balance * 100 < domainPrice" class="error-message">
            {{ $t('unstoppable.insufficient-balance') }}
          </h5>
          <!-- TODO: Remove false && from class and disabled -->
          <button
            :class="[
              false && balance * 100 < domainPrice ? 'disabled' : '',
              'large-round-button-green-filled clickable pay-button'
            ]"
            :disabled="false && (loading || balance * 100 < domainPrice)"
            @click="submit"
          >
            <span v-show="!loading">
              {{ $t('unstoppable.continue') }}
            </span>
            <i v-show="loading" class="fa fa-spinner fa-spin" />
          </button>
        </div>
        <div v-show="paymentAddress && paymentAmount">
          <div class="crypto-payment-field-container">
            <div class="crypto-field-container">
              <h5 class="crypto-field-label">
                {{ $t('unstoppable.ethereum-payment-address') }}
              </h5>
              <div class="crypto-field">
                <input
                  ref="payment-address"
                  type="hidden"
                  :value="paymentAddress"
                />
                <h6>{{ paymentAddress }}</h6>
                <img
                  :src="copyIcon"
                  class="copy-button"
                  alt
                  @click="copyPaymentAddress"
                />
              </div>
            </div>
            <div :class="['crypto-field-container margin-bottom']">
              <h5 class="crypto-field-label">
                {{ $t('unstoppable.payment-amount') }}
              </h5>
              <div class="crypto-field">
                <input
                  ref="payment-amount"
                  type="hidden"
                  :value="paymentAmount"
                />
                <h6>{{ paymentAmount }}</h6>
                <img
                  :src="copyIcon"
                  class="copy-button"
                  alt
                  @click="copyPaymentAmount"
                />
              </div>
            </div>
            <div :class="['qr-code margin-bottom']">
              <qrcode :value="paymentAddress" :options="{ size: 160 }" />
            </div>

            <h6
              v-show="pendingPayment && confirmationsRequired"
              class="payment-pending"
            >
              {{
                $t('unstoppable.pending-crypto-payment', {
                  confirmations: confirmations,
                  confirmationsRequired: confirmationsRequired
                })
              }}
            </h6>
            <button
              :disabled="loading || pendingPayment"
              :class="[
                'large-round-button-green-filled clickable pay-button send-payment-button'
              ]"
              @click="sendPayment"
            >
              <span v-show="!loading && !pendingPayment">
                {{ $t('unstoppable.send-payment') }}
              </span>
              <i
                v-show="loading || pendingPayment"
                class="fa fa-spinner fa-spin"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import copyIcon from '@/assets/images/icons/copy.svg';

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
    email: {
      type: String,
      default: ''
    },
    account: {
      type: Object,
      default: function () {}
    },
    web3: {
      type: Object,
      default: function () {}
    },
    copiedToClipboard: { type: Function, default: function () {} },
    setOrderNumber: { type: Function, default: function () {} }
  },
  data() {
    return {
      complete: false,
      cryptoOptions: {},
      loading: false,
      pendingPayment: false,
      paymentAddress: '',
      paymentAmount: 0,
      chargeId: '',
      confirmations: 0,
      confirmationsRequired: 0,
      copyIcon
    };
  },
  computed: {
    balance() {
      return this.account && this.account.balance
        ? new BigNumber(
            this.web3.utils.fromWei(this.account.balance.toString())
          ).toFixed()
        : '0';
    }
  },
  beforeMount() {
    if (this.domainName === '' || !this.domainPrice) {
      this.$router.push('/interface/dapps/unstoppable');
    }
    this.interval = setInterval(() => {
      if (this.chargeId) {
        this.getCharge(this.chargeId);
      }
    }, 8000);
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  methods: {
    copyPaymentAmount() {
      this.$refs['payment-amount'].setAttribute('type', 'text');
      this.$refs['payment-amount'].select();
      document.execCommand('copy');
      this.$refs['payment-amount'].setAttribute('type', 'hidden');
      this.copiedToClipboard();
    },
    copyPaymentAddress() {
      this.$refs['payment-address'].setAttribute('type', 'text');
      this.$refs['payment-address'].select();
      document.execCommand('copy');
      this.$refs['payment-address'].setAttribute('type', 'hidden');
      this.copiedToClipboard();
    },
    sendPayment() {
      this.loading = true;
      this.web3.eth
        .sendTransaction({
          from: this.account.address,
          to: this.paymentAddress,
          value: '1' || this.web3.utils.toWei(this.paymentAmount.toString()),
          gasPrice: this.web3.utils.toWei('8', 'gwei')
        })
        .on('transactionHash', () => {
          this.pendingPayment = true;
          this.loading = false;
        })
        .on('error', () => {
          this.loading = false;
        });
    },
    getCharge(chargeId) {
      return fetch(
        `https://unstoppabledomains.com/api/v1/resellers/myetherwallet/users/${this.email}/orders/coinbase-charge/${chargeId}`
      )
        .then(resp => {
          if (resp.status === 200) {
            return resp.json();
          }
          throw new Error('Failed to get charge info');
        })
        .then(({ charge }) => {
          if (!this.paymentAddress || !this.paymentAmount) {
            this.paymentAddress = charge.data.addresses.ethereum;
            this.paymentAmount = +charge.data.pricing.ethereum.amount;
          }
          for (const payment of charge.data.payments) {
            if (
              payment.network === 'ethereum'
              // +payment.value.crypto.amount >= this.paymentAmount
            ) {
              if (payment.status === 'PENDING') {
                this.pendingPayment = true;
              }
              this.confirmations = payment.block.confirmations;
              this.confirmationsRequired = payment.block.confirmations_required;
              if (payment.status === 'CONFIRMED') {
                this.$router.push('/interface/dapps/unstoppable/claim-pending');
              }
            }
          }
        });
    },
    handlePayWithCardClick() {
      this.$router.push(
        '/interface/dapps/unstoppable/buy/payment-method/stripe'
      );
    },
    submit() {
      if (!this.account || !this.account.address) {
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
              payment: { type: 'coinbase' }
            }
          })
        }
      )
        .then(resp => {
          if (resp.status === 200) {
            return resp.json();
          }
          throw new Error('Failed to create charge');
        })
        .then(({ order }) => {
          this.setOrderNumber(order.orderNumber);
          this.getCharge(order.payment.tokenId).then(() => {
            this.chargeId = order.payment.tokenId;
            this.loading = false;
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CryptoContainer.scss';
</style>
