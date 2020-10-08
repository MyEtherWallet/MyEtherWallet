<template lang="html">
  <div>
    <div class="crypto-container">
      <div class="domain-header">
        <div class="items-container">
          <h4
            v-for="cartItem of cart"
            :key="`${cartItem.label}.${cartItem.extension}`"
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
      <div class="crypto-form-container">
        <div class="crypto-form-header">
          <h3>{{ $t('unstoppable.pay-with-crypto') }}</h3>
          <h5
            v-show="!chargeId"
            class="pay-with-card"
            @click="handlePayWithCardClick"
          >
            {{ $t('unstoppable.pay-with-credit-card') }}
          </h5>
        </div>
        <div v-show="!paymentAddress || !paymentAmount">
          <div class="eth-balance-container">
            <span class="your-bal">{{ $t('unstoppable.your-balance') }}</span>
            <div class="right-container">
              <img src="@/assets/images/currency/eth.svg" alt="eth" />
              <div class="balance">
                <span>{{ balance }}</span>
                <span class="eth-text">{{ $t('common.currency.eth') }}</span>
              </div>
            </div>
          </div>
          <span v-show="balance < convertedEthPrice" class="error-message">
            {{ $t('unstoppable.insufficient-balance') }}
          </span>
          <div class="btn-container">
            <button class="back-btn" @click="goBack()">
              <span>
                {{ $t('common.back') }}
              </span>
            </button>
            <button
              :class="[
                balance < convertedEthPrice ? 'disabled' : '',
                'large-round-button-green-filled clickable pay-button'
              ]"
              :disabled="loading || balance < convertedEthPrice"
              @click="submit"
            >
              <span v-show="!loading">
                {{ $t('unstoppable.continue') }}
              </span>
              <i v-show="loading" class="fa fa-spinner fa-spin" />
            </button>
          </div>
        </div>
        <div v-show="paymentAddress && paymentAmount">
          <div class="crypto-payment-field-container">
            <div class="crypto-field-container">
              <div class="crypto-field">
                <div class="right">
                  <img
                    :src="copyIcon"
                    class="copy-button"
                    alt
                    @click="copyPaymentAddress"
                  />
                  <input
                    ref="payment-address"
                    type="hidden"
                    :value="paymentAddress"
                  />
                  <div class="payment-addr">{{ paymentAddress }}</div>
                </div>
                <span class="crypto-field-label">
                  {{ $t('unstoppable.address') }}
                </span>
              </div>
            </div>
            <div :class="['crypto-field-container margin-bottom']">
              <div class="crypto-field-container">
                <div class="crypto-field">
                  <div class="right">
                    <img
                      class="eth-icon"
                      src="@/assets/images/currency/eth.svg"
                      alt="eth"
                    />
                    <input
                      ref="payment-amount"
                      type="hidden"
                      :value="paymentAmount"
                    />
                    <div class="amount-container">
                      <div class="amount-text">{{ paymentAmount }}</div>
                      <span class="eth-text">{{
                        $t('common.currency.eth')
                      }}</span>
                    </div>
                  </div>
                  <span class="crypto-field-label">
                    {{ $t('unstoppable.payment-amount') }}
                  </span>
                </div>
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
            <div class="btn-container">
              <button class="back-btn" @click="goBack()">
                <span>
                  {{ $t('common.back') }}
                </span>
              </button>
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
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import copyIcon from '@/assets/images/icons/copy.svg';
import { mapState } from 'vuex';
import { Toast } from '@/helpers';

export default {
  props: {
    cart: {
      type: Array,
      default: () => {
        return [];
      }
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
      copyIcon,
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
    },
    balance() {
      return this.account && this.account.balance
        ? new BigNumber(
            this.web3.utils.fromWei(this.account.balance.toString())
          ).toFixed(8)
        : '0';
    }
  },
  beforeMount() {
    if (!this.cart.length) {
      this.$router.push({ name: 'unstoppableInitialState' });
    }
    this.interval = setInterval(() => {
      if (this.chargeId) {
        this.getCharge(this.chargeId);
      }
    }, 8000);
  },
  mounted() {
    if (this.online) this.getEthPrice();
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  methods: {
    goBack() {
      this.$router.push('/interface/dapps/unstoppable');
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
    },
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
          value: this.web3.utils.toWei(this.paymentAmount.toString())
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
                this.$router.push({ name: 'claimPending' });
              }
            }
          }
        });
    },
    handlePayWithCardClick() {
      this.$router.push({ name: 'payWithStripe' });
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
              domains: this.cart.map(cartItem => ({
                name: cartItem.label + '.' + cartItem.extension,
                owner: { address: this.account.address },
                resolution: {
                  crypto: { ETH: { address: this.account.address } }
                }
              })),
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
