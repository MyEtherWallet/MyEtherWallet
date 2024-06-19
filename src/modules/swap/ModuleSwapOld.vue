<template>
  <div class="mew-component--swap">
    <white-sheet>
      <mew-module
        :has-elevation="true"
        :has-indicator="true"
        class="d-flex flex-grow-1 pt-6"
        title="Swap"
      >
        <template v-if="isAvailable" #moduleBody>
          <!--
            =====================================================================================
              From / Amount to Swap / To / Amount to Recieve
            =====================================================================================
            -->
          <div class="input-swap-container pt-7 pb-3 px-5">
            <v-row class="align-start justify-space-between mt-4">
              <v-col cols="12" sm="5" class="pb-0 pb-sm-3 pr-sm-0">
                <div class="position--relative">
                  <app-button-balance
                    v-show="!isFromNonChain"
                    :loading="isLoading"
                    :balance="displayBalance"
                  />
                  <mew-select
                    :value="fromTokenType"
                    label="From"
                    :items="actualFromTokens"
                    :is-custom="true"
                    :loading="isLoading"
                    @input="setFromToken"
                  />
                </div>
                <mew-input
                  ref="amountInput"
                  label="Amount"
                  placeholder="0"
                  type="number"
                  class="FromAmountInput mt-2"
                  :value="tokenInValue"
                  :persistent-hint="true"
                  :error-messages="amountErrorMessage"
                  :disabled="loadingWalletInfo"
                  :buy-more-str="
                    amountErrorMessage === errorMsgs.amountExceedsEthBalance ||
                    amountErrorMessage === errorMsgs.amountEthIsTooLow
                      ? network.type.canBuy
                        ? 'Buy more.'
                        : ''
                      : null
                  "
                  :max-btn-obj="maxBtn"
                  @buyMore="
                    () => {
                      openBuySell('ModuleSwapInput');
                    }
                  "
                  @keydown.native="preventCharE($event)"
                  @input="val => triggerSetTokenInValue(val, false)"
              /></v-col>
              <v-col
                cols="12"
                align-self="center"
                sm="2"
                class="px-6 py-0 py-sm-3 mb-3 mb-sm-0"
              >
                <div class="d-flex align-center justify-center pb-sm-10">
                  <mew-icon-button
                    mdi-icon="swap-horizontal"
                    class="pa-2 d-flex align-center justify-center SwitchTokens buttonGrayLight"
                    color-theme="textDark"
                    btn-style="light"
                    :disabled="!enableTokenSwitch"
                    @click.native="switchTokens"
                  />
                </div>
              </v-col>
              <v-col cols="12" sm="5" class="pb-0 pb-sm-3 pl-sm-0">
                <mew-select
                  :value="toTokenType"
                  :items="actualToTokens"
                  :is-custom="true"
                  :loading="isLoading"
                  label="To"
                  class="ToTokenSelect"
                  @input="setToToken"
                />
                <mew-input
                  label="Amount"
                  placeholder="0"
                  type="number"
                  :hide-clear-btn="true"
                  :value="tokenOutValue"
                  is-read-only
                  class="mt-2"
                />
              </v-col>
            </v-row>
          </div>

          <!--
          =====================================================================================
            User Message Block: store your Bitcoin on Ethereum
          =====================================================================================
          -->
          <app-user-msg-block
            v-if="!hasMinEth"
            class="mt-5"
            :message="msg.lowBalance"
          >
            <div class="mt-3 mx-n1">
              <mew-button
                btn-size="small"
                btn-style="outline"
                :title="`Buy ${network.type.currencyName}`"
                class="ma-1"
                :has-full-width="$vuetify.breakpoint.xsOnly"
                @click.native="
                  () => {
                    openBuySell('ModuleSwapErrorBlock');
                  }
                "
              />
            </div>
          </app-user-msg-block>

          <!--
            =====================================================================================
              Address Book
            =====================================================================================
            -->
          <div class="mt-8">
            <module-address-book
              v-if="isFromNonChain"
              ref="refundAddressInput"
              class="FromAddressInput"
              :label="nativeLabel"
              :is-valid-address-func="isValidRefundAddress"
              @setAddress="setRefundAddr"
            />
            <module-address-book
              v-show="showToAddress"
              ref="toAddressInput"
              class="ToAddressInput"
              :is-valid-address-func="isValidToAddress"
              :label="toAddressLabel"
              @setAddress="setToAddress"
            />
          </div>

          <!--
          =====================================================================================
            User Message Block: store your Bitcoin on Ethereum
          =====================================================================================
          -->
          <app-user-msg-block
            v-if="
              toTokenType &&
              toTokenType.value &&
              toTokenType.value.toLowerCase() == 'bitcoin' &&
              isEthNetwork
            "
            class="mt-sm-5"
            :message="msg.storeBitcoin"
          >
            <div class="border-top mt-3">
              <v-expansion-panels
                flat
                class="expansion-panels--remove-paddings"
              >
                <v-expansion-panel>
                  <v-expansion-panel-header
                    color="greyLight"
                    class="textLight--text"
                  >
                    How can I get wrapped Bitcoin?
                  </v-expansion-panel-header>
                  <v-expansion-panel-content color="greyLight" class="pa-0">
                    <div class="textLight--text mb-2">
                      When you swap to Bitcoin, it is moved to the Bitcoin
                      blockchain, & requires a Bitcoin wallet. In order to keep
                      Bitcoin in MyEtherWallet, you can swap to wrapped Bitcoin
                      instead. Wrapped Bitcoin is an Ethereum token, with a
                      value approximately equal to 1 BTC. Wrapped Bitcoins can
                      be stored in MEW, and can be used as any other Ethereum
                      asset: you can swap it to other tokens, use it as
                      collateral in DeFi apps, etc. There are multiple kinds of
                      wrapped Bitcoins, but they roughly do the same thing.
                      <a
                        :href="getArticle('mv-btc-to-eth-mew-swap')"
                        target="_blank"
                      >
                        Learn more about Wrapped Bitcoin.
                      </a>
                    </div>
                    <v-row class="mt-6">
                      <v-col cols="12" md="4">
                        <mew-button
                          btn-size="small"
                          btn-style="outline"
                          title="Swap to renBTC"
                          :has-full-width="true"
                          @click.native="swapTo('renBTC')"
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <mew-button
                          btn-size="small"
                          btn-style="outline"
                          title="Swap to wBTC"
                          :has-full-width="true"
                          @click.native="swapTo('wBTC')"
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <mew-button
                          btn-size="small"
                          btn-style="outline"
                          title="Swap to PBTC"
                          :has-full-width="true"
                          @click.native="swapTo('PBTC')"
                        />
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </app-user-msg-block>

          <!--
            =====================================================================================
             Providers List
            =====================================================================================
            -->
          <div v-if="hasMinEth">
            <v-slide-y-transition v-if="showAnimation" hide-on-leave group>
              <swap-provider-mentions
                key="showAnimation"
                :is-loading="isLoadingProviders"
                :check-loading="checkLoading"
                @showProviders="showProviders"
              />
            </v-slide-y-transition>
            <div v-else key="showAnimation1">
              <swap-providers-list
                :step="step"
                :available-quotes="availableQuotes"
                :set-provider="setProvider"
                :to-token-symbol="toTokenType ? toTokenType.symbol : ''"
                :to-token-icon="toTokenType ? toTokenType.img : ''"
                :is-loading="isLoadingProviders"
                :providers-error="providersErrorMsg"
                :class="isFromNonChain ? '' : 'mt-7'"
                :selected-provider-id="selectedProviderId"
              />
              <p v-if="hasGasPriceOption && step >= 1" class="error--text">
                {{
                  feeError
                    ? feeError
                    : providersErrorMsg
                    ? providersErrorMsg.subtitle
                    : ''
                }}
              </p>
              <!--
                  =====================================================================================
                  Swap Fee
                  =====================================================================================
                -->
              <transaction-fee
                v-if="showNetworkFee"
                :is-from-chain="!isFromNonChain"
                :show-fee="showSwapFee"
                :getting-fee="loadingFee"
                :error="feeError"
                :total-cost="totalCost"
                :tx-fee="txFee"
                :total-gas-limit="totalGasLimit"
                :not-enough-eth="notEnoughEth"
                :from-eth="isFromTokenMain"
                is-swap
                class="mt-10 mt-sm-16"
                @onLocalGasPrice="handleLocalGasPrice"
              />
              <div v-if="showNextButton" class="text-center mt-10 mt-sm-15">
                <mew-button
                  title="Next"
                  :has-full-width="true"
                  :disabled="disableNext"
                  btn-size="xlarge"
                  class="NextButton"
                  style="max-width: 240px"
                  @click.native="showConfirm()"
                />
              </div>
            </div>
          </div>
        </template>
        <!--
          =====================================================================================
           Message is SWAP NOT Available
          =====================================================================================
        -->
        <template v-else #moduleBody>
          <div class="swap-not-available">
            <app-user-msg-block :message="swapNotAvailableMes" />
          </div>
        </template>
      </mew-module>
    </white-sheet>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { toBN, fromWei, toWei, isAddress } from 'web3-utils';
import { debounce, isEmpty, clone, isUndefined, isObject } from 'lodash';
import xss from 'xss';
import MultiCoinValidator from 'multicoin-address-validator';
import BigNumber from 'bignumber.js';
import { useRoute } from 'vue-router/composables';

import Notification, {
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUS
} from '@/modules/notifications/handlers/handlerNotification';
import NonChainNotification from '@/modules/notifications/handlers/nonChainNotification';
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook';
import TransactionFee from '@/modules/transaction-fee/TransactionFee';
import SwapProvidersList from './components/SwapProvidersList.vue';
import SwapProviderMentions from './components/SwapProviderMentions.vue';
import { Toast, ERROR, SUCCESS } from '@/modules/toast/handler/handlerToast';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import { TRENDING_LIST } from './handlers/configs/configTrendingTokens';
import { SWAP } from '@/modules/analytics-opt-in/handlers/configs/events.js';
import Swapper from './handlers/handlerSwap';
import handleError from '../confirmation/handlers/errorHandler';
import { fromBase, toBase } from '@/core/helpers/unit';
import { useBuySell } from '@/core/composables/buyMore';
import { useAmplitude } from '@/core/composables/amplitude';
import { useSwapStore } from '@/core/store/swap';
import { useWalletStore } from '@/core/store/wallet';
import { useGlobalStore } from '@/core/store/global';
import { useExternalStore } from '@/core/store/external';
import { useArticleStore } from '@/core/store/article';
import { useNotificationStore } from '@/core/store/notifications';

// injections
const { trackSwapAmplitude } = useAmplitude();
const { openBuySell } = useBuySell();
const { prefetched, swapTokens, setSwapTokens } = useSwapStore();
const {
  web3,
  address,
  balance,
  identifier,
  loadingWalletInfo,
  balanceInETH,
  tokensList,
  balanceInWei,
  hasGasPriceOption
} = useWalletStore();
const { gasPriceType, network, isEthNetwork, gasPriceByType, getFiatValue } =
  useGlobalStore();

const {
  coinGeckoTokens,
  balanceFiatValue,
  contractToToken,
  getCoinGeckoTokenById
} = useExternalStore();
const { addNotification } = useNotificationStore();
const { getArticle } = useArticleStore();
const route = useRoute();

// props
const props = defineProps({
  fromToken: {
    type: String,
    default: MAIN_TOKEN_ADDRESS
  },
  amount: {
    type: String,
    default: '0'
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

// data
const swapNotAvailableMes = {
  title: `Swap is not available on this network`,
  subtitle: 'Please select ETH, BNB or MATIC networks to use this feature.'
};
const MIN_GAS_LIMIT = 400000;
let localContractToToken = {};
const step = ref(0);
const confirmInfo = ref({
  to: '',
  from: '',
  fromImg: '',
  toImg: '',
  fromType: '',
  toType: '',
  validUntil: 0,
  selectedProvider: '',
  txFee: ''
});
const swapper = ref(null);
const toTokenType = ref({});
const fromTokenType = ref({});
const tokenInValue = ref(props.amount);
const tokenOutValue = ref('0');
const availableTokens = ref({ toTokens: [], fromTokens: [] });
const availableQuotes = ref([]);
const currentTrade = ref(null);
const allTrades = ref([]);
const isLoading = ref(true);
const loadingFee = ref(false);
const feeError = ref('');
const defaults = ref({
  fromToken: props.fromToken
});
const isLoadingProviders = ref(false);
const showAnimation = ref(false);
const checkLoading = ref(true);
const addressValue = ref({});
const selectedProvider = ref({});
const refundAddress = ref('');
const isValidRefundAddr = ref(false);
const localGasPrice = ref('0');
const mainTokenDetails = ref({});
const cachedAmount = ref('0');
const selectedProviderId = ref(undefined);
const abortSetTokenValue = ref(false);
const clearingSwap = ref(false);
const maxLoading = ref(false);
const refundAddressInput = ref(null);
const toAddressInput = ref(null);

// computed
const nativeLabel = computed(() => {
  return `Your ${fromTokenType.value?.name} refund address`;
});

const showNetworkFee = computed(() => {
  return props.showNextButton.value && !props.isFromNonChain.value;
});

const showNextButton = computed(() => {
  return (
    step.value > 0 &&
    providersErrorMsg.value.subtitle === '' &&
    !isLoadingProviders.value
  );
});

const maxBtn = computed(() => {
  return hasGasPriceOption.value ||
    isFromNonChain.value ||
    availableBalance.value.isZero()
    ? {}
    : {
        title: 'Max',
        disabled:
          !hasMinEth &&
          amountErrorMessage.value === errorMsgs.amountEthIsTooLow,
        method: setMaxAmount,
        loading: maxLoading.value
      };
});

const errorMsgs = computed(() => {
  return {
    amountEthIsTooLow: `You do not have enough ${network.type.currencyName} to swap.`,
    amountExceedsEthBalance: `Amount exceeds your ${network.type.currencyName} balance.`,
    amountExceedsTxFee: `Amount entered doesn't allow for transaction fee`,
    amountLessThan0: 'Swap amount must be greater than 0',
    doNotOwnToken: 'You do not own this token'
  };
});

const msg = computed(() => {
  return {
    lowBalance: {
      title: `Your ${network.type.currencyName} balance is too low`,
      subtitle: `Every transaction requires a small amount of ${network.type.currencyName} to execute. Even if you have tokens to swap, when your ${network.type.currencyName} balance is close to zero, you won't be able to send anything until you fund your account.`
    },
    storeBitcoin: {
      title: `Did you know? You can store your Bitcoin on ${network.type.name_long}`,
      subtitle: `To swap to BTC you need a Bitcoin wallet, but you can swap to wrapped Bitcoin instead and store it in your ${network.type.name_long} wallet.`
    }
  };
});

const disableNext = computed(() => {
  const disableSet =
    step.value < 2 ||
    amountErrorMessage.value !== '' ||
    feeError.value !== '' ||
    !hasSelectedProvider.value ||
    providersErrorMsg.value.subtitle !== '' ||
    loadingFee.value;
  if (fromTokenType.value?.isEth) {
    return disableSet;
  }
  return (
    disableSet ||
    (!refundAddress.value &&
      !isValidRefundAddr.value &&
      currentTrade.value?.length === 0)
  );
});

const providersErrorMsg = computed(() => {
  let msg = '';
  let subError = '';
  if (!isLoading.value) {
    if (new BigNumber(tokenInValue.value).lt(selectedProvider.value.minFrom)) {
      msg = 'The minimum requirement for this provider is';
      subError = `${selectedProvider.value.minFrom} ${fromTokenType.value?.symbol}`;
    } else if (
      new BigNumber(tokenInValue.value).gt(selectedProvider.value.maxFrom)
    ) {
      msg = 'The maximum requirement for this provider is';
      subError = `${selectedProvider.value.maxFrom} ${fromTokenType.value?.symbol}`;
    } else if (availableQuotes.value.length === 0) {
      msg =
        'No providers found for this token pair. Select a different token pair or try again later.';
    } else if (
      selectedProvider.value.rate === '0' ||
      feeError.value === 'Invalid Input'
    ) {
      msg =
        'Provided input is invalid or provider is having issues. Please try again!';
    }
  }
  return {
    subtitle: msg,
    subtitleError: subError
  };
});

const enableTokenSwitch = computed(() => {
  return (
    !isLoading.value &&
    ((!isEmpty(fromTokenType.value) && !isEmpty(fromTokenType.value?.symbol)) ||
      (!isEmpty(toTokenType.value) && !isEmpty(toTokenType.value?.symbol)))
  );
});

const isFromTokenMain = computed(() => {
  if (isLoading.value) return false;
  return fromTokenType.value?.contract === MAIN_TOKEN_ADDRESS;
});

const isFromNonChain = computed(() => {
  if (isLoading.value || fromTokenType.value?.contract === undefined)
    return false;
  return fromTokenType.value?.hasOwnProperty('isEth')
    ? !fromTokenType.value?.isEth
    : !isAddress(fromTokenType.value?.contract);
});

const displayBalance = computed(() => {
  return availableBalance.value.toString();
});

const actualToTokens = computed(() => {
  if (isLoading.value) return [];

  const validToTokens = formatTokenPrice(
    toTokens.value.filter(item => {
      if (
        item.contract.toLowerCase() !==
        fromTokenType.value?.contract?.toLowerCase()
      )
        return item;
    })
  );
  const filteredTrendingTokens = formatTokenPrice(
    trendingTokens().filter(token => {
      return token.contract !== fromTokenType.value?.contract;
    })
  );
  const nonChainTokens = validToTokens.reduce((arr, item) => {
    if (
      item.hasOwnProperty('isEth') &&
      !item.isEth &&
      item.name &&
      item.symbol &&
      item.subtext &&
      item.symbol !== network.type.currencyName
    ) {
      delete item['tokenBalance'];
      delete item['totalBalance'];
      arr.push(item);
    }
    return arr;
  }, []);
  let returnableTokens = [
    {
      text: 'Select Token',
      imgs: getPlaceholderImgs(),
      total: `${toTokens.value.length}`,
      divider: true,
      selectLabel: true
    }
  ];
  if (filteredTrendingTokens.length) {
    returnableTokens = returnableTokens.concat([
      {
        header: 'Trending'
      },
      ...filteredTrendingTokens
    ]);
  }
  if (nonChainTokens.length > 0) {
    returnableTokens = returnableTokens.concat([
      {
        header: 'Cross-Chain Tokens'
      },
      ...nonChainTokens
    ]);
  }

  return returnableTokens.concat([
    {
      header: 'All'
    },
    ...validToTokens
  ]);
});

const toTokens = computed(() => {
  if (isLoading.value) return [];
  return availableTokens.value.toTokens.reduce((arr, token) => {
    if (token && localContractToToken[token.contract])
      arr.push(localContractToToken[token.contract]);
    return arr;
  }, []);
});

const actualFromTokens = computed(() => {
  if (isLoading.value) return [];
  let validFromTokens = fromTokens.value.filter(
    item =>
      item.contract.toLowerCase() !== toTokenType.value?.contract?.toLowerCase()
  );
  let tradebleWalletTokens = tokensList.value.filter(item => {
    for (const vt of validFromTokens) {
      if (vt.contract.toLowerCase() === item?.contract?.toLowerCase())
        return item;
    }
  });
  tradebleWalletTokens.forEach(token => {
    validFromTokens = validFromTokens.filter(item => {
      if (token?.contract?.toLowerCase() !== item.contract.toLowerCase()) {
        return item;
      }
    });
  });
  const nonChainTokens = fromTokens.value.reduce((arr, item) => {
    if (
      item.hasOwnProperty('isEth') &&
      !item.isEth &&
      item.name &&
      item.symbol &&
      item.subtext &&
      item.symbol !== network.type.currencyName
    ) {
      delete item['tokenBalance'];
      delete item['totalBalance'];
      item = checkMultiChainToken(item);
      arr.push(item);
    }
    return arr;
  }, []);
  tradebleWalletTokens = formatTokensForSelect(tradebleWalletTokens);
  let returnableTokens = [
    {
      text: 'Select Token',
      imgs: getPlaceholderImgs(true),
      total:
        tokensList.value.length > 0
          ? tokensList.value.length
          : `${toTokens.value.length}`,
      divider: true,
      selectLabel: true
    },
    {
      header: 'My Wallet'
    },
    ...tradebleWalletTokens
  ];
  if (nonChainTokens.length > 0) {
    returnableTokens = returnableTokens.concat([
      {
        header: 'Cross-Chain Tokens'
      },
      ...nonChainTokens
    ]);
  }
  return returnableTokens.concat([
    {
      header: 'All'
    },
    ...validFromTokens
  ]);
});

const fromTokens = computed(() => {
  if (isLoading.value) return [];
  return availableTokens.value.fromTokens.reduce((arr, token) => {
    if (token && localContractToToken[token.contract])
      arr.push(localContractToToken[token.contract]);
    return arr;
  }, []);
});

const txFee = computed(() => {
  return toBN(totalGasLimit.value).mul(toBN(localGasPrice.value)).toString();
});

const totalCost = computed(() => {
  const amount = isFromTokenMain.value ? tokenInValue.value : '0';
  const amountWei = toWei(amount);
  return BigNumber(txFee.value).plus(amountWei).toString();
});

const totalGasLimit = computed(() => {
  if (currentTrade.value) {
    let totalGas = toBN(0);
    currentTrade.value.transactions?.forEach(tx => {
      totalGas = totalGas.add(toBN(tx.gas));
    });
    return totalGas.toString();
  }
  return '0';
});

const toAddress = computed(() => {
  if (!toTokenType.value?.isEth) {
    if (!isEmpty(addressValue.value)) {
      return addressValue.value.isValid ? addressValue.value.value : address;
    }
    return address;
  }

  if (toTokenType.value?.contract === MAIN_TOKEN_ADDRESS) {
    return address;
  }
  if (toTokenType.value?.isEth) return address;
  return address;
});

const hasMinEth = computed(() => {
  if (
    !isEmpty(fromTokenType.value) &&
    fromTokenType.value.hasOwnProperty('isEth') &&
    !fromTokenType.value.isEth
  ) {
    return true;
  }

  return toBN(balanceInWei.value).gte(
    toBN(localGasPrice.value).muln(MIN_GAS_LIMIT)
  );
});

const notEnoughEth = computed(() => {
  try {
    const balanceAfterFees = toBN(balanceInWei.value).sub(
      toBN(totalCost.value)
    );
    return balanceAfterFees.isNeg();
  } catch (e) {
    return true;
  }
});

const showToAddress = computed(() => {
  if (typeof toTokenType.value?.isEth === 'undefined') return false;
  return !toTokenType.value?.isEth;
});

const availableBalance = computed(() => {
  if (!loadingWalletInfo.value && fromTokenType.value?.name) {
    const hasBalance = tokensList.value.find(
      token =>
        token.contract.toLowerCase() ===
        fromTokenType.value.contract.toLowerCase()
    );
    const tokenBalance =
      !isEmpty(hasBalance) &&
      !isEmpty(hasBalance.balance) &&
      hasBalance.hasOwnProperty('decimals')
        ? getTokenBalance(hasBalance.balance, hasBalance.decimals)
        : new BigNumber(0);
    return isFromTokenMain.value
      ? getTokenBalance(balanceInWei.value, 18)
      : tokenBalance;
  }

  return new BigNumber(0);
});

const showSwapFee = computed(() => {
  return step.value >= 2 && availableBalance.value.gt(0);
});

const amountErrorMessage = computed(() => {
  if (
    !loadingWalletInfo.value &&
    !isLoading.value &&
    fromTokenType.value?.name
  ) {
    if (availableBalance.value.lte(0)) {
      return isFromTokenMain.value
        ? errorMsgs.value.amountEthIsTooLow
        : tokensList.value.length > 0 && !isFromTokenMain && !isFromNonChain
        ? errorMsgs.value.doNotOwnToken
        : new BigNumber(tokenInValue.value).lt(0)
        ? errorMsgs.value.amountLessThan0
        : '';
    }
    if (
      !Swapper.helpers.hasValidDecimals(
        tokenInValue.value,
        fromTokenType.value.decimals
      )
    ) {
      return `Provided amount exceeds valid decimal.`;
    }
    if (!hasMinEth.value) {
      return errorMsgs.value.amountEthIsTooLow;
    }
    if (tokenInValue.value && tokenInValue.value !== '') {
      if (new BigNumber(tokenInValue.value).lt(0)) {
        return errorMsgs.value.amountLessThan0;
      }
      if (
        isFromTokenMain.value &&
        availableBalance.value.lt(new BigNumber(tokenInValue.value))
      ) {
        return errorMsgs.value.amountExceedsEthBalance;
      }
      if (
        !isFromTokenMain &&
        availableBalance.value.lt(new BigNumber(tokenInValue.value))
      ) {
        return `Amount exceeds your ${fromTokenType.value.symbol} balance.`;
      }
      if (
        new BigNumber(tokenInValue.value).lt(selectedProvider.value.minFrom)
      ) {
        return `Amount below ${selectedProvider.value.minFrom} ${fromTokenType.value.symbol} min`;
      }
      if (
        new BigNumber(tokenInValue.value).gt(selectedProvider.value.maxFrom)
      ) {
        return `Amount over ${selectedProvider.value.maxFrom} ${fromTokenType.value.symbol} max`;
      }
    }
  }
  return '';
});

const hasSelectedProvider = computed(() => {
  return !isEmpty(selectedProvider.value);
});

const toAddressLabel = computed(() => {
  const name =
    !isEmpty(toTokenType.value) && toTokenType.value.hasOwnProperty('name')
      ? toTokenType.value.name
      : 'ETH';
  return `To ${name} address`;
});

const multipleWatcher = computed(() => {
  return address, web3, tokensList, coinGeckoTokens;
});

// watch
watch(
  () => multipleWatcher,
  () => {
    resetSwapState();
  }
);

watch(
  () => tokenInValue.value,
  () => {
    feeError.value = '';
  }
);

watch(
  () => gasPriceByType,
  () => {
    if (currentTrade.value) currentTrade.value.gasPrice = localGasPrice.value;
  }
);

watch(
  () => txFee.value,
  () => {
    checkFeeBalance();
  },
  { immediate: true }
);

watch(
  () => selectedProvider.value,
  newVal => {
    if (isEmpty(newVal)) {
      selectedProviderId.value = undefined;
    }
  }
);

watch(
  () => defaults.value,
  () => {
    setDefaults();
  },
  { deep: true, immediate: true }
);

watch(
  () => amountErrorMessage.value,
  newVal => {
    if (newVal !== '') availableQuotes.value.splice(0);
  }
);

watch(
  () => route.query,
  () => {
    setTokenFromURL();
  }
);

watch(
  () => fromTokenType,
  newVal => {
    fromTokenType.value = newVal;
  },
  { deep: true, immediate: false }
);

watch(
  () => toTokenType,
  newVal => {
    toTokenType.value = newVal;
  },
  { deep: true, immediate: false }
);

// onBeforeUnmount
onBeforeUnmount(() => {
  abortSetTokenValue.value = true;
});

// onBeforeMount
onBeforeMount(() => {
  setTokenFromURL();
});

// onMounted
onMounted(() => {
  abortSetTokenValue.value = false;
  // multi value watcher to clear
  // refund address and to address
  if (coinGeckoTokens.size > 0) {
    resetSwapState();
  }
});

// methods
const resetSwapState = () => {
  mainTokenDetails.value = contractToToken(MAIN_TOKEN_ADDRESS);
  localContractToToken = {};
  localContractToToken[MAIN_TOKEN_ADDRESS] = mainTokenDetails.value;
  setupSwap();
};

const checkMultiChainToken = item => {
  const multiChainTokens = ['USDT', 'SRM', 'DOGE']; // Hardcoding for now
  const name = item.name;
  if (name.includes('SOL') || name.includes('OMNI') || name.includes('DOGE')) {
    for (let i = 0; i < multiChainTokens.length; i++) {
      const token = multiChainTokens[i];
      if (name.includes(token)) {
        const networks = {
          OMNI: 'Omni',
          SOL: 'Solana',
          DOGE: 'Dogecoin'
        };
        const contractNetwork =
          networks[name !== 'DOGE' ? name.replace(token, '') : name];
        item.subtext = `${token} - ${contractNetwork}`;
        break;
      }
    }
  }
  return item;
};

const setRefundAddr = (address, valid) => {
  refundAddress.value = address;
  isValidRefundAddr.value = valid;
  setTokenInValue(tokenInValue.value);
};

const trendinTokens = () => {
  if (!TRENDING_LIST[network.type.name]) return [];
  return TRENDING_LIST[network.type.name]
    .map(token => {
      return localContractToToken[token.contract];
    })
    .filter(token => token);
};

const setupTokenInfo = tokens => {
  tokens.forEach(token => {
    if (localContractToToken[token.contract]) return;
    if (
      token.isEth === false &&
      (token.contract?.toLowerCase() === '0xeth' ||
        token.contract?.toLowerCase().includes('matic') ||
        token.contract?.toLowerCase().includes('bnb'))
    )
      return;
    if (token.cgid) {
      const foundToken = getCoinGeckoTokenById(token.cgid);
      foundToken.price = getFiatValue(foundToken.pricef);
      const name = foundToken.name;
      foundToken.name = token.symbol;
      foundToken.value = foundToken.contract;
      foundToken.subtext = name;
      foundToken.symbol = token.symbol || foundToken.symbol;
      setToLocaContractToToken(Object.assign({}, token, foundToken));
      return;
    }
    const foundToken = contractToToken(token.contract);
    if (foundToken) {
      const name = foundToken.name || foundToken.subtext;
      foundToken.contract = token.contract;
      foundToken.price = getFiatValue(foundToken.pricef);
      foundToken.isEth = token.isEth;
      foundToken.name = token.symbol || foundToken.symbol;
      foundToken.value = foundToken.contract;
      foundToken.subtext = name;
      setToLocaContractToToken(foundToken);
      return;
    }
    token.price = '';
    token.subtext = token.name;
    token.value = token.contract;
    token.name = token.symbol || token.subtext;
    setToLocaContractToToken(token);
  });
};

const setToLocalContractToToken = token => {
  if (token.name === '' || token.symbol === '' || token.subtext === '') {
    return;
  }
  localContractToToken[token.contract] = token;
};

const setToAddress = (value, isValid) => {
  addressValue.value = {
    value,
    isValid
  };
  setTokenInValue(tokenInValue.value);
};

const swapTo = to => {
  const findToken = toTokens.value.find(
    item => item.symbol.toLowerCase() === to.toLowerCase()
  );
  toTokenType.value = findToken;
};

const setupSwap = () => {
  if (isAvailable.value) {
    isLoading.value = !prefetched;
    swapper.value = new Swapper(web3, network.type.name);
    if (!prefetched) {
      swapper.value
        .getAllTokens()
        .then(tokens => {
          setupTokenInfo(tokens);
        })
        .then(() => {
          isLoading.value = false;
        });
    } else {
      setupTokenInfo(swapTokens);
      isLoading.value = false;
    }

    localGasPrice.value = gasPriceByType(gasPriceType);
  }
};

const clear = () => {
  clearingSwap.value = true;
  step.value = 0;
  confirmInfo.value = {
    to: '',
    from: '',
    fromImg: '',
    toImg: '',
    fromType: '',
    toType: '',
    validUntil: 0,
    selectedProvider: '',
    txFee: '',
    actualTrade: {}
  };

  swapper.value = null;
  toTokenType.value = {};
  fromTokenType.value = getDefaultFromToken();
  tokenInValue.value = '0';
  tokenOutValue.value = '0';
  availableTokens.value = { toTokens: [], fromTokens: [] };
  availableQuotes.value = [];
  currentTrade.value = null;
  allTrades.value = [];
  isLoading.value = false;
  loadingFee.value = false;
  feeError.value = '';
  selectedProviderId.value = undefined;
  defaults.value = {
    fromToken: fromToken
  };
  isLoadingProviders.value = false;
  checkLoading.value = true;
  addressValue.value = {};
  selectedProvider.value = {};
  localGasPrice.value = '0';
  if ($refs.amountInput) $refs.amountInput.clear();
  refundAddress.value = '';
  isValidRefundAddr.value = false;
  maxLoading.value = false;
  setupSwap();
};

const formatTokensForSelect = tokens => {
  if (!Array.isArray(tokens)) return [];
  return tokens.map(t => {
    t.totalBalance = t.hasOwnProperty('usdBalancef')
      ? getFiatValue(t.usdBalancef)
      : getFiatValue('0.00');
    t.tokenBalance = t.hasOwnProperty('balancef') ? t.balancef : '0.00';
    t.price = t.hasOwnProperty('pricef')
      ? getFiatValue(t.pricef)
      : getFiatValue('0.00');
    t.name = t.hasOwnProperty('symbol') ? t.symbol : '';
    return t;
  });
};

const formatTokenPrice = tokens => {
  if (!Array.isArray(tokens)) return [];
  return tokens.map(t => {
    t.price = t.hasOwnProperty('pricef')
      ? getFiatValue(t.pricef)
      : getFiatValue('0.00');
    return t;
  });
};

const resetAddressValues = ({ clearRefund = true, clearTo = true }) => {
  if (clearRefund)
    if (refundAddressInput.value) {
      refundAddressInput.value.clear();
    }
  if (clearTo)
    if (toAddressInput.value) {
      toAddressInput.value.clear();
    }
  selectedProvider.value = {};
};

const setMaxAmount = () => {
  maxLoading.value = true;
  if (
    !isEmpty(toTokenType.value) &&
    toTokenType.value.isEth &&
    toTokenType.hasOwnProperty('symbol') &&
    isFromTokenMain
  ) {
    const fromAmount = toBase(availableBalance, fromTokenType.value.decimals);
    try {
      swapper.value
        .getAllQuotes({
          fromT: fromTokenType.value,
          toT: toTokenType.value,
          fromAmount: fromAmount
        })
        .then(quotes => {
          const highest = quotes.sort(
            (a, b) =>
              BigNumber(b.amount).toNumber() - BigNumber(a.amount).toNumber()
          );
          const swapObj = {
            fromAddress: address,
            toAddress: toAddress,
            provider: highest[0].provider,
            fromT: fromTokenType.value,
            toT: toTokenType.value,
            quote: highest[0],
            fromAmount: fromAmount
          };

          swapper.value.getTrade(swapObj).then(trade => {
            trade['gasPrice'] = localGasPrice.value;
            let parsedGasLimit = BigNumber(0);
            trade.transactions.forEach(tx => {
              parsedGasLimit = parsedGasLimit.plus(tx.gas);
            });
            const tokenInValue = new BigNumber(availableBalance)
              .minus(
                fromWei(
                  toBN(localGasPrice.value).muln(parsedGasLimit.toNumber())
                )
              )
              .toFixed();
            setTokenInValue(tokenInValue);
            maxLoading.value = false;
          });
        });
      return;
    } catch (e) {
      setMaxWithoutEstimate();
    }
  }
  setMaxWithoutEstimate();
};

const setMaxWithoutEstimate = () => {
  const gasLimit = toTokenType && !toTokenType.isEth ? 21000 : MIN_GAS_LIMIT;
  const availableBalanceMinusGas = new BigNumber(availableBalance.value).minus(
    fromWei(toBN(localGasPrice).muln(gasLimit))
  );
  tokenInValue.value = isFromTokenMain
    ? availableBalanceMinusGas.gt(0)
      ? availableBalanceMinusGas.toFixed()
      : '0'
    : availableBalance.value.toFixed();
  maxLoading.value = false;
};

const getDefaultFromToken = () => {
  const findToken = actualFromTokens.find(item => {
    if (item.contract === defaults.value.fromToken) return item;
  });
  if (
    defaults.value.fromToken === MAIN_TOKEN_ADDRESS &&
    new BigNumber(balanceInETH).gt(0)
  ) {
    return findToken;
  }
  return findToken ? findToken : actualFromTokens[0];
};

const getDefaultToToken = () => {
  const findToken = actualToTokens.find(item => {
    if (item.contract === defaults.value.toToken) return item;
  });
  if (
    defaults.value.toToken === MAIN_TOKEN_ADDRESS &&
    new BigNumber(balanceInETH).gt(0)
  ) {
    return mainTokenDetails.value;
  }
  return findToken ? findToken : actualToTokens[0];
};

const getPlaceholderImgs = () => {
  if (tokensList.length > 0) {
    return tokensList.slice(0, 5).map(item => {
      return item.img ? item.img : network.type.icon;
    });
  }
  return [];
};

const switchTokens = () => {
  const fromToken = fromTokenType.value;
  const toToken = toTokenType.value || actualToTokens[0];
  const tokenOutValue = tokenOutValue.value;
  fromTokenType.value = {};
  toTokenType.value = {};
  tokenOutValue.value = '0';
  const toTokenFromTokenList = actualFromTokens.find(item => {
    if (item && item.contract === toToken?.contract) return item;
  });
  setFromToken(toTokenFromTokenList ? toTokenFromTokenList : toToken);
  setToToken(fromToken);
  setTokenInValue(tokenOutValue);
};

const processTokens = (tokens, storeTokens) => {
  setupTokenInfo(tokens.fromTokens);
  setupTokenInfo(tokens.toTokens);
  setupTokenInfo(TRENDING_LIST[network.type.name]);
  availableTokens.value = tokens;
  setDefaults();
  if (isUndefined(storeTokens)) {
    setSwapTokens(tokens);
  }
};

const setDefaults = () => {
  setTimeout(() => {
    fromTokenType.value = getDefaultFromToken();
    toTokenType.value = getDefaultToToken();
    setTokenInValue(tokenInValue.value);
    clearingSwap.value = false;
  }, 500);
};

const setFromToken = value => {
  if (
    value === undefined ||
    (!value?.hasOwnProperty('isEth') &&
      value?.contract?.toLowerCase() !== MAIN_TOKEN_ADDRESS)
  ) {
    const foundToken = actualFromTokens.filter(item => {
      if (
        item?.contract &&
        item?.contract?.toLowerCase() === value?.contract?.toLowerCase()
      )
        return item;
    });
    value = foundToken.length > 0 ? foundToken[0] : actualFromTokens[0];
  }
  fromTokenType.value = value;
  resetAddressValues({ clearTo: false });
  nextTick(() => {
    if (value && value.name && !clearingSwap) {
      trackSwapAmplitude(SWAP.FIELD_INPUTS, {
        fromToken: value.name
      });
    }
    setTokenInValue(tokenInValue.value);
  });
};

const setToToken = value => {
  if (!value?.hasOwnProperty('isEth')) {
    const foundToken = actualToTokens.filter(item => {
      if (
        item?.contract &&
        item?.contract?.toLowerCase() === value?.contract?.toLowerCase()
      )
        return item;
    });
    value = foundToken[0];
  }
  toTokenType.value = value;
  resetAddressValues({ clearRefund: false });
  if (value && value.name) {
    trackSwapAmplitude(SWAP.FIELD_INPUTS, {
      toToken: value.name
    });
  }
  setTokenInValue(tokenInValue.value);
};

const triggerSetTokenInValue = debounce(function (val) {
  setTokenInValue(val);
}, 500);

const setTokenInValue = value => {
  if (abortSetTokenValue.value) return;
  belowMinError.value = false;
  if (isLoading.value || loadingWalletInfo.value) return;
  const val = value ? value : 0;
  tokenInValue.value = BigNumber(val).toFixed();
  if (
    !isFromNonChain &&
    (availableBalance.lt(new BigNumber(tokenInValue.value)) || !hasMinEth)
  ) {
    step.value = 0;
    return;
  }
  if (isEmpty(fromTokenType)) {
    Toast('From token cannot be empty!', {}, ERROR);
    return;
  }
  if (
    !Swapper.helpers.hasValidDecimals(
      tokenInValue.value,
      fromTokenType.value.decimals
    )
  ) {
    return;
  }
  tokenOutValue.value = '0';
  availableQuotes.value.forEach(q => {
    if (q) {
      q.isSelected = false;
    }
  });
  availableQuotes.value = [];
  allTrades.value = [];
  step.value = 0;
  if (isFromNonChain && (refundAddress === '' || !isValidRefundAddr)) return;
  if (showToAddress && !addressValue?.isValid) return;
  if (
    !isEmpty(toTokenType) &&
    toTokenType.hasOwnProperty('isEth') &&
    !toTokenType.isEth &&
    (isEmpty(addressValue) || (!isEmpty(addressValue) && !addressValue.isValid))
  ) {
    return;
  }
  if (
    !BigNumber(value).isNaN() &&
    BigNumber(value).gt(0) &&
    !isEmpty(fromTokenType) &&
    !isEmpty(toTokenType) &&
    !isEmpty(fromTokenType?.symbol) &&
    !isEmpty(toTokenType?.symbol)
  ) {
    isLoadingProviders.value = true;
    showAnimation.value = true;
    cachedAmount.value = tokenInValue.value;
    trackSwapAmplitude(SWAP.FIELD_INPUTS, {
      FromAmount: toBase(tokenInValue.value, fromTokenType.value.decimals)
    });
    swapper
      .getAllQuotes({
        fromT: fromTokenType,
        toT: toTokenType,
        fromAmount: toBase(tokenInValue.value, fromTokenType.value.decimals)
      })
      .then(quotes => {
        if (tokenInValue.value === cachedAmount.value) {
          selectedProvider.value = {};
          if (quotes.length) {
            lastSetToken.value = quotes[0].amount;
            availableQuotes.value = quotes.reduce((arr, q) => {
              if (quotes.length === 1 || BigNumber(q.amount).gt(0)) {
                q.rate = new BigNumber(q.amount)
                  .dividedBy(new BigNumber(tokenInValue.value))
                  .toString();
                q.isSelected = false;
                arr.push(q);
              }
              return arr;
            }, []);
            tokenOutValue.value = quotes[0].amount;
          }
          step.value = 1;
          isLoadingProviders.value = false;
        } else {
          isLoadingProviders.value = false;
        }
      });
  }
};

const setProvider = (idx, clicked) => {
  belowMinError.value = false;
  availableQuotes.value.forEach((q, _idx) => {
    if (_idx === idx) {
      selectedProviderId.value = _idx;
      q.isSelected = true;
      tokenOutValue.value = q.amount;
      getTrade(idx);
      if (!clicked) {
        selectedProvider.value = q;
        if (!clearingSwap) {
          trackSwapAmplitude(SWAP.FIELD_INPUTS, {
            SelectRate: q.amount
          });
        }
      } else {
        selectedProvider = q.amount !== selectedProvider.amount ? q : {};
      }
    }
  });
};

const getTrade = idx => {
  if (isFromNonChain && !isValidRefundAddr) {
    return;
  }
  if (isFromNonChain && !isValidRefundAddr) {
    return;
  }

  if (availableQuotes.length === 0) {
    return;
  }

  if (BigNumber(availableQuotes[idx].minFrom).gt(tokenInValue)) {
    return;
  }

  feeError.value = '';
  if (allTrades.length > 0 && allTrades[idx]) return setupTrade(allTrades[idx]);
  if (!allTrades[idx]) {
    loadingFee.value = true;
  }
  // don't fetch trade for 0 rate quote
  if (BigNumber(availableQuotes[idx].rate).lte(0)) {
    return;
  }
  const swapObj = {
    fromAddress: address,
    toAddress: toAddress,
    provider: availableQuotes[idx].provider,
    fromT: fromTokenType,
    toT: toTokenType,
    quote: availableQuotes[idx],
    fromAmount: toBase(tokenInValue, fromTokenType.decimals)
  };
  if (isFromNonChain) {
    swapObj['refundAddress'] = refundAddress;
  }
  const trade = swapper.getTrade(swapObj);
  if (trade instanceof Promise) {
    trade.then(tradeResponse => {
      if (!tradeResponse) {
        const index = availableQuotes.indexOf(swapObj.quote);
        if (index > -1) {
          // Remove the quote
          availableQuotes.splice(index, 1);
        }
        feeError.value = 'There was an issue with the provider';
        return;
      }
      if (tokenInValue === cachedAmount) {
        if (
          isObject(tradeResponse) &&
          tradeResponse.hasOwnProperty('provider')
        ) {
          allTrades[idx] = tradeResponse;
        }
        setupTrade(tradeResponse);
      }
    });
  } else {
    setupTrade(trade);
  }
};

const setupTrade = trade => {
  loadingFee.value = false;
  if (availableQuotes.value.length > 0) {
    step.value = 2;
  }
  if (trade instanceof Error || !trade) {
    feeError.value = 'There was an issue with the provider';
    return;
  }
  feeError.value = '';
  currentTrade.value = trade;
  currentTrade.value.gasPrice = localGasPrice.value;
  if (!isFromNonChain) {
    checkFeeBalance();
  }
};

const showConfirm = () => {
  trackSwapAmplitude(SWAP.NEXT_CLICKED);
  setConfirmInfo();
  executeTrade();
};

const setConfirmInfo = () => {
  const toPrice = toTokenType.price ? toTokenType.price : 0;
  const fromPrice = fromTokenType.price ? fromTokenType.price : 0;
  const obj = {
    from: address,
    to: toAddress,
    fromType: fromTokenType.symbol,
    toType: toTokenType.symbol,
    fromImg: fromTokenType.img,
    toImg: toTokenType.img,
    fromVal: tokenInValue,
    toVal: tokenOutValue,
    toUsdVal: BigNumber(toPrice).times(tokenOutValue).toFixed(),
    fromUsdVal: BigNumber(fromPrice).times(tokenInValue).toFixed(),
    validUntil: new Date().getTime() + 10 * 60 * 1000,
    selectedProvider: selectedProvider,
    txFee: txFee,
    gasPriceType: gasPriceType,
    actualTrade: currentTrade,
    fromTokenType: fromTokenType,
    toTokenType: toTokenType
  };
  if (isFromNonChain) {
    obj['refundAddress'] = refundAddress;
  }
  confirmInfo.value = obj;
};

const isValidToAddress = address => {
  if (availableQuotes.value.length > 0) {
    return swapper.value.isValidToAddress({
      provider: availableQuotes.value[0].provider,
      toT: toTokenType.value,
      address
    });
  }
  if (toTokenType.value.isEth) {
    return MultiCoinValidator.validate(address, 'Ethereum');
  }
  try {
    return MultiCoinValidator.validate(address, toTokenType.value.name);
  } catch (e) {
    return swapper.value.isValidToAddress({
      provider: 'changelly',
      toT: toTokenType.value,
      address
    });
  }
};

const isValidRefundAddress = address => {
  try {
    return MultiCoinValidator.validate(address, fromTokenType.value.name);
  } catch (e) {
    return swapper.value.isValidToAddress({
      provider: 'changelly',
      toT: fromTokenType.value,
      address
    });
  }
};

const executeTrade = () => {
  const currentTradeCopy = clone(currentTrade.value);
  swapper.value
    .executeTrade(currentTrade.value, confirmInfo.value)
    .then(res => {
      swapNotificationFormatter(res, currentTradeCopy);
    })
    .catch(err => {
      if (
        err.message === 'Batch transaction rejected in between transactions!'
      ) {
        Toast(err && err.message ? err.message : err, {}, ERROR);
        clear();
        return;
      }
      if (err && err.statusObj?.hashes?.length > 0) {
        err.statusObj.hashes.forEach(item => {
          const error = handleError(item);
          if (error) Toast(error, {}, ERROR);
        });
        return;
      }
      const error = handleError(err);
      if (error) Toast(err && err.message ? err.message : err, {}, ERROR);
    });
};

const getTokenBalance = (balance, decimals) => {
  return new BigNumber(fromBase(balance, decimals));
};

const swapNotificationFormatter = (obj, currentTrade) => {
  obj.hashes.forEach((hash, idx) => {
    const main = {
      from: address,
      type: NOTIFICATION_TYPES.SWAP,
      network: network.type?.name,
      status: NOTIFICATION_STATUS.PENDING,
      fromTxData: {
        currency: confirmInfo.value.fromType,
        amount: confirmInfo.value.fromVal,
        icon: confirmInfo.value.fromImg
      },
      toTxData: {
        currency: confirmInfo.value.toType,
        amount: confirmInfo.value.toVal,
        icon: confirmInfo.value.toImg,
        to: confirmInfo.value.to
      }
    };

    if (isFromNonChain) {
      const notif = Object.assign(
        {
          swapObj: obj,
          to: toAddress.value
        },
        main
      );
      addNotification(new NonChainNotification(notif));
      const currency = toTokenType.value?.symbol;
      Toast(
        `Swap initiated, you should receive ${currency} in 1-3 hours. You will be notified when it's completed`,
        {},
        SUCCESS
      );
      clear();
    } else {
      const notif = Object.assign(
        {
          hash,
          swapObj: obj
        },
        main,
        currentTrade.transactions[idx]
      );
      addNotification(new Notification(notif));
      clear;
    }
  });
};

const checkFeeBalance = () => {
  feeError.value = '';
  if (notEnoughEth.value) {
    feeError.value = `Not enough ${network.type.currencyName} to pay for transaction fee.`;
  }
};

const setTokenFromURL = () => {
  if (Object.keys(route.query).length > 0) {
    const { fromToken, toToken, amount } = stripQuery(route.query);
    defaults.value = {
      fromToken,
      toToken
    };
    tokenInValue.value = amount ? `${amount}` : '0';
  }
};

const stripQuery = queryObj => {
  const newObj = {};
  Object.keys(queryObj).forEach(key => {
    newObj[key] = xss(queryObj[key]);
  });
  return newObj;
};

const showProviders = val => {
  if (!isLoadingProviders.value && val) {
    showAnimation.value = false;
  }
};

const handleLocalGasPrice = e => {
  localGasPrice.value = e;
  trackSwapAmplitude(SWAP.FIELD_INPUTS, {
    TransactionFee: e
  });
};

const preventCharE = e => {
  if (e.key === 'e') e.preventDefault();
};
</script>

<style lang="scss" scoped>
.input-swap-container {
  box-shadow: 0px 4px 4px rgb(11 40 64 / 4%), 0px 2px 10px rgb(11 40 64 / 6%),
    0px 3px 16px rgb(11 40 64 / 4%);
  border-radius: 10px;
}

.v-input--selection-controls {
  padding: 0;
  margin: 0;
}

.border-top {
  border-top: 1px solid var(--v-greyMedium-base);
}

.swap-not-available {
  @media (min-width: 960px) {
    min-height: 45vh;
  }
}
</style>
