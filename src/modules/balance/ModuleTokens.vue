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
      <!-- hiding for now until we have the ui  -->
      <!-- <template #rightHeaderContainer>
        <mew-button btn-style="transparent" title="All Tokens" />
      </template> -->
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
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import BalanceEmptyBlock from './components/BalanceEmptyBlock';
import { formatFiatValue } from '@/core/helpers/numberFormatHelper';
import { ROUTES_WALLET } from '@/core/router/config-routes';
export default {
  components: {
    BalanceEmptyBlock
  },
  props: {
    dense: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
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
    ...mapGetters('global', ['isEthNetwork', 'network', 'hasSwap']),
    ...mapGetters('external', ['totalTokenFiatValue']),
    loading() {
      return this.loadingWalletInfo;
    },
    tokensData() {
      if (!this.tokensList) return [];
      const tokenList = this.tokensList.map(item => {
        const newObj = {};
        newObj.balance = [
          item.balancef + ' ' + item.symbol,
          '$' + item.usdBalancef
        ];
        newObj.usdBalance = item.usdBalance;
        newObj.token = item.symbol;
        newObj.cap = item.market_capf !== '0' ? item.market_capf : '';
        newObj.change =
          item.price_change_percentage_24hf !== '0'
            ? item.price_change_percentage_24hf.replaceAll('%', '')
            : '';
        newObj.status = item.price_change_percentage_24h > 0 ? '+' : '-';
        newObj.price = item.pricef !== '0' ? '$' + item.pricef : '';
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
      });
      tokenList.sort((a, b) => b.usdBalance - a.usdBalance);
      return tokenList;
    },
    totalTokensValue() {
      return formatFiatValue(this.totalTokenFiatValue).value;
    }
  }
};
</script>
