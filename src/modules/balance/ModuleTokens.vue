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
        <span
          class="primary--text cursor-pointer pl-3"
          @click="toggleCustomTokenOverlay"
          >+ Custom Token</span
        >
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
      :close="toggleCustomTokenOverlay"
      :open="openAddCustomToken"
    />
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import BalanceEmptyBlock from './components/BalanceEmptyBlock';
import TokenAddCustom from './components/TokenAddCustom';
import { formatFiatValue } from '@/core/helpers/numberFormatHelper';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
export default {
  components: {
    BalanceEmptyBlock,
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
      ]
    };
  },
  computed: {
    ...mapGetters('wallet', ['tokensList', 'web3']),
    ...mapState('wallet', ['web3', 'loadingWalletInfo']),
    ...mapState('custom', ['customTokens']),
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
      customTokens.sort((a, b) => b.usdBalance - a.usdBalance);
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
        item.balancef + ' ' + item.symbol,
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
                toToken: '',
                amount: item.balancef
              };
              this.$router.push({
                name: ROUTES_WALLET.SWAP.NAME,
                query: obj
              });
            },
            btnStyle: 'outline',
            colorTheme: 'primary'
          }
        ];
      }
      return newObj;
    },
    toggleCustomTokenOverlay() {
      this.openAddCustomToken = !this.openAddCustomToken;
    }
  }
};
</script>
