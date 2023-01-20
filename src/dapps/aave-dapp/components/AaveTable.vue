<template>
  <div>
    <v-row class="align-end justify-space-between">
      <!--
      =====================================================================================
        Search Data
      =====================================================================================
      -->
      <v-col v-if="hasSearch" cols="12" sm="6">
        <mew-search
          placeholder="Search Token Symbol"
          :value="searchInput"
          @input="setSearchInput"
        />
      </v-col>
      <!--
      =====================================================================================
        Toggle: All/Stable
      =====================================================================================
      -->
      <div v-if="hasToggle" class="align-end justify-center pa-3">
        <v-btn-toggle
          v-model="toggleType"
          mandatory
          active-class="buttonToggleDark white--text"
        >
          <v-btn small>All</v-btn>
          <v-btn small>Stable</v-btn>
        </v-btn-toggle>
      </div>
      <!--
      =====================================================================================
        Table
      =====================================================================================
      -->
      <v-col cols="12">
        <mew-table
          :has-color="false"
          :table-headers="header"
          :table-data="listData"
          no-data-text="You currently don't have any tokens."
          :loading="isLoadingData"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {
  AAVE_TABLE_TITLE,
  INTEREST_TYPES,
  AAVE_TABLE_BUTTON,
  AAVE_TABLE_HEADER
} from '@/dapps/aave-dapp/handlers/helpers';
import BigNumber from 'bignumber.js';
import { mapGetters } from 'vuex';
import {
  formatFloatingPointValue,
  formatPercentageValue
} from '@/core/helpers/numberFormatHelper';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import handlerAave from '../handlers/handlerAave.mixin';
import { EventBus } from '@/core/plugins/eventBus';

export default {
  name: 'AaveTable',
  mixins: [handlerAave],
  props: {
    title: {
      type: String,
      default: AAVE_TABLE_TITLE.deposit
    },
    hasSearch: {
      type: Boolean,
      default: true
    },
    hasToggle: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      searchInput: '',
      toggleType: 0
    };
  },
  computed: {
    ...mapGetters('global', ['network', 'getFiatValue']),
    ...mapGetters('wallet', ['balanceInETH', 'tokensList']),
    userReservesData() {
      return this.userSummary?.userReservesData || [];
    },
    header() {
      switch (this.title) {
        case AAVE_TABLE_TITLE.deposit:
          return AAVE_TABLE_HEADER.deposit;
        case AAVE_TABLE_TITLE.borrow:
          return AAVE_TABLE_HEADER.borrow;
        case AAVE_TABLE_TITLE.balance_deposit:
          return AAVE_TABLE_HEADER.balanceDeposit;
        default:
          return AAVE_TABLE_HEADER.balanceBorrow;
      }
    },
    stableCoins() {
      if (!this.isLoadingData) {
        const stableCoins = ['TUSD', 'DAI', 'USDT', 'USDC', 'sUSD'];
        const reserves = this.list?.filter(item => {
          if (stableCoins.includes(item.symbol)) return item;
        });
        return reserves;
      }
      return [];
    },

    list() {
      if (
        this.title === AAVE_TABLE_TITLE.deposit ||
        this.title === AAVE_TABLE_TITLE.borrow
      ) {
        return this.reservesData;
      }
      if (this.title === AAVE_TABLE_TITLE.balance_borrow) {
        return this.userReservesData.filter(item =>
          new BigNumber(item.totalBorrows).gt(0)
        );
      }
      if (this.title === AAVE_TABLE_TITLE.balance_deposit) {
        return this.userReservesData.filter(item =>
          new BigNumber(item.scaledATokenBalance).gt(0)
        );
      }

      return {};
    },

    /**
     * Returns formatted list of table data
     * Filters through search requests
     */
    listData() {
      if (!this.isLoadingData) {
        let list = this.toggleType ? this.stableCoins : this.list;
        const userReserves = this.userReservesData;
        switch (this.title) {
          /**
           * Case: Aave Deposits Table used in Overlay
           */
          case AAVE_TABLE_TITLE.deposit:
            list = list.map(item => {
              /* Get How much user has already deposited */
              const userDeposited = userReserves.find(uItem => {
                if (uItem.reserve.symbol === item.symbol) {
                  return uItem;
                }
              });
              /* Get User Balance for the item */
              const findBalance =
                item.symbol === 'ETH'
                  ? this.balanceInETH
                  : this.tokensList.find(balance => {
                      if (item.symbol === balance.symbol) return balance;
                    });
              const userBalance = findBalance ? findBalance.balancef : 0;
              const depositObj = Object.assign({}, AAVE_TABLE_BUTTON.deposit);
              depositObj.disabled = new BigNumber(userBalance).lte(0);

              AAVE_TABLE_BUTTON.swap.method = this.onSwapClick;
              return {
                price: item.price,
                token: item.symbol,
                available: userBalance
                  ? formatFloatingPointValue(userBalance).value
                  : '0',
                deposited: userDeposited
                  ? formatFloatingPointValue(userDeposited.underlyingBalance)
                      .value
                  : '0',
                apy: this.getDepositAPY(item.liquidityRate),
                tokenImg: `${item.icon}`,
                address: item.aToken.id,
                callToAction: [depositObj, AAVE_TABLE_BUTTON.swap]
              };
            });
            break;
          /**
           * Case: Aave Borrow Table used in Overlay
           */
          case AAVE_TABLE_TITLE.borrow:
            list = list.reduce((arr, item) => {
              if (item.borrowingEnabled) {
                const available = formatFloatingPointValue(
                  this.userBorrowPower(item)
                ).value;
                arr.push({
                  token: item.symbol,
                  available: available, // need to double check this
                  stableApy: item.stableBorrowRateEnabled
                    ? formatPercentageValue(
                        new BigNumber(item.stableBorrowAPY).multipliedBy(100)
                      ).value
                    : '--',
                  variableApy: formatPercentageValue(
                    new BigNumber(item.variableBorrowAPY).multipliedBy(100)
                  ).value,
                  tokenImg: `${item.icon}`,
                  address: item.aToken.id,
                  callToAction: [
                    {
                      ...AAVE_TABLE_BUTTON.borrow,
                      disabled: new BigNumber(available).lte(0)
                    }
                  ]
                });
              }
              return arr;
            }, []);
            break;
          /**
           * Case: Aave Existing Deposits Table
           */
          case AAVE_TABLE_TITLE.balance_deposit:
            list = list.map(item => {
              AAVE_TABLE_BUTTON.withdraw.method = this.onWithdrawClick;
              AAVE_TABLE_BUTTON.deposit.method = this.onDepositClick;
              const enableToggle = item.reserve.usageAsCollateralEnabled;
              return {
                token: item.reserve.symbol,
                tokenImg: `${item.reserve.icon}`,
                balance: [
                  `${formatFloatingPointValue(item.underlyingBalance).value} ${
                    item.reserve.symbol
                  }`,
                  this.getFiatValue(
                    this.formatUSDValue(item.underlyingBalanceUSD)
                  )
                ],
                apy: this.getDepositAPY(item.reserve.liquidityRate),
                toggle: enableToggle
                  ? {
                      color: 'secondary',
                      method: this.onToggleClick,
                      value: item.usageAsCollateralEnabledOnUser
                    }
                  : null,
                callToAction: [
                  AAVE_TABLE_BUTTON.deposit,
                  AAVE_TABLE_BUTTON.withdraw
                ]
              };
            });
            break;
          /**
           * Case: Aave Existing Borrowings Table
           */
          case AAVE_TABLE_TITLE.balance_borrow:
            list = list.map(item => {
              AAVE_TABLE_BUTTON.repay.method = this.onRepayClick;
              AAVE_TABLE_BUTTON.borrow.method = this.onBorrowClick;
              const isVariable = item.variableBorrows > 0;
              const reserve = this.reservesData.find(reserve => {
                return reserve.symbol === item.reserve.symbol;
              });
              const enableToggle = reserve
                ? reserve.stableBorrowRateEnabled
                : false;
              const available = formatFloatingPointValue(
                this.userBorrowPower(reserve)
              ).value;
              const borrowObj = Object.assign({}, AAVE_TABLE_BUTTON.borrow);
              borrowObj.disabled =
                !reserve.borrowingEnabled || new BigNumber(available).lte(0);
              return {
                token: item.reserve.symbol,
                tokenImg: `${item.reserve.icon}`,
                balance: [
                  `${formatFloatingPointValue(item.totalBorrows).value} ${
                    item.reserve.symbol
                  }`,
                  this.getFiatValue(this.formatUSDValue(item.totalBorrowsUSD))
                ],
                apy: formatPercentageValue(
                  new BigNumber(
                    isVariable
                      ? item.reserve.variableBorrowAPY
                      : item.reserve.stableBorrowAPY
                  )
                    .times(100)
                    .toString()
                ).value,
                toggle: enableToggle
                  ? {
                      color: 'greenPrimary',
                      method: this.onToggleAprType,
                      value: isVariable,
                      label: isVariable
                        ? INTEREST_TYPES.variable
                        : INTEREST_TYPES.stable,
                      disabled: false
                    }
                  : null,
                callToAction: [borrowObj, AAVE_TABLE_BUTTON.repay]
              };
            });
            break;
          default:
            break;
        }
        return this.searchInput === null || this.searchInput === ''
          ? list
          : list.filter(item => {
              if (
                item.token
                  .toLowerCase()
                  .includes(this.searchInput.toLowerCase())
              )
                return item;
            });
      }
      return [];
    }
  },
  mounted() {
    /* Set Button styles to transparent for balance deposit table */
    if (
      this.title === AAVE_TABLE_TITLE.balance_deposit ||
      this.title === AAVE_TABLE_TITLE.balance_borrow
    ) {
      AAVE_TABLE_BUTTON.deposit.btnStyle = 'transparent';
      AAVE_TABLE_BUTTON.withdraw.btnStyle = 'transparent';
      AAVE_TABLE_BUTTON.borrow.btnStyle = 'transparent';
    }
    AAVE_TABLE_BUTTON.deposit.method = this.onDepositClick;
    AAVE_TABLE_BUTTON.borrow.method = this.onBorrowClick;
  },
  methods: {
    /**
     * Calculates Deposit APY
     */
    getDepositAPY(liqRate) {
      const ray = Math.pow(10, 27);
      const SECONDS_PER_YEAR = 31536000;
      const depositAPR = new BigNumber(liqRate).dividedBy(ray).toFixed();
      const depositAPY =
        Math.pow(1 + depositAPR / SECONDS_PER_YEAR, SECONDS_PER_YEAR) - 1;
      return formatPercentageValue(new BigNumber(depositAPY).multipliedBy(100))
        .value;
    },
    /**
     * Method emits to the parent to open deposit token overlay
     *  Used in deposit Button within the table
     */
    onDepositClick(newVal) {
      EventBus.$emit('selectedDeposit', newVal);
    },
    /**
     * Method emits to the parent to open deposit token overlay
     *  Used in deposit Button within the table
     */
    onBorrowClick(newVal) {
      EventBus.$emit('selectedBorrow', newVal);
    },
    /**
     * Method emits to the parent to open withdraw token overlay
     *  Used in withdraw Button within the table
     */
    onWithdrawClick(newval) {
      EventBus.$emit('withdrawToken', newval);
    },
    /**
     * Method open new tab with swap parameters
     *  Used in Swap Button within the table
     */
    onSwapClick(newVal) {
      this.$router.push({
        name: ROUTES_WALLET.SWAP.NAME,
        query: {
          fromToken: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          toToken: newVal.address,
          amount: '1'
        }
      });
    },

    /**
     * Method emits to the parent to open repay overlay
     * Used in Repay Button borrowed token within the table
     * Within Borrow Balance table
     */
    onRepayClick(newVal) {
      EventBus.$emit('repayBorrowing', newVal);
    },
    /**
     * Method emits to the parent to open collateral overlay
     * Used in Toggle Button within the table
     * Within Deposit Balance table
     */
    onToggleClick(newVal) {
      EventBus.$emit('collateralChange', newVal);
    },

    onToggleAprType(newVal) {
      EventBus.$emit('changeAprType', newVal);
    },
    /**
     * Method sets the search value
     */
    setSearchInput(val) {
      this.searchInput = val;
    }
  }
};
</script>
