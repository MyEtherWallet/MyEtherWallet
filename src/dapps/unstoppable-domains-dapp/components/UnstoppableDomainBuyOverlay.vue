<template>
  <mew-overlay
    :show-overlay="open"
    right-btn-text="Close"
    :close="close"
    content-size="large"
    :footer="helpObj"
  >
    <div class="payment--component">
      <!--
      =====================================================================================
        Panel: Payment Buttons
      =====================================================================================
      -->
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex flex-column align-start">
          <mew-button
            id="crypto"
            btn-style="transparent"
            color-theme="secondary"
            has-full-width
            :class="[crypto ? 'selectedBorder' : '']"
            class="my-2"
            :disabled="true"
            @click.native="selectTab($event)"
          >
            <div class="d-flex align-center justify-space-between">
              <v-icon small>mdi-ethereum</v-icon>
              <div>Pay with Crypto</div>
              <v-icon v-if="crypto" size="20">mdi-chevron-right</v-icon>
            </div>
          </mew-button>
          <mew-button
            id="credit"
            btn-style="transparent"
            color-theme="secondary"
            has-full-width
            :class="[credit ? 'selectedBorder' : '']"
            class="my-2 d-flex align-center justify-space-between"
            @click.native="selectTab($event)"
          >
            <div class="d-flex align-center justify-space-between">
              <v-icon small>mdi-credit-card-outline</v-icon>
              <div>Pay with Credit</div>
              <v-icon v-if="credit" size="20">mdi-chevron-right</v-icon>
            </div>
          </mew-button>
          <div class="buy-domain-info pa-4">
            <div class="d-flex flex-column">
              <div class="bluePrimary--text py-1">DOMAIN</div>
              <div>{{ domain.name }}</div>
            </div>
            <div class="d-flex flex-column">
              <div class="bluePrimary--text py-1">TOTAL</div>
              <div>
                {{ convertedEthPrice }} ETH
                <span class="textLight--text">${{ domain.price }}</span>
              </div>
            </div>
          </div>
        </div>

        <v-divider vertical class="mx-5" />

        <div style="width: 100%">
          <!--
          =====================================================================================
            Panel: Crypto
          =====================================================================================
          -->
          <div v-if="crypto">
            <h2 class="mb-3">Select Payment</h2>
            <div v-for="(payment, key) in cryptoPaymentOptions" :key="key">
              <v-card
                outlined
                class="pa-4 my-2 d-flex align-center justify-space-between"
                :class="[
                  payment.type === selectedCryptoPayment ? 'greenBorder' : ''
                ]"
                @click="
                  () => {
                    setSelected(payment.type);
                  }
                "
              >
                <div class="d-flex align-center">
                  <img :src="payment.icon" style="width: 24px" alt="Crypto" />
                  <div class="d-flex align-center px-1">
                    <div
                      v-if="payment.type === 'ETH'"
                      class="font-weight-medium"
                    >
                      {{ convertedEthPrice }}
                    </div>
                    <div v-else class="font-weight-medium">
                      {{ convertedUsdcAndDaiPrice }}
                    </div>
                  </div>
                  <div class="textLight--text">{{ payment.type }}</div>
                </div>
                <v-icon
                  v-if="payment.type === selectedCryptoPayment"
                  class="primary--text"
                  >mdi-check-circle</v-icon
                >
              </v-card>
            </div>
          </div>

          <!--
          =====================================================================================
            Panel: Credit
          =====================================================================================
          -->
          <div v-if="credit">
            <h2 class="mb-3">Enter card information</h2>
            <div>
              <StripeElements
                ref="elms"
                v-slot="{ elements }"
                :stripe-key="stripeKey"
              >
                <div class="stripe-form pl-3 d-flex flex-column justify-center">
                  <StripeElement
                    ref="cardNumber"
                    type="cardNumber"
                    :elements="elements"
                    :options="stripeOptions"
                  />
                </div>
                <v-row>
                  <v-col cols="6">
                    <div
                      class="stripe-form pl-3 d-flex flex-column justify-center"
                    >
                      <StripeElement
                        ref="cardCvc"
                        type="cardCvc"
                        :elements="elements"
                        :options="stripeOptions"
                      />
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div
                      class="stripe-form d-flex pl-3 flex-column justify-center"
                    >
                      <StripeElement
                        ref="cardExpiry"
                        type="cardExpiry"
                        :elements="elements"
                        :options="stripeOptions"
                      />
                    </div>
                  </v-col>
                </v-row>
              </StripeElements>
            </div>
            <div>
              <v-row>
                <v-col cols="6">
                  <mew-button
                    title="Cancel Payment"
                    btn-style="outline"
                    btn-size="xlarge"
                    has-full-width
                    @click.native="close"
                  />
                </v-col>
                <v-col cols="6">
                  <mew-button
                    :title="`Pay $${domainPrice}`"
                    btn-size="xlarge"
                    has-full-width
                    @click.native="pay"
                  />
                </v-col>
              </v-row>
            </div>
          </div>

          <div
            v-if="paymentError"
            class="error--text mt-3 mb-7 font-weight-medium"
          >
            {{ paymentError }}
          </div>

          <div
            v-if="notEnoughBalance && crypto"
            class="error--text mt-3 mb-7 font-weight-medium"
          >
            {{ $t('unstoppable.insufficient-balance') }}
            <a
              href="https://ccswap.myetherwallet.com/#/"
              target="_blank"
              class="text-decoration--underline"
            >
              {{ $t('unstoppable.insufficient-balance-advice') }}
            </a>
          </div>

          <div v-if="crypto" class="d-flex justify-center mt-5">
            <mew-button
              title="Next step"
              btn-size="xlarge"
              has-full-width
              @click.native="pay"
            />
          </div>
        </div>
      </div>
    </div>
  </mew-overlay>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import { StripeElements, StripeElement } from 'vue-stripe-elements-plus';
import BigNumber from 'bignumber.js';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import {
  createResellerOrder,
  getCoinbaseChargeInfo
} from '../handlers/resellerApi';

export default {
  name: 'UnstoppableDomainBuyOverlay',
  components: { StripeElements, StripeElement },
  props: {
    open: { default: false, type: Boolean },
    close: { default: () => {}, type: Function }
  },
  data() {
    return {
      crypto: false,
      credit: true,
      paymentError: '',
      confirmationStep: false,
      // publishableKey: 'pk_live_HAPE6Nv5bfhCJYKe6Nfaaj4P', // live key
      stripeKey: 'pk_test_bERlHfGH5lT9rTIhKPg74H0o', // test key
      helpObj: {
        text: 'Need help?',
        linkTitle: 'Contact support',
        link: 'mailto:support@myetherwallet.com'
      },
      selectedCryptoPayment: 'ETH',
      cryptoPaymentOptions: [
        {
          type: 'ETH',
          icon: require('@/assets/images/currencies/icon-eth-black.svg')
        },
        {
          type: 'USDC',
          icon: require('@/assets/images/currencies/usdc.png')
        },
        {
          type: 'DAI',
          icon: require('@/assets/images/currencies/dai.png')
        }
      ],
      stripeOptions: {
        style: {
          base: {
            color: 'black',
            fontFamily: '"Roboto", sans-serif',
            fontSize: '20px',
            fontWeight: '400',
            fontSmoothing: 'antialiased',
            '::placeholder': {
              color: '#5A678A'
            }
          }
        }
      }
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'address', 'web3']),
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('unstoppable', [
      'domain',
      'email',
      'domainPrice',
      'resellerId',
      'order'
    ]),
    convertedEthPrice() {
      return BigNumber(this.domainPrice).gt(0)
        ? BigNumber(this.domainPrice).dividedBy(this.fiatValue).toFixed(8)
        : '0';
    },
    convertedUsdcAndDaiPrice() {
      return BigNumber(this.domainPrice).gt(0)
        ? new BigNumber(this.domainPrice).toFixed(8)
        : '0';
    },
    notEnoughBalance() {
      const domainPriceInWei = new BigNumber(
        this.web3.utils.toWei(this.convertedEthPrice, 'ether')
      );
      return domainPriceInWei.comparedTo(new BigNumber(this.balance)) === 1;
    }
  },
  watch: {
    confirmationStep: async function (newVal) {
      if (newVal === true) {
        this.interval = setInterval(
          async () =>
            await this.updateOrderStatus().then(() =>
              this.fetchMyDomains(this.address)
            ),
          8000
        );
      }
    },
    order(newVal) {
      if (newVal.items[0].blockchain.status !== 'PENDING') {
        clearInterval(this.interval);
        this.confirmationStep = false;
        this.close();
      }
    },
    selectedCryptoPayment(newVal) {
      return newVal === this.selectedCryptoPayment;
    }
  },
  async mounted() {
    const coinbaseScript = document.createElement('script');
    const stripeScript = document.createElement('script');
    stripeScript.setAttribute('src', 'https://js.stripe.com/v3/');
    coinbaseScript.setAttribute(
      'src',
      'https://commerce.coinbase.com/v1/checkout.js'
    );
    document.head.appendChild(coinbaseScript);
    document.head.appendChild(stripeScript);
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  methods: {
    ...mapMutations('unstoppable', ['SET_ORDER']),
    ...mapActions('unstoppable', ['updateOrderStatus', 'fetchMyDomains']),
    selectTab(event) {
      const tabId = event.currentTarget.id;
      this.crypto = tabId === 'crypto';
      this.credit = !this.crypto;
    },
    async pay() {
      if (this.crypto) {
        return await this.payWithCrypto();
      }
      return await this.payWithStripe();
    },
    setSelected(payment) {
      this.selectedCryptoPayment = payment;
    },
    async payWithStripe() {
      try {
        const groupComponent = this.$refs.elms;
        const cardComponent = this.$refs.cardNumber;
        const cardElement = cardComponent.stripeElement;

        groupComponent.instance
          .createToken(cardElement)
          .then(async stripeToken => {
            if (stripeToken.error) {
              throw stripeToken.error;
            }
            stripeToken = stripeToken.token.id;
            try {
              const response = await createResellerOrder({
                //domain: 'reseller-test-myetherwallet-434343428.crypto', // change number everytime for test
                domain: this.domain.name,
                //email: this.email,
                resellerId: this.resellerId,
                address: this.address,
                payment: {
                  method: 'stripe'
                  // properties: {
                  //   tokenId: stripeToken
                  // }
                }
              });
              this.confirmationStep = true;
              this.SET_ORDER({ value: response.order });
              this.close();
            } catch (error) {
              Toast(error.message, {}, ERROR);
            }
          });
      } catch (error) {
        this.paymentError = error.message;
        Toast(error.message, {}, ERROR);
      }
    },
    async payWithCrypto() {
      try {
        const response = await createResellerOrder({
          domain: this.domain.name,
          email: this.email,
          resellerId: this.resellerId,
          address: this.address,
          payment: {
            method: 'coinbase'
          }
        });
        this.SET_ORDER({ value: response.order });
        const { charge } = await getCoinbaseChargeInfo({
          resellerId: this.resellerId,
          email: this.email,
          chargeId: response.order.payment.tokenId
        });
        const { ethereum, usdc, dai } = charge.data.pricing;
        if (this.selectedCryptoPayment === 'ETH') {
          const value = this.web3.utils.toWei(ethereum.amount, 'ether');
          await this.sendTransaction(charge.data.addresses.ethereum, value);
          this.close();
        }
        if (this.selectedCryptoPayment === 'USDC') {
          await this.sendTransaction(charge.data.addresses.usdc, usdc.amount);
          this.close();
        }
        if (this.selectedCryptoPayment === 'DAI') {
          await this.sendTransaction(charge.data.addresses.dai, dai.amount);
          this.close();
        }
      } catch (error) {
        this.paymentError = error.message;
        Toast(error.message, {}, ERROR);
      }
    },
    async sendTransaction(sendTo, value) {
      await this.web3.eth
        .sendTransaction({
          from: this.address,
          to: sendTo,
          value: value
        })
        .then(() => {
          this.confirmationStep = true;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
$textDark: #192133;
$greyMedium: #d7dae3;
$bluePrimary: #4b83e8;
$textLight: #939fb9;
$primary: #05c0a5;

.payment--component {
  width: 100%;
}

.bluePrimary--text {
  font-weight: bold;
  color: $bluePrimary;
}

.lightPrimary--text {
  color: $textDark;
}

.textLight--text {
  color: $textLight;
}

.buy-domain-info {
  border: 1px solid $greyMedium;
  border-radius: 12px;
  width: 100%;
}

.informationBG {
  background-color: var(--v-informationBlock-base) !important;
  border-color: var(--v-informationBlock-base);
}
.errorBorder {
  border-color: red !important;
}
.greenBorder {
  border-color: $primary !important;
}
.selectedBorder {
  background-color: #d4e1f9;
}

.adjustIconSize {
  width: 24px;
}

.stripe-form {
  border: 1px solid $primary;
  border-radius: 12px;

  margin-top: 10px;
  margin-bottom: 10px;
  height: 62px;
}
</style>
