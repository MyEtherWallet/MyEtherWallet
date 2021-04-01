<template>
  <mew-overlay :show-overlay="open" right-btn-text="Close" :close="close">
    <template #mewOverlayBody>
      <div v-if="!confirmationStep">
        <h2 class="text-center mb-10">{{ $t('unstoppable.buyDomain') }}</h2>
        <mew6-white-sheet>
          <div class="pa-8">
            <div>
              <v-sheet
                color="transparent"
                width="600px"
                class="mx-auto mb-10 border-radius--10px informationBlock py-5 px-7"
              >
                <div>
                  <div class="d-flex align-center justify-space-between">
                    <div>{{ $t('unstoppable.price') }}</div>
                    <div class="font-weight-medium">
                      {{ convertedEthPrice }} ETH (${{ getDomainPrice() }})
                    </div>
                  </div>
                </div>
              </v-sheet>
              <v-sheet color="transparent" width="450px" class="mx-auto">
                <div class="d-flex align-center justify-space-between mb-5">
                  <div
                    id="crypto"
                    :class="[
                      crypto
                        ? 'mew-heading-1'
                        : 'font-weight-medium primary--text'
                    ]"
                    style="cursor: pointer"
                    @click="selectTab($event)"
                  >
                    {{ $t('unstoppable.pay-with-crypto') }}
                  </div>
                  <div
                    id="credit"
                    :class="[
                      credit
                        ? 'mew-heading-1'
                        : 'font-weight-medium primary--text'
                    ]"
                    style="cursor: pointer"
                    @click="selectTab($event)"
                  >
                    {{ $t('unstoppable.pay-with-credit-card') }}
                  </div>
                </div>

                <v-card
                  v-if="crypto"
                  outlined
                  class="pa-4 d-flex align-center justify-space-between bordered-red informationBG"
                  :class="[InsufficientBalance ? 'errorBorder' : 'greenBorder']"
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

                <v-card
                  v-if="credit"
                  outlined
                  class="pa-4 d-flex align-center justify-space-between bordered-red greenBorder informationBG"
                >
                  <div class="d-flex align-center">
                    <img
                      src="@/assets/images/currencies/usd.png"
                      :style="{ width: '28px' }"
                      alt="USD"
                    />
                    <div class="font-weight-medium ml-3">
                      {{ getDomainPrice() }}
                      <span class="primary--text">USD</span>
                    </div>
                  </div>
                  <v-icon class="primary--text">mdi-check-circle</v-icon>
                </v-card>
                <div v-if="credit" class="stripe-card-input mt-8">
                  <card
                    :class="{ complete }"
                    :stripe="publishableKey"
                    :options="{}"
                    @change="complete = $event.complete"
                  />
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
                  v-if="InsufficientBalance && crypto"
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

                <div class="d-flex justify-center mt-5">
                  <mew-button
                    :title="$t('unstoppable.pay')"
                    btn-size="xlarge"
                    @click.native="pay"
                  />
                </div>
              </v-sheet>
            </div>
          </div>
        </mew6-white-sheet>
      </div>
      <div v-if="confirmationStep">
        <h2 class="text-center mb-10">{{ $t('unstoppable.confirmation') }}</h2>
        <mew6-white-sheet>
          <div class="pa-8">
            <v-sheet
              color="transparent"
              class="mx-auto mb-10 border-radius--10px informationBlock py-5 px-7"
            >
              <div class="d-flex flex-column">
                <div class="d-flex justify-space-between">
                  <div>{{ $t('unstoppable.domain-name') }}</div>
                  <div class="font-weight-medium">{{ domain.name }}</div>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <div>{{ $t('unstoppable.price') }}</div>
                  <div class="font-weight-medium">
                    {{ convertedEthPrice }} ETH (${{ getDomainPrice() }})
                  </div>
                </div>
              </div>
            </v-sheet>
            <v-progress-linear
              style="margin: 130px auto 40px auto; max-width: 200px"
              indeterminate
              color="primary"
            ></v-progress-linear>
            <h4 class="font-weight-bold text-center">
              {{ $t('unstoppable.processing-registration') }}
            </h4>
            <v-sheet
              color="transparent"
              max-width="300px"
              class="text-center mx-auto mt-3"
            >
              {{ $t('unstoppable.processing-registration-advice') }}
            </v-sheet>
          </div>
          <div class="py-10"></div>
        </mew6-white-sheet>
      </div>
    </template>
  </mew-overlay>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import { Card, createToken } from 'vue-stripe-elements-plus';
import BigNumber from 'bignumber.js';
import {
  createResellerOrder,
  getCoinbaseChargeInfo
} from '../handlers/resellerApi';

export default {
  components: { Card },
  props: {
    open: { default: false, type: Boolean },
    close: {
      default: function () {
        return {};
      },
      type: Function
    }
  },
  data() {
    return {
      crypto: true,
      credit: false,
      complete: false,
      paymentError: '',
      coinbaseError: '',
      confirmationStep: false,
      publishableKey: 'pk_live_HAPE6Nv5bfhCJYKe6Nfaaj4P',
      chargeToken: undefined,
      udAddress: undefined,
      emailError: false,
      loading: false,
      buyStatus: undefined
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'address', 'web3']),
    convertedEthPrice() {
      let ethConvertPrice = 0;
      const domainPrice = this.getDomainPrice();
      if (domainPrice > 0) {
        ethConvertPrice = new BigNumber(domainPrice)
          .dividedBy(this.ethPrice)
          .toFixed(8);
      }
      return ethConvertPrice;
    },
    domain() {
      return this.getDomain();
    },
    InsufficientBalance() {
      const domainPriceInWei = new BigNumber(
        this.web3.utils.toWei(this.convertedEthPrice, 'ether')
      );
      return domainPriceInWei.comparedTo(new BigNumber(this.balance)) === 1;
    },
    email() {
      return this.getEmail();
    },
    resellerId() {
      return this.getResellerId();
    },
    order() {
      return this.getOrder();
    }
  },
  watch: {
    confirmationStep: async function (newVal) {
      if (newVal === true) {
        this.interval = setInterval(
          async () => await this.updateOrderStatus(),
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
    await this.getEthPrice();
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  methods: {
    ...mapGetters('unstoppable', [
      'getDomain',
      'getEmail',
      'getDomainPrice',
      'getDomainName',
      'getBaseUrl',
      'getResellerId',
      'getOrder'
    ]),
    ...mapMutations('unstoppable', ['setOrder']),
    ...mapActions('unstoppable', ['updateOrderStatus']),
    selectTab(event) {
      const tabId = event.currentTarget.id;
      this.crypto = tabId === 'crypto';
      this.credit = !this.crypto;
    },
    async getEthPrice() {
      const price = await fetch(
        'https://cryptorates.mewapi.io/ticker?filter=ETH'
      ).then(res => {
        return res.json();
      });
      this.ethPrice =
        typeof price === 'object' ? price.data.ETH.quotes.USD.price : 0;
    },
    async pay() {
      if (this.crypto) {
        return await this.payWithCrypto();
      }
      return await this.payWithStripe();
    },
    async payWithStripe() {
      try {
        let stripeToken = await createToken();
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
        this.setOrder({ value: response.order });
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.paymentError = error.message;
      }
    },
    async payWithCrypto() {
      try {
        this.loading = true;
        const response = await createResellerOrder({
          domain: this.domain.name,
          email: this.email,
          resellerId: this.resellerId,
          address: this.address,
          payment: {
            type: 'coinbase'
          }
        });
        this.setOrder({ value: response.order });
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
          .then(() => (this.confirmationStep = true) && (this.loading = false));
      } catch (err) {
        this.loading = false;
        this.paymentError = err.message;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
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
</style>
