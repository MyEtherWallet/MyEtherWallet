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
        method: this.onDepositClick
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
          return this.tableBorrowHeader;
      }
    },

    stableCoins() {
      const stableCoins = ['TUSD', 'DAI', 'USDT', 'USDC', 'sUSD'];
      const reserves = this.list?.filter(item => {
        if (stableCoins.includes(item.symbol)) return item;
      });
      return reserves;
    },

    list() {
      if (this.handler) {
        const reserves =
          this.tableHeader === AAVE_TABLE_HEADER.DEPOSIT ||
          this.tableHeader === AAVE_TABLE_HEADER.BORROW
            ? this.handler.reservesData
            : this.handler.userSummary.reservesData;
        return reserves;
      }
      return undefined;
    },

    /**
     * Returns true if the data has not been loaded yet
     */
    isLoading() {
      return this.list === undefined || this.list === null;
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
                      if (item.symbol === balance.symbol) {
                        return balance.balance;
                      }
                    });

              /* If !balance or balance = 0, disable deposit button */
              const depositButton = Object.assign(this.btnDeposit);
              depositButton.disabled =
                !userBalance || new BigNumber(userBalance).lte(0);

              return {
                token: item.symbol,
                available: userBalance ? roundNumber(userBalance) : '0',
                deposited: userDeposited
                  ? roundNumber(userDeposited.currentUnderlyingBalance)
                  : '0',
                apr: roundPercentage(item.liquidityRate),
                tokenImg: item.icon,
                address: item.aToken.id,
                callToAction: [depositButton, this.btnSwap]
              };
            });
            break;
          /**
           * Case: Aave Exhisting Deposits Table
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

                tokenImg: item.icon,
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
                tokenImg: item.reserve.icon,
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
    if (this.tableHeader === AAVE_TABLE_HEADER.BALANCE_DEPOSIT) {
      this.btnDeposit.btnStyle = 'transparent';
      this.btnWithdraw.btnStyle = 'transparent';
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
      this.$mit('selectedBorrow', newVal);
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
        name: 'Swap',
        query: {
          fromT: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          toT: newVal.address,
          amount: '1'
        }
      });
    },
    /**
     * Methodemits to the parent to open collateral overlay
     * Used in Toggle Button within the table
     * Within Deposit Balance table
     */
    onToggleClick(newVal) {
      this.$emit('collateralChange', newVal);
    }
  }
};
</script>
