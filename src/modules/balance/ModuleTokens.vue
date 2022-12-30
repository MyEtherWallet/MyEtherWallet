<template>
  <!--
  =============================================================
  Module Tokens
  =============================================================
  -->
  <div class="module-tokens">
    <v-skeleton-loader
      v-if="loading && (tokensData || hiddenTokens)"
      class="mx-auto"
      type="table"
    />
    <mew-module
      v-if="hasTokens && !dense"
      has-elevation
      subtitle="My Tokens Value"
      :has-body-padding="false"
      :title="totalTokensValue"
    >
      <template #rightHeaderContainer>
        <div>
          <v-menu
            bottom
            offset-y
            rounded="lg"
            content-class="module-tokens-edit-menu"
          >
            <template #activator="{ on, attrs }">
              <v-btn
                class="ma-2"
                v-bind="attrs"
                rounded
                color="basic"
                icon
                v-on="on"
              >
                <v-icon medium color="basic">mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
                @click="item.action"
              >
                <div class="pl-2 pr-4 d-flex align-center">
                  <v-icon dense color="basic" left>{{ item.icon }}</v-icon>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </div>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
      <template #moduleBody>
        <balance-table class="mb-4" :table-data="tokensData" />
      </template>
    </mew-module>
    <mew-table
      v-if="hasTokens && dense"
      :has-color="false"
      :table-headers="tableHeaders"
      :table-data="tokensData"
    />
    <!--
    =====================================================================================
      display if the user has no tokens
    =====================================================================================
    -->
    <balance-empty-block v-if="emptyWallet" is-tokens :is-eth="isEthNetwork" />
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
      Remove Custom Token form
    =====================================================================================
    -->
    <token-remove-custom
      :close="toggleRemoveCustomToken"
      :open="openRemoveCustomToken"
      :selected-token="selectedToken"
    />
    <!--
    =====================================================================================
      Edit Custom Token form
    =====================================================================================
    -->
    <token-edit-custom
      :close="toggleEditCustomToken"
      :open="openEditCustomToken"
      @addToken="toggleAddCustomToken"
      @removeToken="openRemoveToken"
    />
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import { uniqWith, isEqual } from 'lodash';
import BigNumber from 'bignumber.js';

import BalanceTable from './components/BalanceTable';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import { currencyToNumber } from '@/core/helpers/localization';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';

export default {
  components: {
    BalanceTable,
    BalanceEmptyBlock: () => import('./components/BalanceEmptyBlock'),
    TokenAddCustom: () => import('./components/TokenAddCustom'),
    TokenEditCustom: () => import('./components/TokenEditCustom'),
    TokenRemoveCustom: () => import('./components/TokenRemoveCustom')
  },
  mixins: [handlerAnalytics],
  props: {
    dense: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      openAddCustomToken: false,
      openEditCustomToken: false,
      openRemoveCustomToken: false,
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
          width: '15%'
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
          width: '10%'
        }
      ],
      items: [
        {
          icon: 'mdi-plus',
          title: 'Add Token',
          action: this.toggleAddCustomToken
        },
        {
          icon: 'mdi-pencil-outline',
          title: 'Edit Token',
          action: this.toggleEditCustomToken
        }
      ],
      selectedToken: {}
    };
  },
  computed: {
    ...mapGetters('wallet', ['tokensList', 'web3']),
    ...mapState('wallet', ['web3', 'loadingWalletInfo']),
    ...mapGetters('custom', [
      'customTokens',
      'hasCustom',
      'hiddenTokens',
      'hasHidden'
    ]),
    ...mapGetters('global', [
      'isEthNetwork',
      'network',
      'hasSwap',
      'getFiatValue'
    ]),
    ...mapGetters('external', ['totalTokenFiatValue']),
    loading() {
      return this.loadingWalletInfo;
    },
    hasTokens() {
      return (
        !this.loading &&
        (this.tokensData.length > 0 || this.hiddenTokens.length > 0)
      );
    },
    emptyWallet() {
      return (
        !this.loading &&
        this.tokensData.length === 0 &&
        this.hiddenTokens.length === 0
      );
    },
    /**
     * @returns formatted custom token values and token list values
     * displays custom tokens first and then token list
     * will be sorted by usd balance for both
     */
    tokensData() {
      if (!this.tokensList && !this.customTokens && !this.hiddenTokens)
        return [];
      const customTokens = this.customTokens.reduce((arr, item) => {
        // Check if token is in hiddenTokens
        const isHidden = this.hiddenTokens.find(token => {
          return item.contract == token.address;
        });
        if (!isHidden) arr.push(this.formatValues(item));
        return arr;
      }, []);
      const uniqueTokens = uniqWith(
        this.tokensList.filter(t => {
          return !t.isHidden;
        }),
        isEqual
      );
      const tokenList = uniqueTokens
        .filter(item => {
          if (item && item.balance && BigNumber(item.balance).gt(0))
            return item;
        })
        .map(item => {
          return this.formatValues(item);
        });
      tokenList.sort((a, b) => b.usdBalance - a.usdBalance);
      return customTokens.concat(tokenList);
    },
    totalTokensValue() {
      return this.getFiatValue(this.totalTokenFiatValue);
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
        item.usdBalancef ? this.getFiatValue(item.usdBalancef) : '0'
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
      const priceUF = currencyToNumber(item.pricef);
      newObj.price =
        item.pricef && priceUF.toString() !== '0'
          ? this.getFiatValue(item.pricef)
          : '';

      // Use eth.svg icon for ETH
      if (item.symbol == 'ETH') {
        newObj.tokenImg = require('@/assets/images/networks/eth.svg');
      } else {
        newObj.tokenImg = item.img ? item.img : this.network.type.icon;
      }

      if (this.hasSwap) {
        newObj.callToAction = [
          {
            title: 'Swap',
            method: () => {
              const obj = {
                fromToken: item.contract,
                amount: item.balancef
              };
              this.trackSwap('fromDashboardTokensTable');
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
            colorTheme: 'greenPrimary'
          }
        ];
      }
      return newObj;
    },
    toggleAddCustomToken() {
      this.openAddCustomToken = !this.openAddCustomToken;
    },
    toggleRemoveCustomToken() {
      this.openRemoveCustomToken = !this.openRemoveCustomToken;
    },
    openRemoveToken(token) {
      this.selectedToken = token;
      this.toggleRemoveCustomToken();
    },
    toggleEditCustomToken() {
      this.openEditCustomToken = !this.openEditCustomToken;
    }
  }
};
</script>

<style lang="scss">
.module-tokens {
  .mew-table td.text-start:nth-last-of-type(2) div span:first-child {
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.module-tokens-edit-menu {
  border: none !important;
}
</style>
