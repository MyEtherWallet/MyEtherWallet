<template>
  <!--
  =============================================================
  Module Tokens
  =============================================================
  -->
  <div class="module-tokens">
    <v-skeleton-loader
      v-if="loadingWalletInfo && (tokensData || hiddenTokens)"
      class="mx-auto"
      type="table"
    />
    <mew-module
      v-if="hasTokens && !dense"
      has-elevation
      subtitle="My Tokens Value"
      :has-body-padding="false"
      :title="totalTokensValue"
      class="bgWalletBlock"
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
                class="mr-n6"
                v-bind="attrs"
                rounded
                color="basic"
                icon
                v-on="on"
              >
                <v-icon medium color="textDark">mdi-dots-vertical</v-icon>
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
    <balance-empty-block
      v-if="emptyWallet"
      is-tokens
      :is-eth="isEthNetwork"
      @openAddCustomToken="handleOpenAddCustomToken"
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
<script setup>
import { defineAsyncComponent, defineProps, ref, computed } from 'vue';
import { uniqWith, isEqual } from 'lodash';
import BigNumber from 'bignumber.js';

import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import { currencyToNumber } from '@/core/helpers/localization';
import { DASHBOARD } from '../analytics-opt-in/handlers/configs/events';
import { useAmplitude } from '@/core/composables/amplitude';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';
import { useRouter } from 'vue-router/composables';
import { useCustomStore } from '@/core/store/custom';

const BalanceTable = defineAsyncComponent(() =>
  import('./components/BalanceTable')
);
const BalanceEmptyBlock = defineAsyncComponent(() =>
  import('./components/BalanceEmptyBlock')
);
const TokenAddCustom = defineAsyncComponent(() =>
  import('./components/TokenAddCustom')
);
const TokenEditCustom = defineAsyncComponent(() =>
  import('./components/TokenEditCustom')
);
const TokenRemoveCustom = defineAsyncComponent(() =>
  import('./components/TokenRemoveCustom')
);

// emits
const emit = defineEmits(['trade']);

// props
defineProps({
  dense: {
    type: Boolean,
    default: false
  }
});

// injections/use
const { trackDashboardAmplitude } = useAmplitude();
const { tokensList, loadingWalletInfo } = useWalletStore();
const { hiddenTokens } = useCustomStore();
const { isEthNetwork, network, hasSwap, getFiatValue } = useGlobalStore();
const { totalTokenFiatValue } = useExternalStore();
const { customTokens } = useCustomStore();
const router = useRouter();

// data
const openAddCustomToken = ref(false);
const openEditCustomToken = ref(false);
const openRemoveCustomToken = ref(false);
const tableHeaders = ref([
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
]);
const items = ref([
  {
    icon: 'mdi-plus',
    title: 'Add Token',
    action: () => toggleAddCustomToken()
  },
  {
    icon: 'mdi-pencil-outline',
    title: 'Edit Token',
    action: () => toggleEditCustomToken()
  }
]);
const selectedToken = ref({});

// computed
const hasTokens = computed(() => {
  return (
    !loadingWalletInfo.value &&
    (tokensData.value.length > 0 || hiddenTokens.value.length > 0)
  );
});
const emptyWallet = computed(() => {
  return (
    !loadingWalletInfo.value &&
    tokensData.value.length === 0 &&
    hiddenTokens.value.length === 0
  );
});
/**
 * @returns formatted custom token values and token list values
 * displays custom tokens first and then token list
 * will be sorted by usd balance for both
 */
const tokensData = computed(() => {
  if (!tokensList.value && !customTokens.value && !hiddenTokens.value)
    return [];
  const locCustomTokens = customTokens.value.reduce((arr, item) => {
    // Check if token is in hiddenTokens
    const isHidden = hiddenTokens.value.find(token => {
      return item.contract == token.address;
    });
    if (!isHidden) arr.push(formatValues(item));
    return arr;
  }, []);
  const uniqueTokens = uniqWith(
    tokensList.value.filter(t => {
      return !t.isHidden;
    }),
    isEqual
  );
  const tokenList = uniqueTokens
    .filter(item => {
      if (item && item.balance && BigNumber(item.balance).gt(0)) return item;
    })
    .map(item => {
      return formatValues(item);
    });
  tokenList.sort((a, b) => b.usdBalance - a.usdBalance);
  return locCustomTokens.concat(tokenList);
});
const totalTokensValue = computed(() => {
  return getFiatValue(totalTokenFiatValue.value);
});

// methods
/**
 * @returns formatted values to display correctly on token table
 */
const formatValues = item => {
  const newObj = {};
  newObj.balance = [
    item.balancef ? item.balancef + ' ' + item.symbol : '0' + ' ' + item.symbol,
    item.usdBalancef ? getFiatValue(item.usdBalancef) : '0'
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
    item.pricef && priceUF.toString() !== '0' ? getFiatValue(item.pricef) : '';

  // Use eth.svg icon for ETH
  if (item.symbol == 'ETH') {
    newObj.tokenImg = require('@/assets/images/networks/eth.svg');
  } else {
    newObj.tokenImg = item.img ? item.img : network.value.type.icon;
  }

  if (hasSwap.value) {
    newObj.callToAction = [
      {
        title: 'Swap',
        method: () => {
          const obj = {
            fromToken: item.contract,
            amount: item.balancef
          };
          trackDashboardAmplitude(DASHBOARD.SWAP_MY_TOKENS_VALUE);
          router
            .push({
              name: ROUTES_WALLET.SWAP.NAME,
              query: obj
            })
            .then(() => {
              emit('trade');
            });
        },
        btnStyle: 'outline',
        colorTheme: 'greenPrimary'
      }
    ];
  }
  return newObj;
};
const handleOpenAddCustomToken = () => {
  toggleAddCustomToken(true);
};
const toggleAddCustomToken = val => {
  openAddCustomToken.value = val ? val : !openAddCustomToken.value;
};
const toggleRemoveCustomToken = () => {
  openRemoveCustomToken.value = !openRemoveCustomToken.value;
};
const openRemoveToken = token => {
  selectedToken.value = token;
  toggleRemoveCustomToken();
};
const toggleEditCustomToken = () => {
  openEditCustomToken.value = !openEditCustomToken.value;
};
</script>

<style lang="scss">
.module-tokens {
  .mew-table td.text-start:nth-last-of-type(2) div span:first-child {
    text-overflow: ellipsis;
    overflow: hidden;
  }

  overflow: hidden;
}
.module-tokens-edit-menu {
  border: none !important;
}
</style>
