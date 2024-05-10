<template>
  <div class="mew-component--aave">
    <the-wrapper-dapp
      :is-new-header="true"
      :dapp-img="headerImg"
      :banner-text="topBanner"
      :tab-items="tabs"
      :active-tab="activeTab"
      external-contents
      :on-tab="tabChanged"
      :valid-networks="validNetworks"
    >
      <template #tabContent1>
        <v-sheet
          color="transparent"
          max-width="724px"
          class="mx-auto py-6 px-2 px-md-3"
        >
          <div class="d-flex align-center justify-end">
            <div class="mr-3">Health factor</div>
            <div
              v-if="!isLoadingData"
              class="font-weight-bold mr-3"
              :class="healthFactorColor"
            >
              {{ healthFactor }}
            </div>
            <v-skeleton-loader v-else width="31px" type="text" class="mr-3" />
            <mew-tooltip :text="healthFactorTooltip" />
          </div>
          <v-row class="mb-1 mt-2" dense>
            <v-col cols="12" md="6">
              <div class="bgWalletBlockDark pa-5 border-radius--5px">
                <h5 class="mb-2 font-weight-bold">Aggregated Balance</h5>
                <h3 v-if="!isLoadingData">
                  {{ totalLiquidity.usd }}
                </h3>
                <v-skeleton-loader
                  v-else
                  height="20px"
                  type="text"
                  class="mt-2"
                />
                <div v-if="!isLoadingData" class="mt-2">
                  {{ totalLiquidity.eth }} ETH
                </div>
                <v-skeleton-loader
                  v-else
                  height="20px"
                  type="text"
                  class="mt-2"
                />

                <v-divider class="my-4" />

                <div class="d-flex justify-space-between">
                  <div class="font-weight-medium">Composition</div>
                </div>
                <mew-progress-bar
                  v-if="!isLoadingData"
                  class="mt-2"
                  :data="compositionPercentage"
                />
                <v-skeleton-loader
                  v-else
                  height="12px"
                  type="text"
                  class="mt-2"
                />
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div
                class="bgWalletBlockDark pa-5 border-radius--5px height-100 d-flex flex-column"
              >
                <div class="d-flex aling-center">
                  <h5 class="font-weight-bold mr-auto">Earnings</h5>
                  <div class="d-flex align-center">
                    <div class="d-flex align-center mr-3">
                      <div class="circle pink mr-1" />
                      APR
                    </div>
                    <div class="d-flex align-center">
                      <div class="circle lightblue mr-1" />
                      Total
                    </div>
                  </div>
                </div>

                <div class="ma-auto text-center pa-5">No data to show yet</div>
              </div>
            </v-col>
            <v-col cols="12" class="pt-md-2">
              <aave-table
                ref="depositsTable"
                :title="aaveTableTitle.balance_deposit"
                :has-search="false"
                :has-toggle="false"
                :user-summary="userSummary"
                :is-loading-data="isLoadingData"
                :format-usd-value="formatUsdValue"
                :user-borrow-power="userBorrowPower"
                :reserves-data="reservesData"
              />
            </v-col>
          </v-row>

          <div class="d-flex justify-center mt-9">
            <mew-button
              title="Deposit"
              btn-size="xlarge"
              @click.native="toggleDepositOverlay(true)"
            />
          </div>
        </v-sheet>
      </template>
      <template #tabContent2>
        <v-sheet
          color="transparent"
          max-width="724px"
          class="mx-auto py-6 px-2 px-md-3"
        >
          <div class="d-flex align-center justify-end">
            <div class="mr-3">Health factor</div>
            <div
              v-if="!isLoadingData"
              class="font-weight-bold mr-3"
              :class="healthFactorColor"
            >
              {{ healthFactor }}
            </div>
            <v-skeleton-loader v-else width="31px" type="text" class="mr-3" />
            <mew-tooltip :text="healthFactorTooltip" />
          </div>

          <v-row class="mb-1 mt-2" dense>
            <v-col cols="12" md="6">
              <div class="bgWalletBlockDark pa-5 border-radius--5px">
                <h5 class="mb-2 font-weight-bold">You Borrowed</h5>
                <h3 v-if="!isLoadingData">{{ totalBorrow.usd }}</h3>
                <v-skeleton-loader
                  v-else
                  height="20px"
                  type="text"
                  class="mt-2"
                />
                <div v-if="!isLoadingData" class="mt-2">
                  {{ totalBorrow.eth }} ETH
                </div>
                <v-skeleton-loader
                  v-else
                  height="20px"
                  type="text"
                  class="mt-2"
                />

                <v-divider class="my-4" />

                <div class="d-flex justify-space-between">
                  <div class="font-weight-medium">Composition</div>
                </div>
                <mew-progress-bar
                  v-if="!isLoadingData"
                  class="mt-2"
                  :data="borrowingsPercentage"
                />
                <v-skeleton-loader
                  v-else
                  height="12px"
                  type="text"
                  class="mt-2 mb-0"
                />
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="bgWalletBlockDark pa-5 border-radius--5px">
                <h5 class="mb-2 font-weight-bold">Your Collateral</h5>
                <h3 v-if="!isLoadingData">{{ totalCollateral.usd }}</h3>
                <v-skeleton-loader
                  v-else
                  height="20px"
                  type="text"
                  class="mt-2"
                />
                <div v-if="!isLoadingData" class="mt-2">
                  {{ totalCollateral.eth }} ETH
                </div>
                <v-skeleton-loader
                  v-else
                  height="20px"
                  type="text"
                  class="mt-2"
                />

                <v-divider class="my-4" />

                <div class="d-flex justify-space-between">
                  <div class="font-weight-medium">Composition</div>
                </div>
                <mew-progress-bar
                  v-if="!isLoadingData"
                  class="mt-2"
                  :data="collateralPercentage"
                />
                <v-skeleton-loader
                  v-else
                  class="mt-2"
                  height="12px"
                  type="text"
                />
              </div>
            </v-col>

            <v-col cols="12" class="pt-md-2">
              <div class="bgWalletBlockDark pa-5 loan-value-container">
                <v-row align="center">
                  <v-col cols="9">
                    <span class="mew-heading-3">Loan to Value</span>
                  </v-col>
                  <v-col cols="3">
                    <div class="d-flex justify-end align-center">
                      <span v-if="!isLoadingData" class="mew-heading-3">{{
                        loanValue
                      }}</span>
                      <v-skeleton-loader
                        v-else
                        height="19px"
                        width
                        type="text"
                        class="mt-2 mb-0"
                      />
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-col>
            <v-col cols="12" class="pt-md-2">
              <aave-table
                ref="borrowsTable"
                :title="aaveTableTitle.balance_borrow"
                :has-search="false"
                :has-toggle="false"
                :user-summary="userSummary"
                :is-loading-data="isLoadingData"
                :format-usd-value="formatUsdValue"
                :user-borrow-power="userBorrowPower"
                :reserves-data="reservesData"
              />
            </v-col>
          </v-row>
          <div class="d-flex justify-center mt-9">
            <mew-button
              title="Borrow"
              btn-size="xlarge"
              @click.native="toggleBorrowOverlay(true)"
            />
          </div>
        </v-sheet>
      </template>
    </the-wrapper-dapp>
    <aave-deposit-overlay
      :open="showDepositOverlay"
      :close="toggleDepositOverlay"
      :pre-selected-token="tokenSelected"
      :selected-token-details="selectedTokenDetails"
      :on-deposit="onDeposit"
      :is-loading-data="isLoadingData"
      :reserves-data="reservesData"
      :format-usd-value="formatUsdValue"
      :user-borrow-power="userBorrowPower"
      :current-health-factor="currentHealthFactor"
    />
    <aave-borrow-overlay
      :pre-selected-token="tokenSelected"
      :open="showBorrowOverlay"
      :close="toggleBorrowOverlay"
      :selected-token-details="selectedTokenDetails"
      :on-borrow="onBorrow"
      :format-usd-value="formatUsdValue"
      :user-summary="userSummary"
      :user-borrow-power="userBorrowPower"
      :is-loading-data="isLoadingData"
      :reserves-data="reservesData"
      :current-health-factor="currentHealthFactor"
    />
    <aave-collateral-overlay
      :open="showCollateralOverlay"
      :close="closeCollateralOverlay"
      :pre-selected-token="tokenSelected"
      :selected-token-details="selectedTokenDetails"
      :user-summary="userSummary"
      :selected-token-in-user-summary="selectedTokenInUserSummary"
      :current-health-factor="currentHealthFactor"
      @onConfirm="setCollateral"
      @onClose="resetCollateralToggle"
    />
    <aave-withdraw-overlay
      :on-withdraw="onWithdraw"
      :selected-token-in-user-summary="selectedTokenInUserSummary"
      :user-summary="userSummary"
      :selected-token-details="selectedTokenDetails"
      :current-health-factor="currentHealthFactor"
      :open="showWithdrawOverlay"
      :close="closeWithdrawOverlay"
      :pre-selected-token="tokenSelected"
    />
    <aave-repay-overlay
      :on-repay="onRepay"
      :selected-token-in-user-summary="selectedTokenInUserSummary"
      :format-usd-value="formatUsdValue"
      :user-summary="userSummary"
      :selected-token-details="selectedTokenDetails"
      :current-health-factor="currentHealthFactor"
      :open="showRepayOverlay"
      :close="closeRepayOverlay"
      :pre-selected-token="tokenSelected"
    />
    <aave-set-apr-overlay
      :open="showAprTypeOverlay"
      :close="closeAprTypeOverlay"
      :selected-token-in-user-summary="selectedTokenInUserSummary"
      :selected-token-details="selectedTokenDetails"
      @onConfirm="setBorrowRate"
      @onClose="resetAprToggle"
    />
  </div>
</template>

<script>
const COLORS = {
  ENJ: 'bluePrimary',
  ETH: 'greenPrimary',
  ZRX: 'greenMedium',
  KNC: 'textDark',
  USDT: 'redPrimary',
  MKR: 'redPrimary',
  LEND: 'redPrimary',
  AAVE: 'textLight',
  DAI: 'textLight',
  SUSD: 'greyPrimary',
  LINK: 'greyMedium',
  BUSD: 'greyMedium',
  REN: 'greenPrimary',
  WBTC: 'greyMedium',
  UNI: 'redMedium',
  REP: 'greyLight',
  MANA: 'greyLight',
  BAT: 'greyLight',
  YFI: 'white',
  TUSD: 'black'
};

const STABLE_COINS = ['TUSD', 'DAI', 'USDT', 'USDC', 'sUSD'];

const LENDING_POOL = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9';
const REPAY_WITH_COLLATERAL_ADAPTER =
  '0x80Aca0C645fEdABaa20fd2Bf0Daf57885A309FE6';
const SWAP_COLLATERAL_ADAPTER = '0x135896DE8421be2ec868E0b811006171D9df802A';
const WETH_GATEWAY = '0xcc9a0B7c43DC2a5F023Bb9b738E45B0Ef6B06E04';
const PRICE_ORACLE = '0xA50ba011c48153De246E5192C8f9258A2ba79Ca9';
</script>
<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { LendingPool, ChainId } from '@aave/contract-helpers';
import { formatReserves, formatUserSummary } from '@aave/math-utils';
import { toBN, toHex } from 'web3-utils';
import { calculateHealthFactorFromBalancesBigUnits } from '@aave/protocol-js';
import BigNumber from 'bignumber.js';
import { useSubscription } from '@vue/apollo-composable';

import {
  ReserveUpdateSubscription,
  UserPositionUpdateSubscription,
  UsdPriceEth
} from '@/dapps/aave-dapp/apollo/graphql/subscriptions';
import {
  Toast,
  SUCCESS,
  ERROR,
  WARNING
} from '@/modules/toast/handler/handlerToast';
import configs from '@/dapps/aave-dapp/apollo/configs';
import eth from '@/assets/images/currencies/eth.png';
import { ethers } from 'ethers';
import { INTEREST_TYPES } from './handlers/helpers';
import { estimateGasList } from '@/core/helpers/gasPriceHelper';
import { ABI } from './handlers/ABI';
import handleError from '@/modules/confirmation/handlers/errorHandler';

import { SUPPORTED_NETWORKS } from './handlers/supportedNetworks';
import { AAVE_TABLE_TITLE } from '@/dapps/aave-dapp/handlers/helpers';
import {
  formatPercentageValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
import { EventBus } from '@/core/plugins/eventBus';
import TheWrapperDapp from '@/dapps/TheWrapperDapp.vue';
import AaveBorrowOverlay from './components/overlays/AaveBorrowOverlay';
import AaveDepositOverlay from './components/overlays/AaveDepositOverlay';
import AaveCollateralOverlay from './components/overlays/AaveCollateralOverlay';
import AaveRepayOverlay from './components/overlays/AaveRepayOverlay';
import AaveWithdrawOverlay from './components/overlays/AaveWithdrawOverlay';
import AaveTable from './components/AaveTable';
import AaveSetAprOverlay from './components/overlays/AaveSetAprOverlay';

import { useWalletStore } from '@/core/store/wallet';
import { useGlobalStore } from '@/core/store/global';
import { useExternalStore } from '@/core/store/external';
import { fromBase } from '../../core/helpers/unit';

// injections/use
const { web3, balanceInETH, address, tokensList, balanceInWei } =
  useWalletStore();
const { getFiatValue, gasPriceType, gasPriceByType, network } =
  useGlobalStore();
const { contractToToken } = useExternalStore();

// apollo
/**
 * Apollo subscription to get reserves
 */
const { onResult: reserveUpdateOnResult, onError: reserveUpdateOnError } =
  useSubscription(
    ReserveUpdateSubscription,
    () => ({
      pool: configs.POOL_ID
    }),
    () => ({
      clientId: 'aave'
    })
  );
reserveUpdateOnResult(({ data }) => {
  Promise.all(data.reserves.map(item => rawDataParser(item))).then(values => {
    rawReserveData.value = values.filter(
      item => item !== undefined && !item.isFrozen
    );
    reservesData.value = formatReserves({
      reserves: rawReserveData.value,
      currentTimestamp: Math.floor(Date.now() / 1000),
      marketReferenceCurrencyDecimals: 18,
      marketReferencePriceInUsd: BigNumber(1).div(
        fromBase(usdPriceEth.value, 18)
      )
    }).reverse();
    setFormatUserSummaryData();
  });
});
reserveUpdateOnError(({ error }) => {
  Toast(error.message, {}, ERROR);
});

/**
 * Apollo subscription to get user reserves
 */

const {
  onResult: userPositionUpdateOnResult,
  onError: userPositionUpdateOnError
} = useSubscription(
  UserPositionUpdateSubscription,
  () => ({
    user: address.value,
    pool: configs.POOL_ID
  }),
  () => ({
    clientId: 'aave'
  })
);

userPositionUpdateOnResult(({ data }) => {
  userReserveData.value = data.userReserves.map(item => {
    const token = contractToToken(item.reserve.underlyingAsset);
    item.reserve['icon'] = token ? token.img : eth;
    return {
      ...item,
      underlyingAsset: item.reserve.underlyingAsset
    };
  });
  setFormatUserSummaryData();
});

userPositionUpdateOnError(({ error }) => {
  Toast(error.message, {}, ERROR);
});

/**
 * Apollo subscription to get usd price
 */

const { onResult: usdPriceEthOnResult, onError: usdPriceEthOnError } =
  useSubscription(
    UsdPriceEth,
    () => ({
      pool: configs.POOL_ID
    }),
    () => ({
      clientId: 'aave'
    })
  );

usdPriceEthOnResult(({ data }) => {
  usdPriceEth.value = data.priceOracle.usdPriceEth;
  setFormatUserSummaryData();
});

usdPriceEthOnError(({ error }) => {
  Toast(error.message, {}, ERROR);
});

// data
const topBanner = {
  title: 'AAVE',
  subtext:
    'Aave is an Open Source Money Market Protocol, allowing you to earn daily interest on your stablecoins. Borrow against various assets and switch interest between variable and stable rates'
};
const tabs = [{ name: 'Deposits' }, { name: 'Borrowings' }];
const aaveTableTitle = AAVE_TABLE_TITLE;
const validNetworks = SUPPORTED_NETWORKS;
const headerImg = require('@/assets/images/icons/dapps/icon-dapp-aave.svg');
// reactive
const showDepositOverlay = ref(false);
const tokenSelected = ref({});
const showBorrowOverlay = ref(false);
const showWithdrawOverlay = ref(false);
const showCollateralOverlay = ref(false);
const showRepayOverlay = ref(false);
const showAprTypeOverlay = ref(false);
const activeTab = ref(0);
const reservesStable = ref([]);
const reservesData = ref([]);
const rawReserveData = ref([]);
const userReserveData = ref([]);
const usdPriceEth = ref('');
const userSummary = ref({});
const isLoadingData = ref(false);
const lendingPool = ref({});
const poolContract = ref({});
const priceOracle = ref({});
const depositsTable = ref(null);
const borrowsTable = ref(null);

// computed
const userReservesData = computed(() => {
  return userSummary.value.userReservesData;
});

const selectedTokenToUse = computed(() => {
  return selectedTokenToUse.value || tokenSelected.value;
});

const selectedTokenDetails = computed(() => {
  return reservesData.value.find(
    item => item.reserve.symbol === selectedTokenToUse.value.token
  );
});

const selectedTokenInUserSummary = computed(() => {
  return userSummary.value?.userReservesData?.find(item => {
    return item.reserve.symbol === selectedTokenToUse.value.token;
  });
});

const userBorrowingPowerInETH = computed(() => {
  let buyingPower = 0;
  userReservesData.value.forEach(item => {
    if (item.usageAsCollateralEnabledOnUser) {
      buyingPower +=
        item.underlyingBalanceMarketReferenceCurrency *
        item.reserve.formattedBaseLTVasCollateral;
    }
  });
  buyingPower -= userSummary.value.totalBorrowsMarketReferenceCurrency;
  if (buyingPower < 0) buyingPower = 0;
  return buyingPower;
});

const loanValue = computed(() => {
  return formatPercentageValue(
    BigNumber(userSummary.value.currentLoanToValue).times(100)
  ).value;
});

const healthFactor = computed(() => {
  return BigNumber(userSummary.value.healthFactor).gt(0)
    ? formatFloatingPointValue(userSummary.value.healthFactor).value
    : `-`;
});

const healthFactorTooltip = computed(() => {
  return 'The health factor is the numeric representation of the safety of your deposited assets against the borrowed assets and its underlying value. The higher the value is, the safer the state of your funds are against a liquidation scenario.';
});

const totalLiquidity = computed(() => {
  return {
    eth: formatFloatingPointValue(
      userSummary.value.totalLiquidityMarketReferenceCurrency || '0'
    ).value,
    usd: getFiatValue(
      formatUsdValue(userSummary.value.totalLiquidityUSD || '0')
    )
  };
});

const currentHealthFactor = computed(() => {
  let curHF = new BigNumber(userSummary.value?.healthFactor).toFixed(3);
  if (curHF === 'NaN' || curHF === '-1.000') curHF = '-';
  return curHF;
});

const totalCollateral = computed(() => {
  return {
    eth: formatFloatingPointValue(
      userSummary.value.totalCollateralMarketReferenceCurrency || '0'
    ).value,
    usd: getFiatValue(
      formatUsdValue(userSummary.value.totalCollateralUSD || '0')
    )
  };
});

const totalBorrow = computed(() => {
  return {
    eth: formatFloatingPointValue(
      userSummary.value.totalBorrowsMarketReferenceCurrency || '0'
    ).value,
    usd: getFiatValue(formatUsdValue(userSummary.value.totalBorrowsUSD || '0'))
  };
});

const compositionPercentage = computed(() => {
  if (userSummary.value && Object.keys(userSummary.value).length > 0) {
    const total = userSummary.value.totalLiquidityMarketReferenceCurrency;
    return userSummary.value.userReservesData
      .filter(item => {
        return item.underlyingBalance > 0.00001;
      })
      .map(item => {
        return {
          percentage: BigNumber(item.underlyingBalanceMarketReferenceCurrency)
            .div(total)
            .times(100)
            .toFixed(),
          color: COLORS[item.reserve.symbol],
          tooltip:
            formatFloatingPointValue(item.underlyingBalance).value +
            ' ' +
            item.reserve.symbol
        };
      });
  }
  return [];
});

const borrowingsPercentage = computed(() => {
  if (userSummary.value && Object.keys(userSummary.value).length > 0) {
    let totalAvailablePercentage = 100;
    const data = userSummary.value.userReservesData
      .filter(item => {
        return item.totalBorrowsMarketReferenceCurrency > 0.001;
      })
      .map(item => {
        const percentage = BigNumber(item.totalBorrowsMarketReferenceCurrency)
          .times(100)
          .div(userSummary.value.totalBorrowsMarketReferenceCurrency)
          .toFixed();
        totalAvailablePercentage = totalAvailablePercentage - percentage;
        return {
          percentage: percentage,
          color: COLORS[item.reserve.symbol],
          tooltip:
            formatFloatingPointValue(item.totalBorrowsMarketReferenceCurrency)
              .value +
            ' ' +
            item.reserve.symbol
        };
      });
    if (totalAvailablePercentage > 0) {
      data.push({
        percentage: totalAvailablePercentage,
        color: '#c7c7c7',
        tooltip:
          formatFloatingPointValue(
            userSummary.value.availableBorrowsMarketReferenceCurrency
          ).value + ' Available to Borrow'
      });
    }
    return data;
  }

  return [];
});

const healthFactorColor = computed(() => {
  if (healthFactor.value < 2 && healthFactor.value >= 1.2)
    return 'orangePrimary--text';
  else if (healthFactor.value < 1.2) return 'redPrimary--text';

  return 'greenPrimary--text';
});

// watch
watch(
  () => showDepositOverlay.value,
  val => {
    if (!val) tokenSelected.value = {};
  }
);
watch(
  () => showBorrowOverlay.value,
  val => {
    if (!val) tokenSelected.value = {};
  }
);

watch(
  () => activeTab.value,
  () => {
    tokenSelected.value = {};
  }
);

// mounted
onMounted(() => {
  const provider = new ethers.providers.StaticJsonRpcProvider(
    'https://nodes.mewapi.io/rpc/eth',
    ChainId.mainnet
  );

  // event listeners
  EventBus.$on('selectedBorrow', openBorrowOverlayWithToken);
  EventBus.$on('repayBorrowing', openRepayOverlay);
  EventBus.$on('changeAprType', openAprTypeOverlay);
  EventBus.$on('selectedDeposit', openDepositOverlayWithToken);
  EventBus.$on('withdrawToken', openWithdrawOverlay);
  EventBus.$on('collateralChange', openCollateralOverlay);

  lendingPool.value = new LendingPool(provider, {
    LENDING_POOL: LENDING_POOL,
    REPAY_WITH_COLLATERAL_ADAPTER: REPAY_WITH_COLLATERAL_ADAPTER,
    SWAP_COLLATERAL_ADAPTER: SWAP_COLLATERAL_ADAPTER,
    WETH_GATEWAY: WETH_GATEWAY
  });
  poolContract.value = lendingPool.value.getContractInstance(LENDING_POOL);
  priceOracle.value = new ethers.Contract(PRICE_ORACLE, ABI, provider);
});

// beforeDestroy
onBeforeUnmount(() => {
  EventBus.$off('selectedBorrow');
  EventBus.$off('repayBorrowing');
  EventBus.$off('changeAprType');
  EventBus.$off('selectedDeposit');
  EventBus.$off('withdrawToken');
  EventBus.$off('collateralChange');
});

// methods
const tabChanged = tab => {
  activeTab.value = tab;
};

const toggleDepositOverlay = boolean => {
  if (!boolean) {
    tokenSelected.value = {};
  }
  showDepositOverlay.value = boolean;
};

const toggleBorrowOverlay = boolean => {
  if (!boolean) {
    tokenSelected.value = {};
  }
  showBorrowOverlay.value = boolean;
};

const openDepositOverlayWithToken = token => {
  tokenSelected.value = token;
  showDepositOverlay.value = true;
};

const openBorrowOverlayWithToken = token => {
  tokenSelected.value = token;
  showBorrowOverlay.value = true;
};

const openWithdrawOverlay = token => {
  tokenSelected.value = token;
  showWithdrawOverlay.value = true;
};

const closeWithdrawOverlay = () => {
  tokenSelected.value = {};
  showWithdrawOverlay.value = false;
};

const openCollateralOverlay = token => {
  tokenSelected.value = token;
  showCollateralOverlay.value = true;
};

const closeCollateralOverlay = () => {
  tokenSelected.value = {};
  showCollateralOverlay.value = false;
};

const resetCollateralToggle = ({ reserve, useAsCollateral }) => {
  const tableData =
    depositsTable.value.$children[0].$options.propsData.tableData;
  tableData.forEach(item => {
    if (item.token === reserve) item.toggle.value = useAsCollateral;
  });
  tokenSelected.value = {};
  showCollateralOverlay.value = false;
};

const openRepayOverlay = token => {
  tokenSelected.value = token;
  showRepayOverlay.value = true;
};

const closeRepayOverlay = () => {
  tokenSelected.value = {};
  showRepayOverlay.value = false;
};

const openAprTypeOverlay = token => {
  tokenSelected.value = token;
  showAprTypeOverlay.value = true;
};

const resetAprToggle = ({ reserve, value }) => {
  const tableData =
    borrowsTable.value.$children[0].$options.propsData.tableData;
  tableData.forEach(item => {
    if (item.token === reserve) item.toggle.value = value;
  });
  tokenSelected.value = {};
  showCollateralOverlay.value = false;
};

const closeAprTypeOverlay = () => {
  tokenSelected.value = {};
  showAprTypeOverlay.value = false;
};

const rawDataParser = async item => {
  const token = contractToToken(item.underlyingAsset);
  item['icon'] = token?.img || eth;
  if (item.price.priceInEth === '0') {
    const price = await getTokenPrice(item.underlyingAsset);
    item.price.priceInEth = price.toString();
  }
  return {
    ...item,
    priceInMarketReferenceCurrency: item.price.priceInEth,
    eModeCategoryId: 0,
    borrowCap: '',
    supplyCap: '',
    debtCeiling: '',
    debtCeilingDecimals: 0,
    isolationModeTotalDebt: '',
    eModeLtv: 0,
    eModeLiquidationThreshold: 0,
    eModeLiquidationBonus: 0
  };
};

/**
 * Deposit funds
 */
const onDeposit = async ({ amount, reserve, referralCode, user }) => {
  try {
    let txs = [];
    const allowance = await formatAllowanceData(
      reserve,
      user,
      poolContract.value.address
    );
    const resetApproveData = await formatApprovalData(
      reserve,
      user,
      poolContract.value.address,
      0
    );
    const approveData = await formatApprovalData(
      reserve,
      user,
      poolContract.value.address,
      amount
    );
    const txData = poolContract.value.populateTransaction.deposit(
      reserve,
      amount,
      user,
      referralCode
    );
    txData.from = user;
    if (toBN(allowance).gt(toBN(amount))) {
      txs = [txData];
    } else {
      txs = [resetApproveData, approveData, txData];
    }
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Apollo mutation to borrow funds
 */
const onBorrow = async ({
  amount,
  reserve,
  referralCode,
  user,
  interestMode
}) => {
  try {
    const data = [
      reserve,
      amount,
      interestMode === INTEREST_TYPES.variable ? 2 : 1,
      referralCode,
      user
    ];
    const txData = await poolContract.value.populateTransaction.borrow(...data);
    formatTxData(txData);
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Apollo mutation to repay funds
 * @param {object} data
 * @param {String} data.user - The ethereum address that repays
 * @param {String} data.reserve - The ethereum address of the reserve on which the user borrowed
 * @param {String|Number} data.amount - The amount to repay, or (-1) if the user wants to repay everything
 * @param data.interestRateMode -  // Whether stable (InterestRate.Stable) or variable (InterestRate.Variable) debt will be repaid
 */
const onRepay = async ({ amount, reserve, interestRateMode, user }) => {
  try {
    let txs = [];
    const allowance = await formatAllowanceData(
      reserve,
      user,
      poolContract.value.address
    );
    const approveData = await formatApprovalData(
      reserve,
      user,
      poolContract.value.address,
      amount
    );
    const resetApproveData = await formatApprovalData(
      reserve,
      user,
      poolContract.value.address,
      0
    );
    const data = await poolContract.value.populateTransaction.repay(
      reserve,
      amount,
      interestRateMode === INTEREST_TYPES.variable ? 2 : 1,
      user
    );
    data.from = user;

    if (toBN(allowance).gt(toBN(amount))) {
      txs = [data];
    } else {
      txs = [resetApproveData, approveData, data];
    }
    const gasLimits = await estimateGasList(network.type.name, txs);
    sendTxns(txs, gasLimits);
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Apollo mutation to set the borrow rate (stable or variable)
 * function swapBorrowRateMode(address asset, uint256 rateMode)
 * the rate mode the user is swapping from. Stable: 1, Variable: 2
 */
const setBorrowRate = async ({ reserve, rateMode, symbol }) => {
  try {
    const txData =
      await poolContract.value.populateTransaction.swapBorrowRateMode(
        reserve,
        rateMode
      );
    const defaultValue = rateMode === 2;
    const params = {
      reserve: symbol,
      value: defaultValue
    };
    const callback = [resetAprToggle, params];
    formatTxData(txData, callback);
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Apollo mutation to withdraw funds
 *
 * @param reserve The ethereum address of the reserve asset
 * @param amount The amount of reserve asset being redeemed
 * @param user The ethereum address that will receive the reserve asset
 */
const onWithdraw = async ({ reserve, amount, user }) => {
  try {
    const txData = await poolContract.value.populateTransaction.withdraw(
      reserve,
      amount,
      user
    );
    formatTxData(txData);
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * format transaction data for token approval
 *
 * @param tokenAddress The ethereum address of the token needing approval
 * @param user The ethereum address that owns the asset
 * @param spender The ethereum address that will spend the asset
 * @param amount The amount of asset that will be approved
 */
const formatApprovalData = async (tokenAddress, user, spender, amount) => {
  try {
    const LOCAL_ABI = [
      'function approve(address _spender, uint256 _value) public returns (bool success)'
    ];
    const localToken = new ethers.Contract(
      tokenAddress,
      LOCAL_ABI,
      poolContract.value.provider
    );
    const approveData = await localToken.populateTransaction.approve(
      spender,
      amount
    );
    approveData.from = user;
    return approveData;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * format transaction data for token allowance
 *
 * @param tokenAddress The ethereum address of the token needing approval
 * @param user The ethereum address that owns the asset
 * @param spender The ethereum address that will spend the asset
 */
const formatAllowanceData = async (tokenAddress, user, spender) => {
  try {
    const LOCAL_ABI = [
      {
        constant: true,
        inputs: [
          { name: '_owner', type: 'address' },
          { name: '_spender', type: 'address' }
        ],
        name: 'allowance',
        outputs: [{ name: 'remaining', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      }
    ];
    const localToken = web3.eth.Contract(LOCAL_ABI, tokenAddress);
    return localToken.methods.allowance(user, spender).call();
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Apollo mutation to enable or disable collateral
 * function setUserUseReserveAsCollateral(address asset, bool useAsCollateral)
 * Sets the asset of msg.sender to be used as collateral or not.
 */
const setCollateral = async ({ reserve, useAsCollateral, user }) => {
  try {
    const txData =
      await poolContract.value.populateTransaction.setUserUseReserveAsCollateral(
        reserve,
        useAsCollateral
      );
    const params = {
      reserve: reserve,
      value: !useAsCollateral
    };
    const callback = [resetCollateralToggle, params];
    formatTxData(txData, callback);
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * Check and prepare data to send tx
 * or errors out
 */
const formatTxData = (txData, callback) => {
  try {
    const tx = {
      from: address,
      to: txData.to,
      data: txData.data,
      value: '0',
      gasPrice: gasPriceByType(gasPriceType)
    };

    web3.eth
      .estimateGas(tx)
      .then(res => {
        tx['gas'] = toHex(res);
        sendTransaction(tx)
          .then(res => {
            if (res?.rejected) {
              Toast('User rejected action!', {}, WARNING);
            }
            Toast(
              'Success! Your transaction will be displayed shortly.',
              {},
              SUCCESS
            );
          })
          .catch(err => {
            const error = handleError(err);
            if (error) Toast(err, {}, ERROR);
            if (callback) callback[0](callback[1]);
          });
      })
      .catch(() => {
        Toast('Insufficient funds for gas', {}, ERROR);
        if (callback) callback[0](callback[1]);
      });
  } catch (e) {
    Toast(e.message, {}, ERROR);
  }
};

/**
 * Check and prepare data to send multiple txns
 * or errors out
 */
const sendTxns = (txns, gasLimits) => {
  try {
    if (!gasLimits) throw new Error('Unable to estimate transaction fees');
    const locTxns = txns.map((tx, index) => {
      return {
        from: address,
        to: tx.to,
        data: tx.data,
        value: '0',
        gasPrice: gasPriceByType(gasPriceType),
        gas: toHex(gasLimits[index])
      };
    });
    let totalGasPrice = toBN(0);
    locTxns.forEach(tx => {
      totalGasPrice = totalGasPrice.add(toBN(tx.gas).mul(toBN(tx.gasPrice)));
    });
    if (totalGasPrice.gt(toBN(balanceInWei))) {
      Toast('Insufficient funds for gas', {}, ERROR);
      return;
    }
    web3.mew
      .sendBatchTransactions(txns)
      .then(res => {
        if (res?.rejected) {
          Toast('User rejected action!', {}, WARNING);
        }
        Toast(
          'Success! Your transaction will be displayed shortly.',
          {},
          SUCCESS
        );
      })
      .catch(err => {
        Toast(err, {}, ERROR);
      });
  } catch (e) {
    Toast(e.message, {}, ERROR);
  }
};

/**
 * Sends the tx
 */
const sendTransaction = param => {
  if (param) {
    return web3.mew.sendTransaction(param);
  }
  return new Error('No Parameters sent!');
};

/**
 * @return object
 * Correctly formats all of the user data
 */

const setFormatUserSummaryData = () => {
  if (
    reservesData.value?.length > 0 &&
    userReserveData.value &&
    usdPriceEth.value
  ) {
    userSummary.value = formatUserSummary({
      currentTimestamp: Math.floor(Date.now() / 1000),
      marketReferencePriceInUsd: BigNumber(1).div(
        fromBase(usdPriceEth.value, 18)
      ),
      marketReferenceCurrencyDecimals: 18,
      userReserves: userReserveData.value,
      formattedReserves: reservesData.value,
      userEmodeCategoryId: 0
    });
    mergeTheReserves();
  }
};

/**
 * Merges the user reserves data into this.reservesData
 */
const mergeTheReserves = () => {
  if (
    userSummary.value.userReservesData &&
    userSummary.value.userReservesData.length > 0
  ) {
    userSummary.value.userReservesData.forEach(data => {
      const foundReserve = reservesData.value.find(
        item => item.name === data.reserve.name
      );
      if (foundReserve) {
        foundReserve['user'] = data;
      }
    });
  }
  getReserveBalance();
};

const getReserveBalance = () => {
  if (reservesData.value.length > 0) {
    reservesData.value.forEach(reserve => {
      reserve.tokenBalance = 0;
      reserve.user = reserve.user || {};
      if (reserve.symbol === 'ETH') {
        reserve.tokenBalance = balanceInETH;
      }

      const foundReserve = tokensList.find(
        elem => elem.symbol === reserve.symbol
      );
      if (foundReserve) {
        reserve.tokenBalance = foundReserve.balance;
      }
      if (reservesStable.value.length < 5) {
        if (STABLE_COINS.findIndex(coin => coin === reserve.symbol) >= 0) {
          reservesStable.value.push(reserve);
        }
      }
    });
  }
  isLoadingData.value = false;
};

const formatUsdValue = usdValue => {
  return 10 ** 8 * usdValue;
};

const nextHealthFactor = (selectedToken, amount) => {
  let locNextHealthFactor = currentHealthFactor.value,
    totalBorrowsETH = userSummary.value.totalBorrowsMarketReferenceCurrency;
  const collateralETH =
    userSummary.value.totalCollateralMarketReferenceCurrency;
  if (
    selectedToken.value?.usageAsCollateralEnabled &&
    selectedToken.value?.formattedPriceInMarketReferenceCurrency &&
    amount.value !== '0'
  ) {
    const ethBalance = BigNumber(amount.value).times(
      selectedToken.value?.formattedPriceInMarketReferenceCurrency
    );
    totalBorrowsETH = new BigNumber(
      userSummary.value.totalBorrowsMarketReferenceCurrency
    ).plus(ethBalance);
    locNextHealthFactor = calculateHealthFactorFromBalancesBigUnits(
      collateralETH,
      totalBorrowsETH,
      userSummary.value.currentLiquidationThreshold
    ).toFixed(3);
  }
  return locNextHealthFactor;
};

const userBorrowPower = token => {
  let borrowPower = 0;
  const tokenAmount = BigNumber(userBorrowingPowerInETH.value).dividedBy(
    token.formattedPriceInMarketReferenceCurrency
  );
  const healthFactor = nextHealthFactor(token, tokenAmount);
  if (healthFactor < 1.1) {
    // recalculate token amount until HF >= 1.1
  }
  borrowPower = tokenAmount;
  return borrowPower.isFinite() && !borrowPower.isNaN() ? borrowPower : 0;
};

const getTokenPrice = async token => {
  try {
    return await priceOracle.value.getAssetPrice(token);
  } catch (e) {
    throw new Error(e);
  }
};
</script>

<style lang="scss" scoped>
.loan-value-container {
  border-radius: 5px;
}

.circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.pink {
  background-color: #d989c6;
}
.lightblue {
  background-color: #6ad0d9;
}

.height-100 {
  height: 100%;
}
</style>
