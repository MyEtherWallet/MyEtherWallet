<template>
  <mew-module
    class="d-flex flex-grow-1 pt-6 bgWalletBlock module-send"
    title="Send"
    :has-elevation="true"
    :has-indicator="true"
  >
    <template #moduleBody>
      <!-- ===================================================================================== -->
      <!-- Tokens / Amount to Swap / Token Balance -->
      <!-- ===================================================================================== -->
      <v-row class="mt-5">
        <v-col cols="12" sm="6" class="pr-sm-1 pt-0 pb-0 pb-sm-4">
          <div class="position--relative">
            <app-button-balance
              :balance="selectedBalance"
              :loading="!showSelectedBalance"
              class="d-sm-none"
            />
            <mew-select
              ref="mewSelect"
              style="height: 62px"
              label="Token"
              :items="tokens"
              :is-custom="true"
              :value="selectedCurrency"
              @input="setCurrency"
            />
          </div>
        </v-col>
        <v-col cols="12" sm="6" class="pl-sm-1 pt-0 pb-2 pb-sm-4">
          <div class="position--relative">
            <app-button-balance
              :balance="selectedBalance"
              :loading="!showSelectedBalance"
              class="d-none d-sm-block"
            />
            <mew-input
              label="Amount"
              :value="amount"
              type="number"
              placeholder="0"
              :persistent-hint="true"
              :error-messages="amountErrorMessage"
              :max-btn-obj="maxBtn"
              :buy-more-str="buyMoreStr"
              class="AmountInput"
              @keydown.native="preventCharE($event)"
              @buyMore="
                () => {
                  openBuySell('ModuleSend');
                }
              "
              @input="val => setAmount(val, false)"
            />
          </div>
        </v-col>

        <!-- ===================================================================================== -->
        <!-- Low Balance Notice -->
        <!-- ===================================================================================== -->
        <v-col v-if="showBalanceNotice" cols="12" class="pt-0 pb-4">
          <send-low-balance-notice
            :address="address"
            :currency-name="currencyName"
            class="pa-3"
          />
        </v-col>

        <!-- ===================================================================================== -->
        <!-- Input Address -->
        <!-- ===================================================================================== -->
        <v-col cols="12" class="pt-4 pb-2">
          <module-address-book
            ref="addressInput"
            class="AddressInput"
            :currency="currencyName"
            @setAddress="setAddress"
          />
        </v-col>

        <!-- ===================================================================================== -->
        <!-- Network Fee (Note: comes with mt-5(20px) mb-8(32px))) -->
        <!-- ===================================================================================== -->
        <v-col cols="12" class="py-0 mb-8">
          <transaction-fee
            :show-fee="showSelectedBalance"
            :getting-fee="!txFeeIsReady"
            :error="feeError"
            :total-cost="totalCost"
            :tx-fee="txFee"
            :total-gas-limit="gasLimit"
            :message="feeError"
            :not-enough-eth="!hasEnoughEth"
            :from-eth="isFromNetworkCurrency"
            @onLocalGasPrice="handleLocalGasPrice"
          />
        </v-col>

        <!-- ===================================================================================== -->
        <!-- Advanced: -->
        <!-- ===================================================================================== -->
        <v-col cols="12" class="py-4">
          <mew-expand-panel
            ref="expandPanel"
            :panel-items="expandPanelItems"
            :idx-to-expand="openedPanels"
            @toggled="closeToggle"
          >
            <template #panelBody1>
              <div class="px-5">
                <!-- Warning Sheet -->
                <div
                  class="pa-5 warning greyPrimary--text border-radius--5px mb-8"
                >
                  <div class="d-flex font-weight-bold mb-2 textDark--text">
                    <v-icon class="textDark--text mew-body mr-1">
                      mdi-alert-outline</v-icon
                    >For advanced users only
                  </div>
                  <div class="textDark--text">
                    Please don't edit these fields unless you are an expert user
                    & know what you're doing. Entering the wrong information
                    could result in your transaction failing or getting stuck.
                  </div>
                </div>
                <div class="d-flex align-center justify-end pb-3">
                  <div
                    class="mew-body greenPrimary--text cursor--pointer"
                    @click="setGasLimit(defaultGasLimit)"
                  >
                    Reset to default: {{ formattedDefaultGasLimit }}
                  </div>
                </div>

                <mew-input
                  :value="gasLimit"
                  :label="t('common.gas.limit')"
                  placeholder=""
                  :error-messages="gasLimitError"
                  type="number"
                  @input="setGasLimit"
                />

                <mew-input
                  v-show="!isToken"
                  ref="dataInput"
                  v-model="data"
                  :label="t('sendTx.add-data')"
                  placeholder="0x..."
                  :rules="dataRules"
                  :error-messages="dataInvalidHexMessage"
                  :hide-clear-btn="data === '0x'"
                  class="mb-8"
                  @keyup.native="verifyHexFormat"
                  @focusout.native="verifyHexFormat"
                />
              </div>
            </template>
          </mew-expand-panel>
        </v-col>
      </v-row>

      <div class="d-flex flex-column mt-12">
        <div class="text-center">
          <mew-button
            title="Next"
            :has-full-width="false"
            btn-size="xlarge"
            :disabled="isDisabledNextBtn"
            class="SendButton"
            @click.native="send()"
          />
        </div>
        <div class="text-center mt-4">
          <mew-button
            :title="t('common.clear-all')"
            :has-full-width="false"
            btn-size="small"
            btn-style="transparent"
            @click.native="clear()"
          />
        </div>
      </div>
    </template>
  </mew-module>
</template>

<script setup>
import {
  defineAsyncComponent,
  defineProps,
  ref,
  computed,
  watch,
  onMounted,
  onBeforeMount
} from 'vue';
import { fromWei, isHexStrict } from 'web3-utils';
import { debounce, isEmpty, isNumber } from 'lodash';
import BigNumber from 'bignumber.js';

import { Toast, ERROR, WARNING } from '@/modules/toast/handler/handlerToast';

import {
  formatIntegerToString,
  toBNSafe
} from '@/core/helpers/numberFormatHelper';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import { fromBase, toBase } from '@/core/helpers/unit';
import SendTransaction from '@/modules/send/handlers/handlerSend';
import { useBuySell } from '@/core/composables/buyMore';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';

import { useI18n } from 'vue-i18n-composable';
import { useCustomStore } from '@/core/store/custom';

const ModuleAddressBook = defineAsyncComponent(() =>
  import('@/modules/address-book/ModuleAddressBook')
);
const TransactionFee = defineAsyncComponent(() =>
  import('@/modules/transaction-fee/TransactionFee')
);
const SendLowBalanceNotice = defineAsyncComponent(() =>
  import('./components/SendLowBalanceNotice.vue')
);

// injections
const { openBuySell } = useBuySell();
const { network, gasPrice, isEthNetwork, swapLink, getFiatValue } =
  useGlobalStore();
const { address, instance, balanceInETH, tokensList, hasGasPriceOption } =
  useWalletStore();
const { hiddenTokens } = useCustomStore();
const { t } = useI18n();
// props
const props = defineProps({
  prefilledAmount: {
    type: String,
    default: '0'
  },
  prefilledData: {
    type: String,
    default: '0x'
  },
  prefilledAddress: {
    type: String,
    default: ''
  },
  prefilledGasLimit: {
    type: String,
    default: '21000'
  }
});

// data
const gasLimit = ref('21000');
const toAddress = ref('');
const sendTx = ref(null);
const isValidAddress = ref(false);
const amount = ref('0');
const selectedCurrency = ref({});
const data = ref('0x');
const userInputType = ref('');
const expandPanelItems = ref([
  {
    name: t('common.advanced'),
    toggleTitle: 'Gas Limit & Data'
  }
]);
const openedPanels = ref([]);
const defaultGasLimit = ref('21000');
const gasLimitError = ref('');
const amountError = ref('');
const gasEstimationError = ref('');
const gasEstimationIsReady = ref(false);
const localGasPrice = ref('0');
const selectedMax = ref(false);
const debouncedGasLimitError = ref(null);
const debounceAmountError = ref(null);
const debounceEstimateGas = ref(null);
const dataInput = ref(null);
const addressInput = ref(null);
const expandPanel = ref(null);

// computed
const maxBtn = computed(() => {
  return hasGasPriceOption
    ? {}
    : {
        title: 'Max',
        disabled: disableSwapBtn,
        method: setEntireBal
      };
});
const isFromNetworkCurrency = computed(() => {
  return selectedCurrency.value?.contract === MAIN_TOKEN_ADDRESS;
});
const isDisabledNextBtn = computed(() => {
  return (
    feeError.value !== '' ||
    !isValidGasLimit.value ||
    !allValidInputs.value ||
    !gasEstimationIsReady.value ||
    !isHexStrict(data)
  );
});
const buyMoreStr = computed(() => {
  return isEthNetwork &&
    isFromNetworkCurrency.value &&
    amountError.value === 'Not enough balance to send!'
    ? network.type.canBuy
      ? 'Buy more.'
      : ''
    : '';
});
const hasEnoughEth = computed(() => {
  // Check whether user has enough eth to cover tx fee + amount to send
  if (isFromNetworkCurrency.value) {
    return BigNumber(amount).plus(txFeeETH).lte(balanceInETH);
  }
  // Check whether user has enough eth to cover tx fee + user has enough token balance for the amount to send
  return BigNumber(balanceInETH).gte(txFeeETH);
});
const feeError = computed(() => {
  return !hasEnoughEth.value
    ? `Not enough ${currencyName.value} to cover network fee.`
    : '';
});
const showSelectedBalance = computed(() => {
  return (
    !isEmpty(selectedCurrency) && selectedCurrency.value.text !== 'Select Token'
  );
});
const currencyName = computed(() => {
  return network.type.currencyName;
});
const showBalanceNotice = computed(() => {
  const isZero = BigNumber(balanceInETH).lte(0);
  const isLessThanTxFee =
    BigNumber(balanceInETH).gt(0) && BigNumber(txFeeETH).gt(balanceInETH);

  if (isZero || isLessThanTxFee) {
    return true;
  }

  return false;
});
const selectedBalance = computed(() => {
  if (selectedCurrency.value?.balance) {
    const balance = convertToDisplay(
      selectedCurrency.value.balance,
      selectedCurrency.value.decimals
    );
    return BigNumber(balance).toString();
  }
  return '0';
});
/**
 * Gets tokens from token list
 * Formats each token to be used in mew-select
 */
const tokens = computed(() => {
  // no ref copy
  const tokensList = tokensList.slice().filter(t => {
    return !t.isHidden;
  });
  const customTokens = customTokens.reduce((arr, item) => {
    // Check if token is in hiddenTokens
    const isHidden = hiddenTokens.find(token => {
      return item.contract == token.address;
    });
    item.decimals = BigNumber(item.decimals).toNumber();
    if (!isHidden) arr.push(item);
    return arr;
  }, []);
  const imgs = tokensList.map(item => {
    item.totalBalance = getFiatValue(item.usdBalancef);
    item.tokenBalance = item.balancef;
    item.price = getFiatValue(item.pricef);
    item.subtext = item.name;
    item.value = item.contract;
    item.name = item.symbol;
    return item.img;
  });
  BigNumber(balanceInETH).lte(0)
    ? tokensList.unshift({
        hasNoEth: true,
        disabled: true,
        text: 'Your wallet is empty.',
        linkText: isEthNetwork ? 'Buy ETH' : '',
        link: isEthNetwork ? swapLink : ''
      })
    : null;
  const returnedArray = [
    {
      text: 'Select Token',
      imgs: imgs.splice(0, 5),
      total: `${tokensList.length}`,
      divider: true,
      selectLabel: true
    },
    {
      header: 'My Wallet'
    },
    ...tokensList
  ];
  if (customTokens.length > 0) {
    return returnedArray.concat([
      {
        header: 'Custom Tokens'
      },
      ...customTokens
    ]);
  }
  return returnedArray;
});
/* Property returns either gas estimmation error or amount error*/
const amountErrorMessage = computed(() => {
  return gasEstimationError.value !== '' && sendTx.value?.hasEnoughBalance()
    ? gasEstimationError.value
    : amountError.value;
});
/**
 * Property checks if user input valid amount
 * Results to false if amount is empty, amount is negative, has invalid decimal points
 * @returns {boolean} true or false based on above params
 */
const isValidAmount = computed(() => {
  /** !amount */
  if (!amount.value) {
    return false;
  }
  if (!isNumber(selectedCurrency.value?.decimals)) {
    return false;
  }
  /** amount is negative */
  if (BigNumber(amount.value).lt(0)) {
    return false;
  }
  /** return amount has valid decimals */
  return SendTransaction.helpers.hasValidDecimals(
    amount.value,
    selectedCurrency.value.decimals
  );
});
const isValidGasLimit = computed(() => {
  if (gasLimit.value) {
    return (
      BigNumber(gasLimit.value).gt(0) &&
      BigNumber(gasLimit.value).dp() < 1 &&
      toBNSafe(gasLimit.value).gte(toBNSafe(defaultGasLimit.value))
    );
  }
  return false;
});
const dataRules = computed(() => {
  return [
    value => {
      return isHexStrict(value);
    }
  ];
});
const dataInvalidHexMessage = computed(() => {
  if (data.value === '') {
    return 'Data cannot be empty!';
  }
  if (isHexStrict(data.value)) {
    return '';
  }
  return 'Invalid hex data';
});
const isToken = computed(() => {
  if (sendTx.value && selectedCurrency.value?.contract)
    return sendTx.value.isToken();
  return false;
});
const multiwatch = computed(() => {
  return (
    amount.value,
    isValidAddress.value,
    data.value,
    selectedCurrency.value,
    new Date().getTime() / 1000
  );
});
const txFeeETH = computed(() => {
  return fromWei(txFee);
});
const currencyDecimals = computed(() => {
  return selectedCurrency.value?.hasOwnProperty('decimals')
    ? selectedCurrency.value.decimals
    : 18;
});
const totalCost = computed(() => {
  if (
    !SendTransaction.helpers.hasValidDecimals(
      amount.value,
      selectedCurrency.value?.decimals
    )
  )
    return '0';
  const amountToWei = toBase(amount.value, currencyDecimals.value);
  return isFromNetworkCurrency.value
    ? BigNumber(txFee).plus(amountToWei).toString()
    : txFee;
});
const txFee = computed(() => {
  if (isValidGasLimit.value) {
    return actualGasPrice.value.mul(toBNSafe(gasLimit.value)).toString();
  }
  return '0';
});
/**
 * Computed property determines whether or not show the loading state of the fee
 * Fee is loaded when: invalid amount, invalid gas limit
 * @return {boolean} true of false based on the above params
 */
const txFeeIsReady = computed(() => {
  return isValidAmount.value && isValidGasLimit.value;
});
const getCalculatedAmount = computed(() => {
  return toBase(amount.value ? amount.value : 0, currencyDecimals.value);
});
const allValidInputs = computed(() => {
  if (sendTx.value && sendTx.value.currency) {
    return (
      isValidAmount.value &&
      sendTx.value.hasEnoughBalance() &&
      isValidAddress.value
    );
  }
  return false;
});
const actualGasPrice = computed(() => {
  if (toBNSafe(localGasPrice.value).eqn(0)) {
    return toBNSafe(gasPrice.value);
  }
  return toBNSafe(localGasPrice.value);
});
const formattedDefaultGasLimit = computed(() => {
  return formatIntegerToString(defaultGasLimit.value);
});
const disableSwapBtn = computed(() => {
  if (!isEmpty(sendTx.value) && !isEmpty(selectedCurrency.value)) {
    return !sendTx.value.hasEnoughBalance();
  }
  return true;
});
const isValidForGas = computed(() => {
  return (
    sendTx.value &&
    sendTx.value.currency &&
    isValidAmount.value &&
    isValidAddress.value
  );
});

const isPrefilled = computed(() => {
  return (
    props.prefilledAmount === '0' ||
    props.prefilledData === '0x' ||
    props.prefilledAddress === '' ||
    props.props.prefilledGasLimit === '21000'
  );
});

// watch
watch(multiwatch, () => {
  if (allValidInputs.value) {
    debounceEstimateGas();
  }
});
watch(isPrefilled, () => {
  prefillForm();
});
watch(
  tokensList,
  newVal => {
    selectedCurrency.value = newVal.length > 0 ? newVal[0] : {};
    if (sendTx.value) {
      sendTx.value.setCurrency(selectedCurrency.value);
    }
  },
  { deep: true, immediate: true }
);
watch(toAddress, () => {
  if (isValidAddress.value) {
    sendTx.value.setTo(toAddress, userInputType);
  }
});
watch(amount, newVal => {
  // make sure amount never becomes null
  if (!newVal) amount.value = '0';
  if (isValidAmount.value) {
    sendTx.value.setValue(getCalculatedAmount);
  }
  amountError.value = '';
  gasEstimationError.value = '';
  if (isValidForGas.value) debounceEstimateGas();
  debounceAmountError(newVal);
});
watch(
  selectedCurrency,
  newVal => {
    if (sendTx.value) {
      sendTx.value.setCurrency(newVal);
      gasEstimationIsReady.value = false;
      gasEstimationError.value = '';
      if (isValidForGas.value) debounceEstimateGas();
      debounceAmountError(amount.value);
      gasLimit.value = defaultGasLimit;
    }
    data.value = '0x';
  },
  {
    immediate: true,
    deep: true
  }
);
watch(data, () => {
  if (!data.value) data.value = '0x';
  if (isHexStrict(data.value)) sendTx.value.setData(data.value);
});
watch(gasLimit, newVal => {
  if (isValidGasLimit.value) {
    sendTx.value.setGasLimit(gasLimit.value);
  }
  gasLimitError.value = '';
  debouncedGasLimitError(newVal);
});
watch(network, () => {
  clear();
  const currentGasPrice = gasPrice;
  // wait for gas price to update after network is updated
  const x = setInterval(() => {
    if (gasPrice !== currentGasPrice) {
      localGasPrice.value = gasPrice;
      sendTx.value.setLocalGasPrice(actualGasPrice.value);
      clearInterval(x);
    }
  }, 500);
});
watch(address, () => {
  clear();
  debounceAmountError('0');
});
watch(txFeeETH, newVal => {
  if (!isEmpty(selectedCurrency)) localGasPriceWatcher(newVal);
});

// mounted
onMounted(() => {
  setSendTransaction();
  gasLimit.value = props.prefilledGasLimit;
  selectedCurrency.value = tokensList[0];
  sendTx.value.setCurrency(selectedCurrency.value);
  sendTx.value.setLocalGasPrice(actualGasPrice.value);
});

// created
onBeforeMount(() => {
  debouncedGasLimitError.value = debounce(value => {
    setGasLimitError(value);
  }, 1000);
  debounceAmountError.value = debounce(value => {
    setAmountError(value);
  }, 1000);
  debounceEstimateGas.value = debounce(() => {
    if (isValidForGas.value) {
      estimateAndSetGas();
    }
  }, 500);
});

// methods
const localGasPriceWatcher = newVal => {
  const total = BigNumber(newVal).plus(amount.value);
  const amt = toBase(amount.value, selectedCurrency.value?.decimals);
  const balance = toBNSafe(selectedCurrency.value.balance);

  if (
    (selectedMax.value &&
      selectedCurrency.value &&
      isFromNetworkCurrency.value &&
      total.gt(balanceInETH)) ||
    (selectedCurrency.value && !isFromNetworkCurrency.value && balance.lt(amt))
  ) {
    setEntireBal();
  }
};
const verifyHexFormat = () => {
  dataInput.value._data.inputValue = data;
  if (!data.value || isEmpty(data)) {
    data.value = '0x';
    dataInput.value._data.inputValue = '0x';
  }
};
/**
 * Resets values to default
 */
const clear = () => {
  if (addressInput.value) addressInput.value.clear();
  toAddress.value = '';
  selectedCurrency.value = tokensList[0];
  sendTx.value = null;
  isValidAddress.value = false;
  amount.value = '0';
  data.value = '0x';
  userInputType.value = '';
  defaultGasLimit.value = '21000';
  gasLimitError.value = '';
  amountError.value = '';
  gasEstimationError.value = '';
  gasEstimationIsReady.value = false;
  localGasPrice.value = '0';

  // resets the defaults on mount
  setSendTransaction();
  gasLimit.value = props.prefilledGasLimit;
  sendTx.value.setCurrency(selectedCurrency.value);
  handleLocalGasPrice(gasPrice.value);
};
/**
 * Method sets gas limit to default when Advanced closed , ONLY IF gasLimit was invalid
 */
const closeToggle = () => {
  if (!isValidGasLimit.value) {
    gasLimit.value = defaultGasLimit.value;
    setGasLimitError(gasLimit.value);
  }
};
/**
 * Method sets amountError based on the user input
 * Has to be set manualy and debouned otherwise error message is not displayed when tokens are switched and amount input component is out of focus
 * @param passedValue {string}
 */
const setAmountError = passedValue => {
  if (passedValue) {
    if (BigNumber(passedValue).lt(0)) {
      amountError.value = "Amount can't be negative!";
    } else if (
      selectedCurrency.value?.decimals &&
      !SendTransaction.helpers.hasValidDecimals(
        passedValue,
        selectedCurrency.value.decimals
      )
    ) {
      amountError.value = 'Invalid decimal points';
    } else if (sendTx.value && sendTx.value.currency) {
      amountError.value = sendTx.value.hasEnoughBalance()
        ? ''
        : 'Not enough balance to send!';
    } else {
      amountError.value = '';
    }
  } else {
    amountError.value = 'Required';
  }
};
/**
 * Method sets gasLimitError based on the user input
 * Has to be set manualy and debouned otherwise error message is not displayed when tokens are switched and gas limit input component is out of focus
 * @param passedValue {string}
 */
const setGasLimitError = passedValue => {
  if (passedValue) {
    if (BigNumber(passedValue).lte(0))
      gasLimitError.value = 'Gas limit must be greater than 0';
    else if (BigNumber(passedValue).dp() > 0)
      gasLimitError.value = 'Gas limit can not have decimal points';
    else if (toBNSafe(passedValue).lt(toBNSafe(defaultGasLimit.value)))
      gasLimitError.value = 'Amount too low. Transaction will fail';
    else {
      gasLimitError.value = '';
    }
  } else {
    gasLimitError.value = 'Required';
  }
};
const setAddress = (addr, isValidAddress, userInputType) => {
  toAddress.value = addr;
  isValidAddress.value = isValidAddress;
  userInputType.value = userInputType;
};
const setSendTransaction = () => {
  localGasPrice.value = gasPrice;
  sendTx.value = new SendTransaction();
};
const estimateAndSetGas = () => {
  gasEstimationIsReady.value = false;
  if (selectedCurrency.value.contract !== sendTx.value.currency.contract) {
    sendTx.value.setCurrency(selectedCurrency);
  }
  sendTx.value
    .estimateGas()
    .then(res => {
      gasLimit.value = toBNSafe(res).toString();
      defaultGasLimit.value = toBNSafe(res).toString();
      setGasLimitError(gasLimit.value);
      sendTx.value.setGasLimit(res);
      gasEstimationError.value = '';
      gasEstimationIsReady.value = true;
    })
    .catch(e => {
      gasEstimationError.value = e.message;
      gasEstimationIsReady.value = false;
    });
};
const send = () => {
  window.scrollTo(0, 0);
  sendTx.value
    .submitTransaction()
    .then(() => {
      clear();
    })
    .catch(error => {
      if (!instance) {
        Toast(error, {}, ERROR);
      }
    });
};
const prefillForm = () => {
  if (isPrefilled.value) {
    data.value = isHexStrict(props.prefilledData) ? props.prefilledData : '0x';
    amount.value = props.prefilledAmount;
    toAddress.value = props.prefilledAddress;
    gasLimit.value = props.prefilledGasLimit;
    expandPanel.value.setToggle(true);
    Toast(t('sendTx.prefilled-warning'), {}, WARNING, 1000);
  }
};
const convertToDisplay = (amount, decimals) => {
  const amt = toBNSafe(amount).toString();
  return decimals ? fromBase(amt, decimals).toString() : amt;
};
const setEntireBal = () => {
  if (isEmpty(selectedCurrency) || isFromNetworkCurrency) {
    const amt = BigNumber(balanceInETH).minus(txFeeETH);
    setAmount(amt.lt(0) ? '0' : amt.toFixed(), true);
  } else {
    setAmount(
      convertToDisplay(
        selectedCurrency.value.balance,
        selectedCurrency.value.decimals
      ),
      true
    );
  }
};
const setAmount = debounce((val, max) => {
  const value = val ? val : 0;
  amount.value = BigNumber(value).toFixed();
  selectedMax.value = max;
}, 500);
const setGasLimit = value => {
  gasLimit.value = value;
};
const setCurrency = value => {
  selectedCurrency.value = value;
  amount.value = '0';
};
const handleLocalGasPrice = e => {
  localGasPrice.value = e;
  sendTx.value.setLocalGasPrice(e);
};
const preventCharE = e => {
  if (e.key === 'e') e.preventDefault();
};
</script>

<style lang="scss" scoped>
.border-bottom {
  border-bottom: 2px dotted #f5f5f5;
}

.balance-container {
  top: -15px;
  position: absolute;
  right: 15px;
}
</style>

<style lang="scss">
.module-send .mew-input .v-input__slot {
  height: 56px !important;
}
</style>
