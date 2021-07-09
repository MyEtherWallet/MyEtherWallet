<template>
  <div>
    <v-row class="align-end justify-space-between">
      <!--
      =====================================================================================
        Search Data
      =====================================================================================
      -->
      <v-col v-if="hasSearch" cols="12" sm="6">
        <mew-search placeholder="Search Token Symbol" :value="searchInput" />
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
          active-class="titlePrimary white--text alig-end"
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
          :loading="isLoading"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {
  roundNumber,
  roundPercentage,
  AAVE_TABLE_HEADER
} from '@/dapps/aave-dapp/handlers/helpers';
import BigNumber from 'bignumber.js';
import { mapGetters } from 'vuex';
import { ROUTES_WALLET } from '@/core/router/config-routes';

export default {
  name: 'AaveTable',
  props: {
    tableHeader: {
      type: String,
      default: AAVE_TABLE_HEADER.DEPOSIT
    },
    hasSearch: {
      type: Boolean,
      default: true
    },
    hasToggle: {
      type: Boolean,
      default: true
    },
    handler: {
      type: [Object, null],
      validator: item => typeof item === 'object' || null,
      default: () => {}
    }
  },
  data() {
    return {
      searchInput: '',
      toggleType: 0,
      btnDeposit: {
        title: 'Deposit',
        btnStyle: 'background',
        colorTheme: 'primary',
        method: this.onDepositClick,
        disabled: false
      },
      btnSwap: {
        title: 'Swap',
        btnStyle: 'outline',
        colorTheme: 'primary',
        method: this.onSwapClick
      },
      btnBorrow: {
        title: 'Borrow',
        btnStyle: 'background',
        colorTheme: 'primary',
        method: this.onBorrowClick
      },
      btnWithdraw: {
        title: 'Withdraw',
        btnStyle: 'outline',
        colorTheme: 'primary',
        method: this.onWithdrawClick
      },
      btnRepay: {
        title: 'Repay',
        btnStyle: 'transparent',
        colorTheme: 'primary',
        method: this.onRepayClick
      },
      tableDepositHeader: [
        {
          text: 'Token',
          value: 'token',
          sortable: true,
          width: '15%'
        },
        {
          text: 'Available',
          value: 'available',
          sortable: true
        },
        {
          text: 'Deposited',
          value: 'deposited',
          sortable: true
        },
        {
          text: 'APR',
          value: 'apr',
          sortable: false,
          width: '14%'
        },
        {
          text: '',
          value: 'callToAction',
          sortable: false,
          width: '32%'
        }
      ],
      tableBorrowHeader: [
        {
          text: 'Token',
          value: 'token',
          sortable: false,
          width: '15%'
        },
        {
          text: 'Available',
          value: 'available',
          sortable: true
        },
        {
          text: 'Stable APR',
          value: 'stableApr',
          sortable: false,
          width: '15%'
        },
        {
          text: 'Variable APR',
          value: 'variableApr',
          sortable: false,
          width: '15%'
        },
        {
          text: '',
          value: 'callToAction',
          sortable: false,
          width: '32%'
        }
      ],
      tableBalanceDepositHeader: [
        {
          text: 'Token',
          value: 'token',
          sortable: false,
          filterable: false
        },
        {
          text: 'Deposited',
          value: 'balance',
          sortable: false,
          filterable: false
        },
        {
          text: 'Use as collateral',
          value: 'toggle',
          sortable: false,
          filterable: false
        },
        {
          text: '',
          value: 'callToAction',
          sortable: false,
          filterable: false,
          containsLink: true,
          width: '32%'
        }
      ],
      tableBalanceBorrowHeader: [
        {
          text: 'Token',
          value: 'token',
          sortable: false,
          filterable: false
        },
        {
          text: 'Borrowed',
          value: 'balance',
          sortable: false,
          filterable: false
        },
        {
          text: 'APR',
          value: 'apr',
          sortable: false,
          filterable: false,
          containsLink: true
        },
        {
          text: 'APR Type',
          value: 'toggle',
          sortable: false,
          filterable: false
        },
        {
          text: '',
          value: 'callToAction',
          sortable: false,
          filterable: false,
          containsLink: true,
          width: '32%'
        }
      ]
    };
  },
  computed: {
    ...mapGetters('global', ['network']),
    ...mapGetters('wallet', ['balanceInETH', 'tokensList']),
    header() {
      switch (this.tableHeader) {
        case AAVE_TABLE_HEADER.DEPOSIT:
          return this.tableDepositHeader;
        case AAVE_TABLE_HEADER.BORROW:
          return this.tableBorrowHeader;
        case AAVE_TABLE_HEADER.BALANCE_DEPOSIT:
          return this.tableBalanceDepositHeader;
        default:
          return this.tableBalanceBorrowHeader;
      }
    },
    /**
     * Returns true if the data has not been loaded yet
     */
    isLoading() {
      return this.handler.isLoading;
    },

    stableCoins() {
      if (!this.isLoading) {
        const stableCoins = ['TUSD', 'DAI', 'USDT', 'USDC', 'sUSD'];
        const reserves = this.list?.filter(item => {
          if (stableCoins.includes(item.symbol)) return item;
        });
        return reserves;
      }
      return [];
    },

    list() {
      if (!this.isLoading) {
        if (
          this.tableHeader === AAVE_TABLE_HEADER.DEPOSIT ||
          this.tableHeader === AAVE_TABLE_HEADER.BORROW
        ) {
          return this.handler.reservesData;
        }
        if (this.tableHeader === AAVE_TABLE_HEADER.BALANCE_BORROW) {
          return this.handler.userSummary.reservesData.filter(item =>
            new BigNumber(item.currentBorrows).gt(0)
          );
        }
        return this.handler.userSummary.reservesData.filter(item => {
          return new BigNumber(item.principalATokenBalance).gt(0);
        });
      }
      return undefined;
    },

    /**
     * Returns formatted list of table data
     * Filters through search requests
     */
    listData() {
      if (!this.isLoading) {
        let list = this.toggleType ? this.stableCoins : this.list;
        const userReserves = this.handler.userSummary.reservesData;
        switch (this.tableHeader) {
          /**
           * Case: Aave Deposits Table used in Overlay
           */
          case AAVE_TABLE_HEADER.DEPOSIT:
            list = list.map(item => {
              /* Get How much user has already deposited */
              const userDeposited = userReserves.find(uItem => {
                if (uItem.reserve.symbol === item.symbol) {
                  return uItem;
                }
              });

              /* Get User Balance for the item */
              const userBalance =
                item.symbol === 'ETH'
                  ? this.balanceInETH
                  : this.tokensList.find(balance => {
                      return item.symbol === balance.symbol;
                    });
              /* If !balance or balance = 0, disable deposit button */
              const depositButton = Object.assign({}, this.btnDeposit);
              depositButton['disabled'] = userBalance
                ? BigNumber(userBalance).lte(0)
                : true;
              return {
                token: item.symbol,
                available: userBalance ? roundNumber(userBalance) : '0',
                deposited: userDeposited
                  ? roundNumber(userDeposited.currentUnderlyingBalance)
                  : '0',
                apr: roundPercentage(item.liquidityRate),
                tokenImg: `${item.icon}`,
                address: item.aToken.id,
                callToAction: [depositButton, this.btnSwap]
              };
            });
            break;
          /**
           * Case: Aave Borrow Table used in Overlay
           */
          case AAVE_TABLE_HEADER.BORROW:
            list = list.map(item => {
              return {
                token: item.symbol,
                available: roundNumber(item.availableLiquidity),
                stableApr: item.stableBorrowRateEnabled
                  ? roundPercentage(
                      new BigNumber(item.stableBorrowRate)
                        .multipliedBy(100)
                        .toString()
                    )
                  : '--',
                variableApr: roundPercentage(
                  new BigNumber(item.variableBorrowRate)
                    .multipliedBy(100)
                    .toString()
                ),

                tokenImg: `${item.icon}`,
                address: item.aToken.id,
                callToAction: [this.btnBorrow]
              };
            });
            break;
          /**
           * Case: Aave Exhisting Deposits Table
           */
          case AAVE_TABLE_HEADER.BALANCE_DEPOSIT:
            list = list.map(item => {
              return {
                token: item.reserve.symbol,
                tokenImg: `${item.reserve.icon}`,
                balance: [
                  `${roundNumber(item.currentUnderlyingBalance)} ${
                    item.reserve.symbol
                  }`,
                  `$${roundNumber(item.currentUnderlyingBalanceUSD)}`
                ],
                toggle: {
                  color: 'secondary',
                  method: this.onToggleClick,
                  value: item.usageAsCollateralEnabledOnUser
                },
                callToAction: [this.btnDeposit, this.btnWithdraw]
              };
            });
            break;
          /**
           * Case: Aave Exhisting Borrowings Table
           */
          case AAVE_TABLE_HEADER.BALANCE_BORROW:
            list = list.map(item => {
              const isVariable = item.borrowRateMode === 'Variable';
              const reserve = this.handler.reservesData.find(reserve => {
                return reserve.symbol === item.reserve.symbol;
              });
              const enableToggle = reserve
                ? !reserve.stableBorrowRateEnabled
                : false;
              return {
                token: item.reserve.symbol,
                tokenImg: `${item.reserve.icon}`,
                balance: [
                  `${roundNumber(item.currentBorrows)} ${item.reserve.symbol}`,
                  `$${roundNumber(item.currentBorrowsUSD)}`
                ],
                apr: roundPercentage(
                  new BigNumber(item.borrowRate).multipliedBy(100).toString()
                ),
                toggle: {
                  color: isVariable ? 'secondary' : 'primary',
                  method: this.onToggleAprType,
                  value: isVariable,
                  label: isVariable ? 'variable' : 'stable',
                  disabled: enableToggle
                },
                callToAction: [this.btnBorrow, this.btnRepay]
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
      this.tableHeader === AAVE_TABLE_HEADER.BALANCE_DEPOSIT ||
      this.tableHeader === AAVE_TABLE_HEADER.BALANCE_BORROW
    ) {
      this.btnDeposit.btnStyle = 'transparent';
      this.btnWithdraw.btnStyle = 'transparent';
      this.btnBorrow.btnStyle = 'transparent';
    }
  },
  methods: {
    /**
     * Method emits to the parent to open deposit token overlay
     *  Used in deposit Button within the table
     */
    onDepositClick(newVal) {
      this.$emit('selectedDeposit', newVal);
    },
    /**
     * Method emits to the parent to open deposit token overlay
     *  Used in deposit Button within the table
     */
    onBorrowClick(newVal) {
      this.$emit('selectedBorrow', newVal);
    },
    /**
     * Method emits to the parent to open withdraw token overlay
     *  Used in withdraw Button within the table
     */
    onWithdrawClick(newval) {
      this.$emit('withdrawToken', newval);
    },
    /**
     * Method open new tab with swap parameters
     *  Used in Swap Button within the table
     */
    onSwapClick(newVal) {
      this.$router.push({
        name: ROUTES_WALLET.SWAP.NAME,
        query: {
          fromT: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          toT: newVal.address,
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
      this.$emit('repayBorrowing', newVal);
    },
    /**
     * Method emits to the parent to open collateral overlay
     * Used in Toggle Button within the table
     * Within Deposit Balance table
     */
    onToggleClick(newVal) {
      this.$emit('collateralChange', newVal);
    },

    onToggleAprType(newVal) {
      this.$emit('changeAprType', newVal);
    }
  }
};
</script>
