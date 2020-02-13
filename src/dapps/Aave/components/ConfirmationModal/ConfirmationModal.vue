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
            <i18n tag="p" class="title" path="dappsAave.amount-to">
              <span slot="action" class="title">{{ actionTitle }}</span>
            </i18n>
            <p class="amount mt-2">
              {{ convertToFixed(amount)
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
          <div
            v-if="actionTitle !== actionTitles.borrow"
            class="health-container"
          >
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
                  v-if="token.symbol && !getIcon(token.symbol)"
                  class="token-icon-col"
                  :src="
                    require(`@/assets/images/currency/coins/AllImages/${token.symbol.toUpperCase()}.svg`)
                  "
                />
                <span
                  v-if="token && getIcon(token.symbol)"
                  :class="[
                    'cc',
                    getIcon(token.symbol),
                    'cc-icon',
                    'currency-symbol',
                    'token-icon-col'
                  ]"
                ></span
                ><span v-if="token">{{ token.name }}</span>
              </p>
              <p class="mt-4 health-factor">
                {{
                  convertToFixed(userSummary.healthFactor) ||
                    convertToFixed(healthFactor)
                }}
              </p>
              <p class="mt-4">
                <i
                  v-if="isNextHealthDecrease()"
                  class="arrow fa fa-arrow-down"
                  aria-hidden="true"
                ></i
                ><i
                  v-if="!isNextHealthDecrease()"
                  class="arrow fa fa-arrow-up"
                  aria-hidden="true"
                ></i>
                {{ calculateNextHealthFactor() }}
              </p>
            </div>
          </div>
          <div
            v-if="actionTitle === actionTitles.borrow"
            class="rate-container"
          >
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
                {{ actionTitle }}
              </span>
            </i18n>
            <button v-if="isCollateralModal" @click="takeAction()">
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
import { hasIcon } from '@/partners';
import '@/assets/images/currency/coins/asFont/cryptocoins.css';
import '@/assets/images/currency/coins/asFont/cryptocoins-colors.css';
import { Toast } from '@/helpers';
import { mapState } from 'vuex';
import { calculateHealthFactorFromBalancesBigUnits } from '@aave/protocol-js';

export default {
  components: {
    popover: PopOver
  },
  props: {
    actionTitle: {
      type: String,
      default: ''
    },
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
  data() {
    return {
      actionTitles: {
        deposit: 'Deposit',
        withdraw: 'Withdraw',
        repay: 'Repay',
        borrow: 'Borrow'
      }
    };
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
    isNextHealthDecrease() {
      const currentHealthFactor =
        this.userSummary.healthFactor || this.healthFactor;
      if (
        new BigNumber(this.calculateNextHealthFactor()).lt(
          new BigNumber(currentHealthFactor)
        )
      ) {
        return true;
      }
      return false;
    },
    getEthBalance(amount) {
      return new BigNumber(amount).times(this.token.price.priceInEth);
    },
    calculateNextHealthFactor() {
      let nextHealthFactor = '',
        collateralBalanceETH = this.userSummary.totalCollateralETH,
        totalBorrowsETH = this.userSummary.totalBorrowsETH;

      if (this.token.price) {
        const ethBalance = this.getEthBalance(this.amount);
        if (this.actionTitle === this.actionTitles.deposit) {
          collateralBalanceETH = new BigNumber(
            this.userSummary.totalCollateralETH
          )
            .plus(ethBalance)
            .toFixed(4);
        } else if (this.actionTitle === this.actionTitles.withdraw) {
          collateralBalanceETH = new BigNumber(
            this.userSummary.totalCollateralETH
          )
            .minus(ethBalance)
            .toFixed(4);
        } else if (this.actionTitle === this.actionTitles.repay) {
          totalBorrowsETH = new BigNumber(this.userSummary.totalBorrowsETH)
            .minus(ethBalance)
            .toFixed(4);
        }

        nextHealthFactor = calculateHealthFactorFromBalancesBigUnits(
          collateralBalanceETH,
          totalBorrowsETH,
          this.userSummary.totalFeesETH,
          this.userSummary.currentLiquidationThreshold
        ).toFixed(2);
      }
      return nextHealthFactor;
    },
    convertToFixed(val) {
      if (!val) {
        return 0;
      }
      return new BigNumber(val).toFixed(2).toString();
    },
    getIcon(currency) {
      return hasIcon(currency);
    },
    takeAction() {
      const param = {
        type: this.isCollateralModal ? 'Collateral' : this.actionTitle,
        data: {}
      };
      if (this.isCollateralModal) {
        param.data.usageAsCollateral = !this.token.usageAsCollateralEnabled;
      } else {
        param.data.amount = this.amount;
      }

      if (this.actionTitle === this.actionTitles.withdraw) {
        param.data.aToken = this.token.aToken.id;
      } else {
        param.data.reserve = this.token.id;
      }

      if (this.actionTitle === this.actionTitles.borrow) {
        param.data['interestRateMode'] = this.selectStable
          ? 'Stable'
          : 'Variable';
      }
      this.$emit('emitTakeAction', param);
    },
    convertToUSD(balance) {
      let usdBalance = 0;
      if (balance) {
        const ethBalance = this.getEthBalance(this.amount);
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
