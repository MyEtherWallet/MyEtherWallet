<template>
  <div>
    <v-row class="align-end justify-space-between">
      <!--
      =====================================================================================
        Search Data
      =====================================================================================
      -->
      <v-col v-if="hasSearch" cols="12" sm="6">
        <mew-search
          placeholder="Search Token Symbol"
          :value="searchInput"
          @input="setSearchInput"
        />
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
          active-class="buttonToggleDark white--text"
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
          no-data-text="You currently don't have any tokens."
          :loading="isLoadingData"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, defineProps, computed, onMounted } from 'vue';
import BigNumber from 'bignumber.js';
import { isBN, toBN } from 'web3-utils';

import {
  AAVE_TABLE_TITLE,
  INTEREST_TYPES,
  AAVE_TABLE_BUTTON,
  AAVE_TABLE_HEADER
} from '@/dapps/aave-dapp/handlers/helpers';
import {
  formatFloatingPointValue,
  formatPercentageValue
} from '@/core/helpers/numberFormatHelper';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import { EventBus } from '@/core/plugins/eventBus';
import { useRouter } from 'vue-router/composables';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';

// injections/use
const router = useRouter();
const { getFiatValue } = useGlobalStore();
const { balanceInETH, tokensList } = useWalletStore();

// props
const props = defineProps({
  title: {
    type: String,
    default: AAVE_TABLE_TITLE.deposit
  },
  hasSearch: {
    type: Boolean,
    default: true
  },
  hasToggle: {
    type: Boolean,
    default: true
  },
  userSummary: {
    type: Object,
    default: () => {}
  },
  isLoadingData: {
    type: Boolean,
    default: false
  },
  formatUsdValue: {
    type: Function,
    default: () => {}
  },
  userBorrowPower: {
    type: Function,
    default: () => {}
  },
  reservesData: {
    type: Array,
    default: () => []
  }
});

// data
const searchInput = ref('');
const toggleType = ref(0);

// computed
const userReservesData = computed(() => {
  return props.userSummary?.userReservesData || [];
});

const header = computed(() => {
  switch (props.title) {
    case AAVE_TABLE_TITLE.deposit:
      return AAVE_TABLE_HEADER.deposit;
    case AAVE_TABLE_TITLE.borrow:
      return AAVE_TABLE_HEADER.borrow;
    case AAVE_TABLE_TITLE.balance_deposit:
      return AAVE_TABLE_HEADER.balanceDeposit;
    default:
      return AAVE_TABLE_HEADER.balanceBorrow;
  }
});

const stableCoins = computed(() => {
  if (!props.isLoadingData) {
    const stableCoins = ['TUSD', 'DAI', 'USDT', 'USDC', 'sUSD'];
    const reserves = list.value?.filter(item => {
      if (stableCoins.includes(item.symbol)) return item;
    });
    return reserves;
  }
  return [];
});

const list = computed(() => {
  if (
    props.title === AAVE_TABLE_TITLE.deposit ||
    props.title === AAVE_TABLE_TITLE.borrow
  ) {
    return props.reservesData;
  }
  if (props.title === AAVE_TABLE_TITLE.balance_borrow) {
    return userReservesData.value.filter(item =>
      new BigNumber(item.totalBorrows).gt(0)
    );
  }
  if (props.title === AAVE_TABLE_TITLE.balance_deposit) {
    return userReservesData.value.filter(item =>
      new BigNumber(item.scaledATokenBalance).gt(0)
    );
  }

  return {};
});

/**
 * Returns formatted list of table data
 * Filters through search requests
 */
const listData = computed(() => {
  if (props.isLoadingData) {
    let localList = toggleType.value ? stableCoins : list;
    const userReserves = userReservesData.value;
    switch (props.title) {
      /**
       * Case: Aave Deposits Table used in Overlay
       */
      case AAVE_TABLE_TITLE.deposit:
        localList = list.value.map(item => {
          /* Get How much user has already deposited */
          const userDeposited = userReserves.find(uItem => {
            if (uItem.reserve.symbol === item.symbol) {
              return uItem;
            }
          });
          /* Get User Balance for the item */
          const findBalance =
            item.symbol === 'ETH'
              ? balanceInETH
              : tokensList.find(balance => {
                  if (item.symbol === balance.symbol) return balance;
                });

          const decimals = findBalance
            ? new BigNumber(10).pow(findBalance.decimals)
            : 0;
          const userBalance = findBalance
            ? new BigNumber(findBalance.balance).dividedBy(decimals).toFixed()
            : 0;
          const depositObj = Object.assign({}, AAVE_TABLE_BUTTON.deposit);
          depositObj.disabled = new BigNumber(userBalance).lte(0);

          AAVE_TABLE_BUTTON.swap.method = onSwapClick;
          return {
            price: item.price,
            token: item.symbol,
            available: userBalance
              ? formatFloatingPointValue(userBalance).value
              : '0',
            deposited: userDeposited
              ? formatFloatingPointValue(userDeposited.underlyingBalance).value
              : '0',
            apy: getDepositAPY(item.liquidityRate),
            tokenImg: `${item.icon}`,
            address: item.aToken.id,
            callToAction: [depositObj, AAVE_TABLE_BUTTON.swap]
          };
        });
        break;
      /**
       * Case: Aave Borrow Table used in Overlay
       */
      case AAVE_TABLE_TITLE.borrow:
        localList = list.value.reduce((arr, item) => {
          if (item.borrowingEnabled) {
            const available = formatFloatingPointValue(
              props.userBorrowPower(item)
            ).value;
            arr.push({
              token: item.symbol,
              available: available, // need to double check this
              stableApy: item.stableBorrowRateEnabled
                ? formatPercentageValue(
                    new BigNumber(item.stableBorrowAPY).multipliedBy(100)
                  ).value
                : '--',
              variableApy: formatPercentageValue(
                new BigNumber(item.variableBorrowAPY).multipliedBy(100)
              ).value,
              tokenImg: `${item.icon}`,
              address: item.aToken.id,
              callToAction: [
                {
                  ...AAVE_TABLE_BUTTON.borrow,
                  disabled: new BigNumber(available).lte(0)
                }
              ]
            });
          }
          return arr;
        }, []);
        break;
      /**
       * Case: Aave Existing Deposits Table
       */
      case AAVE_TABLE_TITLE.balance_deposit:
        localList = list.value.map(item => {
          const depositButton = Object.assign({}, AAVE_TABLE_BUTTON.deposit);
          AAVE_TABLE_BUTTON.withdraw.method = onWithdrawClick;
          depositButton.method = onDepositClick;
          const enableToggle = item.reserve.usageAsCollateralEnabled;
          const tokenBalance = item.reserve.tokenBalance;
          const enableDeposit = isBN(tokenBalance)
            ? tokenBalance.gt(toBN(0))
            : tokenBalance > 0;
          depositButton.disabled = !enableDeposit;
          return {
            token: item.reserve.symbol,
            tokenImg: `${item.reserve.icon}`,
            contract: item.reserve.aToken.id,
            decimals: item.reserve.decimals,
            price: BigNumber(item.reserve.priceInUSD).toString(),
            balance: [
              `${formatFloatingPointValue(item.underlyingBalance).value} ${
                item.reserve.symbol
              }`,
              getFiatValue(props.formatUsdValue(item.underlyingBalanceUSD))
            ],
            apy: getDepositAPY(item.reserve.liquidityRate),
            toggle: enableToggle
              ? {
                  color: 'secondary',
                  method: onToggleClick,
                  value: item.usageAsCollateralEnabledOnUser
                }
              : null,
            callToAction: [depositButton, AAVE_TABLE_BUTTON.withdraw]
          };
        });
        break;
      /**
       * Case: Aave Existing Borrowings Table
       */
      case AAVE_TABLE_TITLE.balance_borrow:
        localList = list.value.map(item => {
          AAVE_TABLE_BUTTON.repay.method = onRepayClick;
          AAVE_TABLE_BUTTON.borrow.method = onBorrowClick;
          const isVariable = item.variableBorrows > 0;
          const reserve = props.reservesData.find(reserve => {
            return reserve.symbol === item.reserve.symbol;
          });
          const enableToggle = reserve
            ? reserve.stableBorrowRateEnabled
            : false;
          const available = formatFloatingPointValue(
            props.userBorrowPower(reserve)
          ).value;
          const borrowObj = Object.assign({}, AAVE_TABLE_BUTTON.borrow);
          borrowObj.disabled =
            !reserve.borrowingEnabled || new BigNumber(available).lte(0);
          return {
            token: item.reserve.symbol,
            tokenImg: `${item.reserve.icon}`,
            contract: item.reserve.aToken.id,
            decimals: item.reserve.decimals,
            price: BigNumber(item.reserve.priceInUSD).toString(),
            balance: [
              `${formatFloatingPointValue(item.totalBorrows).value} ${
                item.reserve.symbol
              }`,
              getFiatValue(props.formatUsdValue(item.totalBorrowsUSD))
            ],
            apy: formatPercentageValue(
              new BigNumber(
                isVariable
                  ? item.reserve.variableBorrowAPY
                  : item.reserve.stableBorrowAPY
              )
                .times(100)
                .toString()
            ).value,
            toggle: enableToggle
              ? {
                  color: 'greenPrimary',
                  method: onToggleAprType,
                  value: isVariable,
                  label: isVariable
                    ? INTEREST_TYPES.variable
                    : INTEREST_TYPES.stable,
                  disabled: false
                }
              : null,
            callToAction: [borrowObj, AAVE_TABLE_BUTTON.repay]
          };
        });
        break;
      default:
        break;
    }
    return searchInput.value === null || searchInput.value === ''
      ? localList
      : localList.filter(item => {
          if (
            item.token.toLowerCase().includes(searchInput.value.toLowerCase())
          )
            return item;
        });
  }
  return [];
});

// mounted
onMounted(() => {
  /* Set Button styles to transparent for balance deposit table */
  if (
    props.title === AAVE_TABLE_TITLE.balance_deposit ||
    props.title === AAVE_TABLE_TITLE.balance_borrow
  ) {
    AAVE_TABLE_BUTTON.deposit.btnStyle = 'transparent';
    AAVE_TABLE_BUTTON.withdraw.btnStyle = 'transparent';
    AAVE_TABLE_BUTTON.borrow.btnStyle = 'transparent';
  }
  AAVE_TABLE_BUTTON.deposit.method = onDepositClick;
  AAVE_TABLE_BUTTON.borrow.method = onBorrowClick;
});

// methods
/**
 * Calculates Deposit APY
 */
const getDepositAPY = liqRate => {
  const ray = Math.pow(10, 27);
  const SECONDS_PER_YEAR = 31536000;
  const depositAPR = new BigNumber(liqRate).dividedBy(ray).toFixed();
  const depositAPY =
    Math.pow(1 + depositAPR / SECONDS_PER_YEAR, SECONDS_PER_YEAR) - 1;
  return formatPercentageValue(new BigNumber(depositAPY).multipliedBy(100))
    .value;
};

/**
 * Method emits to the parent to open deposit token overlay
 *  Used in deposit Button within the table
 */
const onDepositClick = newVal => {
  EventBus.$emit('selectedDeposit', newVal);
};
/**
 * Method emits to the parent to open deposit token overlay
 *  Used in deposit Button within the table
 */
const onBorrowClick = newVal => {
  EventBus.$emit('selectedBorrow', newVal);
};
/**
 * Method emits to the parent to open withdraw token overlay
 *  Used in withdraw Button within the table
 */
const onWithdrawClick = newval => {
  EventBus.$emit('withdrawToken', newval);
};
/**
 * Method open new tab with swap parameters
 *  Used in Swap Button within the table
 */
const onSwapClick = newVal => {
  router.push({
    name: ROUTES_WALLET.SWAP.NAME,
    query: {
      fromToken: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      toToken: newVal.address,
      amount: '1'
    }
  });
};

/**
 * Method emits to the parent to open repay overlay
 * Used in Repay Button borrowed token within the table
 * Within Borrow Balance table
 */
const onRepayClick = newVal => {
  EventBus.$emit('repayBorrowing', newVal);
};
/**
 * Method emits to the parent to open collateral overlay
 * Used in Toggle Button within the table
 * Within Deposit Balance table
 */
const onToggleClick = newVal => {
  EventBus.$emit('collateralChange', newVal);
};

const onToggleAprType = newVal => {
  EventBus.$emit('changeAprType', newVal);
};
/**
 * Method sets the search value
 */
const setSearchInput = val => {
  searchInput.value = val;
};
</script>
