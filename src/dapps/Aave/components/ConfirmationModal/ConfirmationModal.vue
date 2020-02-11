<template>
  <div class="modal-container">
    <b-modal
      ref="confirmationModal"
      :title="
        isCollateralModal
          ? $t('dappsAave.usage-collateral')
          : $t('dappsAave.confirmation')
      "
      centered
      hide-footer
      static
      lazy
    >
      <div class="modal-contents">
        <div v-if="!isCollateralModal" class="header-container">
          <div class="left-container">
            <p class="title">
              {{
                activeDepositTab
                  ? $t('dappsAave.amount-to-deposit')
                  : $t('dappsAave.amount-to-borrow')
              }}
            </p>
            <p class="amount mt-2">
              {{ convertToFixed(amount, 4)
              }}<span class="token-name"> {{ token.name }} </span>
            </p>
            <p class="usd-amount mt-2">${{ convertToUSD(amount) }}</p>
          </div>
          <div class="right-container">
            <img
              v-if="token.symbol && !getIcon(token.symbol)"
              class="large-token-icon"
              :src="
                require(`@/assets/images/currency/coins/AllImages/${token.symbol.toUpperCase()}.svg`)
              "
            />
            <span
              v-if="token.symbol && getIcon(token.symbol)"
              :class="[
                'cc',
                getIcon(token.symbol),
                'cc-icon',
                'currency-symbol',
                'large-token-icon'
              ]"
            ></span>
          </div>
        </div>
        <div class="body-container">
          <div v-if="activeDepositTab" class="health-container">
            <div class="left-container">
              <p v-if="isCollateralModal">{{ $t('dappsAave.currency') }}</p>
              <p class="mt-4">
                {{ $t('dappsAave.current-health') }}
                <popover class="ml-1" popcontent="CHANGE THIS" />
              </p>
              <p class="mt-4">
                {{ $t('dappsAave.next-health') }}
                <popover class="ml-1" popcontent="CHANGE THIS" />
              </p>
            </div>
            <div class="right-container">
              <p v-if="isCollateralModal" class="currency-title">
                <img
                  v-if="
                    token.reserve !== undefined &&
                      !getIcon(token.reserve.symbol)
                  "
                  class="token-icon"
                  :src="
                    require(`@/assets/images/currency/coins/AllImages/${token.reserve.symbol.toUpperCase()}.svg`)
                  "
                />
                <span
                  v-if="
                    token.reserve !== undefined && getIcon(token.reserve.symbol)
                  "
                  :class="[
                    'cc',
                    getIcon(token.reserve.symbol),
                    'cc-icon',
                    'currency-symbol',
                    'token-icon'
                  ]"
                ></span
                ><span v-if="token.reserve">{{ token.reserve.name }}</span>
              </p>
              <p class="mt-4">{{ userSummary.healthFactor || healthFactor }}</p>
              <!-- placeholder -->
              <p class="mt-4">22323</p>
            </div>
          </div>
          <div v-if="!activeDepositTab" class="rate-container">
            <div class="left-container">
              <p>{{ $t('dappsAave.interest-apr') }}</p>
              <p class="mt-4">{{ $t('dappsAave.interest-rate-type') }}</p>
            </div>
            <div class="right-container">
              <p>{{ apr }}%</p>
              <p class="mt-4">{{ rateType }}</p>
            </div>
          </div>
          <hr class="mt-4 mb-4" />
          <div class="btn-container">
            <i18n
              v-if="!isCollateralModal"
              tag="button"
              path="dappsAave.confirm-to"
              @click="takeAction()"
            >
              <span slot="action">
                {{
                  activeDepositTab
                    ? $tc('dappsAave.deposit', 1)
                    : $t('dappsAave.borrow')
                }}
              </span>
            </i18n>
            <button v-if="isCollateralModal">
              {{ $t('dappsAave.confirm') }}
            </button>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import PopOver from '@/components/PopOver';
import BigNumber from 'bignumber.js';
import * as unit from 'ethjs-unit';
import { hasIcon } from '@/partners';
import '@/assets/images/currency/coins/asFont/cryptocoins.css';
import '@/assets/images/currency/coins/asFont/cryptocoins-colors.css';
import { Toast } from '@/helpers';
import { mapState } from 'vuex';
import { calculateHealthFactorFromBalances } from '@aave/protocol-js';

export default {
  components: {
    popover: PopOver
  },
  props: {
    userSummary: {
      type: Object,
      default: () => {
        return {};
      }
    },
    activeDepositTab: {
      type: Boolean,
      default: false
    },
    isCollateralModal: {
      type: Boolean,
      default: false
    },
    amount: {
      type: String,
      default: ''
    },
    token: {
      type: Object,
      default: () => {
        return {};
      }
    },
    apr: {
      type: String,
      default: ''
    },
    rateType: {
      type: String,
      default: ''
    },
    healthFactor: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('main', ['online'])
  },
  mounted() {
    if (this.online) {
      this.getEthPrice();
    }
  },
  methods: {
    // calculateNextHealthFactor() {
    //   this.userSummary.totalBorrowsETH + this.userSummary.totalFeesETH
    //   calculateHealthFactorFromBalances()
    // },
    convertToFixed(val, int) {
      if (!val) {
        return 0;
      }
      return val.slice(0, val.indexOf('.') + int);
    },
    getIcon(currency) {
      return hasIcon(currency);
    },
    takeAction() {
      const param = {
        address: this.token.id,
        amount: unit.toWei(this.amount, 'ether').toString(),
        referralCode: 0
      };

      // new BigNumber(unit.toWei(this.amount, 'ether')).toString()

      console.error('this', this.token)

      if (!this.activeDepositTab) {
        param['rate'] = this.selectStable ? 0 : 1;
      }

      this.$emit('emitTakeAction', param);
    },
    convertToUSD(balance) {
      let usdBalance = 0;
      if (balance) {
        const ethBalance = new BigNumber(balance).times(
          new BigNumber(this.token.price.priceInEth)
        );
        usdBalance = new BigNumber(ethBalance).times(this.ethPrice).toFixed(2);
      }
      return usdBalance;
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
@import 'ConfirmationModal.scss';
</style>
