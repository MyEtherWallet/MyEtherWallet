<template>
  <div class="py-8 px-8">
    <div
      class="d-flex align-center textDark--text mb-10 cursor--pointer"
      @click="$emit('close')"
    >
      <v-icon color="textDark">mdi-arrow-left mr-4</v-icon>
      <div class="mew-heading-2">Select provider</div>
    </div>
    <!-- ============================================================== -->
    <!-- Moonpay -->
    <!-- ============================================================== -->
    <div v-if="!hideMoonpay" class="section-block pa-5">
      <img
        class="provider-logo"
        src="@/modules/moon-pay/assets/moonpay-logo.svg"
        height="18"
      />
      <div class="mb-1">
        <div class="d-flex mb-1 align-center justify-space-between">
          <div class="d-flex mew-heading-3 textDark--text">
            {{ buyObj.cryptoToFiat }}
            <span class="mew-heading-3 pl-1">{{ selectedCryptoName }}</span>
          </div>
        </div>
        <div class="d-flex align-center">
          <div class="mr-1 textDark--text">≈ {{ buyObj.plusFeeF }}</div>
          <mew-tooltip style="height: 21px">
            <template #contentSlot>
              <div>
                {{ buyObj.includesFeeText }}
                <br />
                <br />
                {{ buyObj.networkFeeText }}
                <br />
                <br />
                {{ buyObj.dailyLimit }}
                <br />
                {{ buyObj.monthlyLimit }}
              </div>
            </template>
          </mew-tooltip>
        </div>
      </div>

      <div class="d-flex align-center mb-1">
        <img
          src="@/assets/images/icons/moonpay/icon-visa.svg"
          alt="Visa"
          height="24"
          class="mr-2"
        />
        <img
          src="@/assets/images/icons/moonpay/icon-master.svg"
          alt="Master"
          height="24"
          class="mr-2"
        />
        <img
          src="@/assets/images/icons/moonpay/icon-apple-pay.svg"
          alt="Master"
          height="24"
          class="mr-2"
        />
        <img
          v-if="isEUR"
          src="@/assets/images/icons/moonpay/icon-bank.svg"
          alt="Bank"
          height="24"
        />
      </div>
      <div class="mew-label mb-5">
        {{ paymentOptionString }}
      </div>
      <!------ WEN USER IS NOT IN WALLET, SHOW BELOW -------->
      <div v-if="!inWallet">
        <mew-button
          has-full-width
          :is-valid-address-func="isValidToAddress"
          :title="moonpayBtnTitle"
          @click.native="buyFromHome"
        />
      </div>
      <!------ WEN USER IS IN WALLET, SHOW BELOW -------->
      <div v-else>
        <mew-button
          has-full-width
          :title="moonpayBtnTitle"
          @click.native="buy"
        />
      </div>
    </div>
    <!-- ============================================================== -->
    <!-- Simplex -->
    <!-- ============================================================== -->
    <div v-if="!hideSimplex" class="section-block pa-5">
      <div class="mb-1">
        <div class="d-flex mb-1 align-center justify-space-between">
          <div class="d-flex mew-heading-3 textDark--text">
            {{ buyObj.cryptoToFiat }}
            <span class="mew-heading-3 pl-1">{{ selectedCryptoName }}</span>
          </div>
        </div>
        <div class="d-flex align-center">
          <div class="mr-1 textDark--text">≈ {{ buyObj.plusFeeF }}</div>
          <mew-tooltip style="height: 21px">
            <template #contentSlot>
              <div>
                {{ buyObj.includesFeeText }}
                <br />
                <br />
                {{ buyObj.networkFeeText }}
                <br />
                <br />
                {{ buyObj.dailyLimit }}
                <br />
                {{ buyObj.monthlyLimit }}
              </div>
            </template>
          </mew-tooltip>
        </div>
      </div>
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-start mb-1">
          <img
            src="@/assets/images/icons/moonpay/icon-visa.svg"
            alt="Visa"
            height="24"
            class="mr-2"
          />
          <img
            src="@/assets/images/icons/moonpay/icon-master.svg"
            alt="Master"
            height="24"
            class="mr-2"
          />
        </div>
        <img
          class="provider-logo"
          src="@/assets/images/icons/icon-simplex.svg"
          alt="simplex"
          height="28"
        />
      </div>
      <div class="mew-label mb-5">Visa, Mastercard</div>
      <div v-if="!inWallet">
        <mew-button
          has-full-width
          :is-valid-address-func="isValidToAddress"
          :title="simplexBtnTitle"
          @click.native="openSimplexFromHome"
        />
      </div>
      <div v-else>
        <mew-button
          has-full-width
          :title="simplexBtnTitle"
          @click.native="openSimplex"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MultiCoinValidator from 'multicoin-address-validator';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import { isEmpty } from 'lodash';
import BigNumber from 'bignumber.js';
import { mapGetters, mapActions, mapState } from 'vuex';
import { randomHex } from 'web3-utils';
export default {
  name: 'ModuleBuyEthProvider',
  props: {
    moonpayHandler: {
      type: Object,
      default: () => {}
    },
    close: {
      type: Function,
      default: () => {}
    },
    inWallet: {
      type: Boolean,
      default: false
    },
    onlySimplex: {
      type: Boolean,
      default: false
    },
    selectedFiat: {
      type: Object,
      default: () => ({})
    },
    selectedCurrency: {
      type: Object,
      default: () => ({})
    },
    buyObj: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: true,
      amount: '100'
    };
  },
  computed: {
    ...mapGetters('global', ['network']),
    ...mapState('wallet', ['address']),
    selectedFiatName() {
      return this.selectedFiat.name;
    },
    actualAddress() {
      return this.inWallet ? this.address : randomHex(20);
    },
    selectedCryptoName() {
      return this.selectedCurrency.name;
    },
    isEUR() {
      return this.selectedFiatName === 'EUR' || this.selectedFiatName === 'GBP';
    },
    hideMoonpay() {
      return this.onlySimplex;
    },
    hideSimplex() {
      return (
        this.selectedCryptoName === 'USDC' || this.selectedCryptoName === 'USDT'
      );
    },
    simplexBtnTitle() {
      return 'BUY WITH SIMPLEX';
    },
    moonpayBtnTitle() {
      return 'BUY WITH MOONPAY';
    },
    paymentOptionString() {
      return `Visa, Mastercard, Apple Pay${this.isEUR ? ', Bank account' : ''}`;
    },
    hasData() {
      return !isEmpty(this.fetchedData);
    },
    max() {
      if (this.hasData) {
        const moonpayMax = this.fetchedData[0]?.limits.find(
          item => item.fiat_currency === this.selectedFiatName
        );
        const simplexMax = this.fetchedData[1]?.limits.find(
          item => item.fiat_currency === this.selectedFiatName
        );
        return {
          moonpay: moonpayMax
            ? BigNumber(moonpayMax.limit.max)
            : BigNumber(12000),
          simplex: simplexMax
            ? BigNumber(simplexMax.limit.max)
            : BigNumber(12000)
        };
      }
      return {
        moonpay: BigNumber(12000),
        simplex: BigNumber(12000)
      };
    }
  },
  watch: {
    amount: {
      handler: function (newVal) {
        const simplexMax = this.max.simplex;
        if (simplexMax.lt(newVal)) {
          this.loading = true;
        } else {
          this.loading = false;
        }
      }
    }
  },
  methods: {
    ...mapActions('global', ['setNetwork']),
    isValidToAddress(address) {
      return MultiCoinValidator.validate(address, this.selectedCurrency.name);
    },
    openSimplex() {
      // eslint-disable-next-line
      window.open(
        `https://ccswap.myetherwallet.com/#/?fiat=${this.selectedFiatName.toLowerCase()}&amount=${
          this.amount
        }&to=${this.actualAddress}`,
        '_blank'
      );
    },
    openSimplexFromHome() {
      // eslint-disable-next-line
      window.open(
        `https://ccswap.myetherwallet.com/#/?fiat=${this.selectedFiatName.toLowerCase()}&amount=${
          this.amount
        }`,
        '_blank'
      );
    },
    reset() {
      this.loading = true;
      this.fetchData = {};
    },
    buy() {
      this.moonpayHandler
        .buy(
          this.selectedCurrency.name,
          this.selectedFiatName,
          this.amount,
          this.actualAddress
        )
        .then(() => {
          this.reset();
          this.close();
          this.$emit('reset');
        })
        .catch(err => {
          this.reset();
          Toast(err, {}, ERROR);
          this.close();
          this.$emit('reset');
        });
    },
    buyFromHome() {
      this.moonpayHandler
        .buy(
          this.selectedCurrency.name,
          this.selectedFiatName,
          this.amount,
          randomHex(20) // Random hex placeholder
        )
        .then(() => {
          this.reset();
          this.close();
          this.$emit('reset');
        })
        .catch(err => {
          this.reset();
          Toast(err, {}, ERROR);
          this.close();
          this.$emit('reset');
        });
    }
  }
};
</script>

<style lang="scss" scoped>
// Force set button border color(greyMedium) for not selected buttons
.not-selected {
  border: 1px solid var(--v-greyMedium-base);
}
.icon-holder {
  border: 2px solid var(--v-greyMedium-base);
  border-radius: 100px;
  width: 20px;
  height: 20px;
}
.section-block {
  border-radius: 12px;
  left: 0px;
  top: 0px;
  box-sizing: border-box;
  border: 2px solid var(--v-greyMedium-base);
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  margin: 8px 0px;
  position: relative;
}
.section-block:hover {
  cursor: pointer;
  border: 2px solid #1eb19b;
  background-color: #e5eaee;
}
.selected {
  border: 2px solid #1eb19b;
}
.provider-logo {
  position: absolute;
  top: 18px;
  right: 20px;
}
.selectedFiat {
  max-width: 120px;
}
</style>
