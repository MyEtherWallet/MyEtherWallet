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
              :src="iconFetcher(token.symbol)"
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
                <popover
                  class="ml-1"
                  :popcontent="$t('dappsAave.health-factor-popover')"
                />
              </p>
              <p class="mt-4">
                {{ $t('dappsAave.next-health') }}
                <popover
                  class="ml-1"
                  :popcontent="$t('dappsAave.next-health-factor-popover')"
                />
              </p>
            </div>
            <div class="right-container">
              <p v-if="isCollateralModal" class="currency-title">
                <img
                  v-if="token.symbol && !getIcon(token.symbol)"
                  class="token-icon-col"
                  :src="iconFetcher(token.symbol)"
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
                {{ convertToFixed(currentHealthFactor) }}
              </p>
              <p class="mt-4">
                <i
                  v-if="
                    isNextHealthDecrease() &&
                      convertToFixed(currentHealthFactor) !==
                        calculateNextHealthFactor()
                  "
                  class="arrow fa fa-arrow-down"
                  aria-hidden="true"
                ></i
                ><i
                  v-if="
                    !isNextHealthDecrease() &&
                      convertToFixed(currentHealthFactor) !==
                        calculateNextHealthFactor()
                  "
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
              <p>{{ $t('dappsAave.interest-apy') }}</p>
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
      },
      currentHealthFactor: this.userSummary.healthFactor
        ? this.userSummary.healthFactor
        : this.healthFactor
    };
  },
  computed: {
    ...mapState('main', ['online', 'account'])
  },
  mounted() {
    if (this.online) {
      this.getEthPrice();
    }
  },
  methods: {
    iconFetcher(currency) {
      let icon;
      try {
        // eslint-disable-next-line
        icon = require(`@/assets/images/currency/coins/AllImages/${currency.toUpperCase()}.svg`);
      } catch (e) {
        // eslint-disable-next-line
        return require(`@/assets/images/icons/web-solution.svg`);
      }
      return icon;
    },
    isNextHealthDecrease() {
      if (
        new BigNumber(this.calculateNextHealthFactor()).lt(
          new BigNumber(this.currentHealthFactor)
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
      let nextHealthFactor = this.convertToFixed(this.currentHealthFactor),
        collateralBalanceETH = this.userSummary.totalCollateralETH,
        totalBorrowsETH = this.userSummary.totalBorrowsETH;

      if (this.token.price && this.amount) {
        const ethBalance = this.getEthBalance(this.amount);
        if (this.actionTitle === this.actionTitles.deposit) {
          collateralBalanceETH = new BigNumber(
            this.userSummary.totalCollateralETH
          ).plus(ethBalance);
        } else if (this.actionTitle === this.actionTitles.withdraw) {
          collateralBalanceETH = new BigNumber(
            this.userSummary.totalCollateralETH
          ).minus(ethBalance);
        } else if (this.actionTitle === this.actionTitles.repay) {
          totalBorrowsETH = new BigNumber(
            this.userSummary.totalBorrowsETH
          ).minus(ethBalance);
        }

        nextHealthFactor = calculateHealthFactorFromBalancesBigUnits(
          collateralBalanceETH,
          totalBorrowsETH,
          this.userSummary.totalFeesETH,
          this.userSummary.currentLiquidationThreshold
        ).toFixed(3);

        nextHealthFactor = nextHealthFactor < 0 ? '-' : nextHealthFactor;
      }

      return nextHealthFactor;
    },
    convertToFixed(val) {
      if (val < 0) {
        return '-';
      }

      if (!val || val === 0) {
        return 0;
      }
      return new BigNumber(val).toFixed(3).toString();
    },
    getIcon(currency) {
      return hasIcon(currency);
    },
    checkForAmount() {
      if (
        this.actionTitle === this.actionTitles.withdraw &&
        this.token.user.principalATokenBalance === this.amount
      ) {
        const underlyingBalance = new BigNumber(
          this.token.user.currentUnderlyingBalance
        );
        const availableLiquidity = new BigNumber(this.token.availableLiquidity);
        let maxAmountToWithdraw = BigNumber.min(
          underlyingBalance,
          availableLiquidity
        );

        if (
          this.userSummary.totalBorrowsETH !== '0' ||
          this.userSummary.totalFeesETH !== '0'
        ) {
          maxAmountToWithdraw = BigNumber.min(
            maxAmountToWithdraw,
            new BigNumber(this.userSummary.maxAmountToWithdrawInEth)
              .dividedBy(this.token.price.priceInEth)
              .multipliedBy(0.995)
          );
          if (!maxAmountToWithdraw.eq(underlyingBalance)) {
            return new BigNumber(maxAmountToWithdraw).toFixed(6);
          }
        }
      } else if (
        this.actionTitle === this.actionTitles.repay &&
        this.amount === this.token.user.currentBorrows
      ) {
        const amount = new BigNumber(this.amount).plus(
          new BigNumber(this.amount).times(0.005)
        );
        return amount < this.token.tokenBalance
          ? amount
          : this.token.tokenBalance;
      } else if (
        this.actionTitle === this.actionTitles.borrow &&
        this.maxBorrowAmt() === this.amount &&
        this.userSummary.totalBorrowsETH > 0
      ) {
        const margin = new BigNumber(this.amount).times(0.005);
        return new BigNumber(this.amount).minus(margin);
      }
      return this.amount;
    },
    maxBorrowAmt() {
      return new BigNumber(this.userSummary.availableBorrowsETH).div(
        this.token.price.priceInEth
      );
    },
    takeAction() {
      const param = {
        symbol: this.token.symbol,
        type: this.isCollateralModal ? 'Collateral' : this.actionTitle,
        data: {}
      };
      if (this.isCollateralModal) {
        param.data.usageAsCollateral = !this.token.usageAsCollateralEnabled;
      } else {
        param.data.amount = this.checkForAmount();
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
