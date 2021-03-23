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

import { mapGetters } from 'vuex';
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
        method: this.onTableClick
      },
      btnSwap: {
        title: 'Swap',
        btnStyle: 'outline',
        colorTheme: 'primary',
        method: this.onTableClick
      },
      btnBorrow: {
        btnStyle: 'background',
        colorTheme: 'primary',
        method: this.onTableClick
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
      /* Dummy Data to display */
      dummyBorrow: [
        {
          token: 'ALS',
          available: '400000',
          stableAPR: '3.7%',
          variableApr: '1200005.5%',
          tokenImg:
            'https://assets.coingecko.com/coins/images/981/large/kick.png?1568643013'
        },
        {
          token: 'ABC',
          available: '4000.00005675671',
          stableAPR: '3.5%',
          variableApr: '5.55465%',
          tokenImg:
            'https://assets.coingecko.com/coins/images/981/large/kick.png?1568643013'
        },
        {
          token: 'LGS',
          stableAPR: '6.5%',
          variableApr: '5.55465%',
          apr: '0.5763%',
          tokenImg:
            'https://assets.coingecko.com/coins/images/981/large/kick.png?1568643013'
        },
        {
          token: 'ASD',
          stableAPR: '76.5%',
          variableApr: '3.55465%',
          tokenImg:
            'https://assets.coingecko.com/coins/images/981/large/kick.png?1568643013'
        }
      ]
    };
  },
  computed: {
    ...mapGetters('global', ['network']),
    header() {
      switch (this.tableHeader) {
        case AAVE_TABLE_HEADER.DEPOSIT:
          return this.tableDepositHeader;
        case AAVE_TABLE_HEADER.BORROW:
          return this.tableBorrowHeader;
        default:
          return this.tableBorrowHeader;
      }
    },

    // List item from handler
    // returns specific list depending on
    // whether borrow or deposit

    list() {
      const reserves =
        this.tableHeader === AAVE_TABLE_HEADER.DEPOSIT
          ? this.handler?.reservesData
          : this.handler?.userSummary.reservesData;
      return reserves;
    },

    reserveCoins() {
      const stableCoins = ['TUSD', 'DAI', 'USDT', 'USDC', 'sUSD'];
      const reserves = this.handler?.reservesData.filter(item => {
        if (stableCoins.includes(item.symbol)) return item;
      });
      return reserves;
    },

    /**
     * Returns formatted list of table data
     * Filters through search requests
     */
    listData() {
      const list = this.toggleType ? this.reserveCoins : this.list;
      const filteredList = list.map(item => {
        return {
          token: item.symbol,
          available: roundNumber(item.availableLiquidity),
          deposited: roundNumber(item.deposited),
          apr: roundPercentage(item.liquidityRate),
          tokenImg: item.icon,
          callToAction: [this.btnDeposit, this.btnSwap]
        };
      });
      return this.searchInput === null || this.searchInput === ''
        ? filteredList
        : filteredList.filter(item =>
            item.token.toLowerCase().includes(this.searchInput)
          );
    }
  },
  methods: {
    onTableClick(val) {
      console.log(val);
    }
  }
};
</script>
