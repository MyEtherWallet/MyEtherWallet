<template>
  <mew-overlay
    :show-overlay="open"
    right-btn-text="Close"
    :close="close"
    content-size="large"
  >
    <div>
      <v-sheet width="500px" height="100%" color="transparent">
        <!--
        =====================================================================================
          Panel: Payment Buttons
        =====================================================================================
        -->
        <div class="d-flex align-center justify-center">
          <div class="d-flex flex-column align-start">
            <mew-button
              id="crypto"
              title="Pay with Crypto"
              btn-style="transparent"
              color-theme="secondary"
              has-full-width
              :class="[crypto ? 'selectedBorder' : '']"
              class="my-2"
              @click.native="selectTab($event)"
            />
            <mew-button
              id="credit"
              title="Pay with Credit"
              btn-style="transparent"
              color-theme="secondary"
              has-full-width
              :class="[credit ? 'selectedBorder' : '']"
              class="my-2"
              @click.native="selectTab($event)"
            />
            <div class="buy-domain-info pa-4">
              <div class="d-flex flex-column">
                <div class="bluePrimary--text py-1">DOMAIN</div>
                <div>{{ domain.name }}</div>
              </div>
              <div class="d-flex flex-column">
                <div class="bluePrimary--text py-1">TOTAL</div>
                <div>{{ convertedEthPrice }} ETH ${{ domain.price }}</div>
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
              <v-card
                outlined
                class="
                  pa-2
                  d-flex
                  align-center
                  justify-space-between
                  bordered-red
                  informationBG
                "
                :class="[notEnoughBalance ? 'errorBorder' : 'greenBorder']"
              >
                <div class="d-flex align-center">
                  <img
                    src="@/assets/images/currencies/icon-eth-blue.svg"
                    alt="Crypto"
                  />
                  <div class="font-weight-medium ml-3">
                    {{ convertedEthPrice }}
                    <span class="primary--text">ETH</span>
                  </div>
                </div>
                <v-icon class="primary--text">mdi-check-circle</v-icon>
              </v-card>
            </div>

            <!--
            =====================================================================================
              Panel: Credit
            =====================================================================================
            -->
            <!-- <div v-if="credit">
              <h2 class="mb-3">Enter card information</h2>
              <v-row no-gutters>
                <v-col cols="12">
                  <mew-input placeholder="Cardholder's Name" />
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12">
                  <mew-input placeholder="Card Number" />
                </v-col>
              </v-row>
              <v-row no-gutters justify="center">
                <v-col class="pr-1" cols="6">
                  <mew-input placeholder="Valid Through" />
                </v-col>
                <v-col class="pl-1" cols="6">
                  <mew-input placeholder="CVV" />
                </v-col>
              </v-row>
              <v-row no-gutters justify="space-between">
                <v-col class="pr-1" cols="5">
                  <mew-button
                    btn-style="outline"
                    title="Cancel Payment"
                    @click.native="close"
                  />
                </v-col>
                <v-col class="pl-1" cols="5">
                  <mew-button
                    :title="`Pay $${domain.price}`"
                    @click.native="pay"
                  />
                </v-col>
              </v-row>
            </div> -->

            <!-- <div v-if="credit" class="stripe-card-input mt-8">
              <card
                :class="{ complete }"
                :stripe="publishableKey"
                :options="{}"
                @change="complete = $event.complete"
              />
            </div> -->

            <div v-if="credit" class="payment-simple">
              <StripeElements
                v-slot="{ elements }"
                ref="elms"
                :stripe-key="stripeKey"
              >
                <StripeElement ref="card" type="card" :elements="elements">
                </StripeElement>
              </StripeElements>
              <button type="button" @click="pay">Pay</button>
            </div>

            <v-progress-linear
              v-if="loading"
              style="margin: 32px auto 40px auto; max-width: 200px"
              indeterminate
              color="primary"
            ></v-progress-linear>

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
      </v-sheet>
    </div>
  </mew-overlay>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import { StripeElements, StripeElement } from 'vue-stripe-elements-plus';
import BigNumber from 'bignumber.js';
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
      crypto: true,
      credit: false,
      paymentError: '',
      confirmationStep: false,
      // publishableKey: 'pk_live_HAPE6Nv5bfhCJYKe6Nfaaj4P',
      loading: false,
      stripeKey: 'pk_test_TYooMQauvdEDq54NiTphI7jx' // test key, don't hardcode
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
    async payWithStripe() {
      try {
        const groupComponent = this.$refs.elms;
        const cardComponent = this.$refs.card;
        const cardElement = cardComponent.stripeElement;

        groupComponent.instance
          .createToken(cardElement)
          .then(async stripeToken => {
            if (stripeToken.error) {
              throw stripeToken.error;
            }
            stripeToken = stripeToken.token.id;
            this.loading = true;
            const response = await createResellerOrder({
              domain: this.domain.name,
              email: this.email,
              resellerId: this.resellerId,
              address: this.address,
              payment: {
                type: 'stripe',
                tokenId: stripeToken
              }
            });
            this.confirmationStep = true;
            this.SET_ORDER({ value: response.order });
            this.loading = false;
          });
      } catch (error) {
        this.loading = false;
        this.paymentError = error.message;
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
            type: 'coinbase'
          }
        });
        this.SET_ORDER({ value: response.order });
        const { charge } = await getCoinbaseChargeInfo({
          resellerId: this.resellerId,
          email: this.email,
          chargeId: response.order.payment.tokenId
        });
        const value = this.web3.utils.toWei(
          charge.data.pricing.ethereum.amount,
          'ether'
        );
        await this.web3.eth
          .sendTransaction({
            from: this.address,
            to: charge.data.addresses.ethereum,
            value
          })
          .then(() => {
            this.confirmationStep = true;
            this.loading = false;
          });
      } catch (err) {
        this.loading = false;
        this.paymentError = err.message;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$textDark: #192133;
$greyMedium: #d7dae3;
$bluePrimary: #4b83e8;

.bluePrimary--text {
  font-weight: bold;
  color: $bluePrimary;
}

.lightPrimary--text {
  color: $textDark;
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
  border-color: green !important;
}
.selectedBorder {
  background-color: #d4e1f9;
}
</style>
