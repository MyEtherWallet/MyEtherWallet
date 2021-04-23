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
      v-if="!loading && tokensData.length > 0"
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
import BigNumber from 'bignumber.js';
import { mapGetters, mapState } from 'vuex';
import BalanceEmptyBlock from './components/BalanceEmptyBlock';
import numberFormatHelper from '@/core/helpers/numberFormatHelper';

export default {
  components: {
    BalanceEmptyBlock
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
    ...mapState('wallet', ['web3', 'initialLoadTokens']),
    ...mapGetters('global', ['isEthNetwork']),

    loading() {
      return this.initialLoadTokens;
    },
    tokensData() {
      return this.tokensList
        .filter(item => {
          if (item.price_change_24h || item.market_cap) {
            return item;
          }
        })
        .map(item => {
          const newObj = {};
          newObj.balance = [
            item.tokenBalance.value + ' ' + item.symbol,
            numberFormatHelper.formatUsdValue(new BigNumber(item.usdBalance))
              .value
          ];
          newObj.token = item.symbol;
          newObj.cap = new BigNumber(item.market_cap).toFormat();
          newObj.change = new BigNumber(item.price_change_24h).toFixed(2);
          newObj.status = item.price_change_24h > 0 ? '+' : '-';
          newObj.price = '$' + new BigNumber(item.price).toFixed(2);
          newObj.tokenImg = item.img;
          newObj.callToAction = [
            {
              title: 'Trade',
              method: () => {
                this.$router.push({ name: 'Swap' });
              },
              btnStyle: 'outline',
              colorTheme: 'primary'
            }
          ];
          // this.loading = false;
          return newObj;
        });
    },
    totalTokensValue() {
      return new BigNumber(
        this.tokensList.reduce((total, currentVal) => {
          const balance =
            currentVal.usdBalance !== null &&
            (currentVal.price_change_24h !== null ||
              currentVal.market_cap !== 0)
              ? currentVal.usdBalance
              : 0;
          return new BigNumber(total).plus(balance).toFixed();
        }, 0)
      ).toFixed(2);
    }
  }
};
</script>
