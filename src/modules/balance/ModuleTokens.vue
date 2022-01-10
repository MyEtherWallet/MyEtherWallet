<template>
  <!--
  =============================================================
  Module Tokens
  =============================================================
  -->
  <div>
    <v-skeleton-loader
      v-if="loading && tokensData"
      class="mx-auto"
      type="table"
    />
    <mew-module
      v-if="!loading && tokensData.length > 0 && !dense"
      subtitle="My Tokens Value"
      :has-body-padding="false"
      :title="`$ ${totalTokensValue}`"
      :icon="require('@/assets/images/icons/icon-token-grey.png')"
      icon-align="left"
    >
      <template #rightHeaderContainer>
        <div>
          <span
            v-if="!hasCustom"
            class="primary--text cursor-pointer pl-3"
            @click="toggleAddCustomToken"
            >+ Custom Token</span
          >
          <mew-menu
            v-else
            activator-text-color="primary--text"
            :list-obj="menuObj"
            @goToPage="customTokenAction"
          />
        </div>
      </template>
      <template #moduleBody>
        <div class="my-8">
          <mew-table
            :has-color="false"
            :table-headers="tableHeaders"
            :table-data="tokensData"
          />
        </div>
      </template>
    </mew-module>
    <mew-table
      v-if="!loading && tokensData.length > 0 && dense"
      :has-color="false"
      :table-headers="tableHeaders"
      :table-data="tokensData"
    />
    <!--
    =====================================================================================
      display if the user has no tokens
    =====================================================================================
    -->
    <balance-empty-block
      v-if="!loading && tokensData.length === 0"
      is-tokens
      :is-eth="isEthNetwork"
    />
    <!--
    =====================================================================================
      add Custom Token form
    =====================================================================================
    -->
    <token-add-custom
      :close="toggleAddCustomToken"
      :open="openAddCustomToken"
    />
    <!--
    =====================================================================================
      delete Custom Token form
    =====================================================================================
    -->
    <token-delete-custom
      :close="toggleDeleteCustomToken"
      :open="openDeleteCustomToken"
    />
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import BalanceEmptyBlock from './components/BalanceEmptyBlock';
import TokenAddCustom from './components/TokenAddCustom';
import TokenDeleteCustom from './components/TokenDeleteCustom';
import { formatFiatValue } from '@/core/helpers/numberFormatHelper';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
export default {
  components: {
    BalanceEmptyBlock,
    TokenDeleteCustom,
    TokenAddCustom
  },
  props: {
    dense: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      openAddCustomToken: false,
      openDeleteCustomToken: false,
      tableHeaders: [
        {
          text: 'Token',
          value: 'token',
          sortable: false,
          width: '20%'
        },
        {
          text: 'Price',
          value: 'price',
          sortable: false,
          width: '20%'
        },
        {
          text: 'Market Cap',
          value: 'cap',
          sortable: false,
          width: '20%'
        },
        {
          text: '24H',
          value: 'change',
          sortable: false,
          width: '20%'
        },
        {
          text: 'Balance',
          value: 'balance',
          sortable: false,
          width: '20%'
        },
        {
          text: '',
          value: 'callToAction',
          sortable: false,
          width: '15%'
        }
      ],
      menuObj: {
        name: 'Custom Tokens',
        items: [
          {
            items: [
              {
                title: 'Add Token',
                to: 'add',
                iconName: 'mdi-plus'
              },
              {
                title: 'Remove Token',
                to: 'remove',
                iconName: 'mdi-minus'
              }
            ]
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters('wallet', ['tokensList', 'web3']),
    ...mapState('wallet', ['web3', 'loadingWalletInfo']),
    ...mapGetters('custom', ['customTokens', 'hasCustom']),
    ...mapGetters('global', ['isEthNetwork', 'network', 'hasSwap']),
    ...mapGetters('external', ['totalTokenFiatValue']),
    loading() {
      return this.loadingWalletInfo;
    },
    /**
     * @returns formatted custom token values and token list values
     * displays custom tokens first and then token list
     * will be sorted by usd balance for both
     */
    tokensData() {
      if (!this.tokensList && !this.customTokens) return [];
      const customTokens = this.customTokens.map(item => {
        return this.formatValues(item);
      });
      const tokenList = this.tokensList.map(item => {
        return this.formatValues(item);
      });
      tokenList.sort((a, b) => b.usdBalance - a.usdBalance);
      const tokens = customTokens.concat(tokenList);
      return tokens;
    },
    totalTokensValue() {
      return formatFiatValue(this.totalTokenFiatValue).value;
    }
  },
  methods: {
    /**
     * @returns formatted values to display correctly on token table
     */
    formatValues(item) {
      const newObj = {};
      newObj.balance = [
        item.balancef
          ? item.balancef + ' ' + item.symbol
          : '0' + ' ' + item.symbol,
        '$' + item.usdBalancef ? item.usdBalancef : '0'
      ];
      newObj.usdBalance = item.usdBalance ? item.usdBalance : '0';
      newObj.token = item.symbol;
      newObj.cap = item.market_capf !== '0' ? item.market_capf : '';
      newObj.change =
        item.price_change_percentage_24hf &&
        item.price_change_percentage_24hf !== '0'
          ? item.price_change_percentage_24hf.replaceAll('%', '')
          : '';
      newObj.status = item.price_change_percentage_24h > 0 ? '+' : '-';
      newObj.price =
        item.pricef && item.pricef !== '0' ? '$' + item.pricef : '';
      newObj.tokenImg = item.img ? item.img : this.network.type.icon;
      if (this.hasSwap) {
        newObj.callToAction = [
          {
            title: 'Trade',
            method: () => {
              const obj = {
                fromToken: item.contract,
                amount: item.balancef
              };
              this.$router
                .push({
                  name: ROUTES_WALLET.SWAP.NAME,
                  query: obj
                })
                .then(() => {
                  this.$emit('trade');
                });
            },
            btnStyle: 'outline',
            colorTheme: 'primary'
          }
        ];
      }
      return newObj;
    },
    toggleAddCustomToken() {
      this.openAddCustomToken = !this.openAddCustomToken;
    },
    toggleDeleteCustomToken() {
      this.openDeleteCustomToken = !this.openDeleteCustomToken;
    },
    customTokenAction(param) {
      if (param === 'add') {
        this.toggleAddCustomToken();
      } else if (param === 'remove') {
        this.toggleDeleteCustomToken();
      }
    }
  }
};
</script>
