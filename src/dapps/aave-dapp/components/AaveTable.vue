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
    }
  },
  data() {
    return {
      searchInput: '',
      toggleType: 0,
      buttnDeposit: {
        title: 'Deposit',
        btnStyle: 'background',
        colorTheme: 'primary'
      },
      btnSwap: {
        title: 'Swap',
        btnStyle: 'outline',
        colorTheme: 'primary'
      },
      btnBorrow: {
        btnStyle: 'background',
        colorTheme: 'primary'
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

    /**
     * Returns formatted list of table data
     * Filters through search requests
     */
    listData() {
      const list = this.dummy.map(item => {
        return {
          token: item.token,
          available: roundNumber(item.available),
          deposited: roundNumber(item.deposited),
          apr: roundPercentage(item.apr),
          tokenImg: item.tokenImg,
          callToAction: [this.buttnDeposit, this.btnSwap]
        };
      });
      return this.searchInput === null || this.searchInput === ''
        ? list
        : list.filter(item =>
            item.token.toLowerCase().includes(this.searchInput)
          );
    }
  }
};
</script>
