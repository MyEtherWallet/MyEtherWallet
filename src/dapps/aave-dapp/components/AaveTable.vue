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
      <v-col v-else cols="12">
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

export default {
  name: 'AaveTable',
  props: {
    tableHeader: {
      type: String,
      default: AAVE_TABLE_HEADER.DEPOSIT
    },
    tableData: {
      type: Array,
      default: () => []
    },
    hasSearch: {
      type: Boolean,
      default: true
    },
    hasToggle: {
      type: Boolean,
      default: true
    },
    isLoading: {
      type: Boolean,
      default: false
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
          sortable: true,
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
          sortable: true,
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
          sortable: true,
          width: '15%'
        },
        {
          text: 'Variable APR',
          value: 'variableApr',
          sortable: true,
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
      /* Dummy Data to display */
      dummy: [
        {
          token: 'ALS',
          available: '400000',
          deposited: '3',
          apr: '1200005.5%',
          tokenImg:
            'https://assets.coingecko.com/coins/images/981/large/kick.png?1568643013'
        },
        {
          token: 'ABC',
          available: '4000.00005675671',
          deposited: '3',
          apr: '5.55465%',
          tokenImg:
            'https://assets.coingecko.com/coins/images/981/large/kick.png?1568643013'
        },
        {
          token: 'LGS',
          available: '15.5763',
          deposited: '3',
          apr: '0.5763%',
          tokenImg:
            'https://assets.coingecko.com/coins/images/981/large/kick.png?1568643013'
        }
      ],
      tempIcon:
        'https://assets.coingecko.com/coins/images/981/large/kick.png?1568643013'
    };
  },
  mounted() {
    if (this.tableHeader === AAVE_TABLE_HEADER.BALANCE_DEPOSIT) {
      this.btnDeposit.btnStyle = 'transparent';
      this.btnWithdraw.btnStyle = 'transparent';
    }
  },
  computed: {
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

    /**
     * Returns formatted list of table data
     * Filters through search requests
     */
    listData() {
      let list = [];
      switch (this.tableHeader) {
        /**
         * Case: Aave Deposits Table used in Overlay
         */
        case AAVE_TABLE_HEADER.DEPOSIT:
          list = this.dummy.map(item => {
            return {
              token: item.token,
              available: roundNumber(item.available),
              deposited: roundNumber(item.deposited),
              apr: roundPercentage(item.apr),
              tokenImg: item.tokenImg,
              callToAction: [this.buttnDeposit, this.btnSwap]
            };
          });
          break;
        case AAVE_TABLE_HEADER.BORROW:
          break;
        /**
         * Case: Aave Exhisting Deposits Table
         */
        case AAVE_TABLE_HEADER.BALANCE_DEPOSIT:
          list = this.tableData.map(item => {
            return {
              token: item.reserve.symbol,
              tokenImg: this.tempIcon,
              balance: [
                `${roundNumber(item.currentUnderlyingBalance)} ${
                  item.reserve.symbol
                }`,
                `$${roundNumber(item.currentUnderlyingBalanceUSD)}`
              ],
              toggle: {
                color: 'primary',
                label: 'Label',
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

      return list;
    }
  },
  methods: {
    /**
     * Method emits to the parent to open deposit token overlay
     *  Used in deposit Button within the table
     */
    onDepositClick(newVal) {
      this.$emit('depositToken', newVal);
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
      console.log(newVal);
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

