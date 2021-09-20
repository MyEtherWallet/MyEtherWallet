<template>
  <mew-module
    class="d-flex flex-grow-1 pt-6"
    title="Send"
    :has-elevation="true"
    :has-indicator="true"
  >
    <template #moduleBody>
      <!--
      =====================================================================================
        Tokens / Amount to Swap / Token Balance
      =====================================================================================
      -->
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
              placeholder="0"
              :value="amount"
              type="number"
              :persistent-hint="true"
              :error-messages="amountErrorMessage"
              :max-btn-obj="{
                title: 'Max',
                disabled: false,
                method: setEntireBal
              }"
              :buy-more-str="buyMore"
              @input="setAmount"
            />
          </div>
        </v-col>
        <!--
        =====================================================================================
          Low Balance Notice
        =====================================================================================
        -->
        <v-col v-if="showBalanceNotice" cols="12" class="pt-0 pb-4">
          <send-low-balance-notice
            :address="address"
            :currency-name="currencyName"
            class="pa-3"
          />
        </v-col>
        <!--
        =====================================================================================
          Input Address
        =====================================================================================
        -->
        <v-col cols="12" class="pt-4 pb-2">
          <module-address-book ref="addressInput" @setAddress="setAddress" />
        </v-col>
        <!--
      =====================================================================================
        Network Fee (Note: comes with mt-5(20px) mb-8(32px)))
      =====================================================================================
      -->
        <v-col cols="12" class="py-0">
          <app-network-fee
            :show-fee="showSelectedBalance"
            :getting-fee="!txFeeIsReady"
            :error="feeError"
            :total-fees="txFee"
            :gas-price-type="localGasType"
            :message="feeError"
            :not-enough-eth="!hasEnoughEth"
            @onLocalGasPrice="handleLocalGasPrice"
          />
        </v-col>
        <!--
      =====================================================================================
        Advanced:
      =====================================================================================
      -->
        <v-col cols="12" class="py-4">
          <mew-expand-panel
            ref="expandPanel"
            is-toggle
            has-dividers
            :panel-items="expandPanel"
            @toggled="closeToggle"
          >
            <template #panelBody1>
              <!-- Warning Sheet -->
              <div
                class="pa-5 warning textBlack2--text border-radius--5px mb-8"
              >
                <div class="d-flex font-weight-bold mb-2">
                  <v-icon class="textBlack2--text mew-body mr-1">
                    mdi-alert-outline</v-icon
                  >For advanced users only
                </div>
                <div>
                  Please don’t edit these fields unless you are an expert user &
                  know what you’re doing. Entering the wrong information could
                  result in your transaction failing or getting stuck.
                </div>
              </div>
              <div class="d-flex align-center justify-end pb-3">
                <div
                  class="mew-body primary--text cursor--pointer"
                  @click="setGasLimit(defaultGasLimit)"
                >
                  Reset to default: {{ formattedDefaultGasLimit }}
                </div>
              </div>

              <mew-input
                :value="gasLimit"
                :label="$t('common.gas.limit')"
                placeholder=""
                :error-messages="gasLimitError"
                type="number"
                @input="setGasLimit"
              />

              <mew-input
                v-show="!isToken"
                v-model="data"
                :label="$t('sendTx.add-data')"
                placeholder="0x..."
                :rules="dataRules"
                class="mb-8"
              />
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
            @click.native="send()"
          />
        </div>
        <div class="text-center mt-4">
          <mew-button
            :title="$t('common.clear-all')"
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

<script>
import { fromWei, toBN, isHexStrict, _, toWei } from 'web3-utils';
import { mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import SendTransaction from '@/modules/send/handlers/handlerSend';
import { ETH } from '@/utils/networks/types';
import { Toast, WARNING } from '@/modules/toast/handler/handlerToast';
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook';
import SendLowBalanceNotice from './components/SendLowBalanceNotice.vue';
import AppButtonBalance from '@/core/components/AppButtonBalance';
import AppNetworkFee from '@/core/components/AppNetworkFee.vue';
import { formatIntegerToString } from '@/core/helpers/numberFormatHelper';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
export default {
  components: {
    ModuleAddressBook,
    SendLowBalanceNotice,
    AppButtonBalance,
    AppNetworkFee
  },
  props: {
    prefilledAmount: {
      type: String,
      default: '0'
    },
    prefilledData: {
      type: String,
      default: ''
    },
    prefilledAddress: {
      type: String,
      default: ''
    },
    prefilledGasLimit: {
      type: String,
      default: '21000'
    }
  },
  data() {
    return {
      gasLimit: '21000',
      toAddress: '',
      sendTx: null,
      isValidAddress: false,
      amount: '0',
      selectedCurrency: {},
      data: '0x',
      userInputType: '',
      expandPanel: [
        {
          name: this.$t('common.advanced'),
          subtext: 'Gas Limit & Data'
        }
      ],
      localGasPrice: '0',
      localGasType: 'economy',
      defaultGasLimit: '21000',
      gasLimitError: '',
      amountError: '',
      gasEstimationError: '',
      gasEstimationIsReady: false
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'web3', 'address']),
    ...mapState('global', ['online', 'gasPriceType']),
    ...mapGetters('external', ['fiatValue', 'balanceFiatValue']),
    ...mapGetters('global', [
      'network',
      'gasPrice',
      'isEthNetwork',
      'swapLink'
    ]),
    ...mapGetters('wallet', ['balanceInETH', 'tokensList']),
    isDisabledNextBtn() {
      return (
        this.feeError !== '' ||
        !this.isValidGasLimit ||
        !this.allValidInputs ||
        !this.gasEstimationIsReady
      );
    },
    buyMore() {
      return this.isEthNetwork &&
        MAIN_TOKEN_ADDRESS === this.selectedCurrency?.contract &&
        this.amountError === 'Not enough balance to send!'
        ? 'Buy more.'
        : '';
    },
    hasEnoughEth() {
      // Check whether user has enough eth to cover tx fee + amount to send
      if (this.selectedCurrency?.contract === MAIN_TOKEN_ADDRESS) {
        return BigNumber(this.balanceInETH)
          .minus(this.txFeeETH)
          .gte(this.amount);
      }
      // Check whether user has enough eth to cover tx fee + user has enough token balance for the amount to send
      return BigNumber(this.balanceInETH).gte(this.txFeeETH);
    },
    feeError() {
      return !this.hasEnoughEth
        ? `Not enough ${this.currencyName} to cover network fee.`
        : '';
    },
    showSelectedBalance() {
      return (
        !_.isEmpty(this.selectedCurrency) &&
        this.selectedCurrency.text !== 'Select Token'
      );
    },
    currencyName() {
      return this.network.type.currencyName;
    },
    showBalanceNotice() {
      const isZero = BigNumber(this.blanaceInEth).lte(0);
      const isLessThanTxFee =
        BigNumber(this.balanceInETH).gt(0) &&
        BigNumber(this.txFeeETH).gt(this.balanceInETH);

      if (isZero || isLessThanTxFee) {
        return true;
      }

      return false;
    },
    selectedBalance() {
      if (this.selectedCurrency?.balance) {
        const balance = this.convertToDisplay(
          this.selectedCurrency.balance,
          this.selectedCurrency.decimals
        );
        return BigNumber(balance).toString();
      }
      return '0';
    },
    tokens() {
      // no ref copy
      const tokensList = this.tokensList.slice();
      const imgs = tokensList.map(item => {
        item.totalBalance = item.usdBalancef;
        item.tokenBalance = item.balancef;
        item.price = item.pricef;
        return item.img;
      });
      BigNumber(this.balanceInETH).lte(0)
        ? tokensList.unshift({
            hasNoEth: true,
            disabled: true,
            text: 'Your wallet is empty.',
            linkText: this.isEthNetwork ? 'Buy ETH' : '',
            link: this.isEthNetwork ? this.swapLink : ''
          })
        : null;
      return [
        {
          text: 'Select Token',
          imgs: imgs.splice(0, 5),
          total: `${this.tokensList.length}`,
          divider: true,
          selectLabel: true
        },
        {
          header: 'My Wallet'
        },
        ...tokensList
      ];
    },
    /* Property returns either gas estimmation error or amount error*/
    amountErrorMessage() {
      return this.gasEstimationError !== ''
        ? this.gasEstimationError
        : this.amountError;
    },
    /**
     * Property checks if user input valid amount
     * Results to false if amount is empty, amount is negative, has invalid decimal points
     * @returns {boolean} true or false based on above params
     */
    isValidAmount() {
      /** !amount */
      if (!this.amount) {
        return false;
      }
      if (!this.selectedCurrency?.decimals) {
        return false;
      }
      /** amount is negative */
      if (BigNumber(this.amount).lt(0)) {
        return false;
      }
      /** return amount has valid decimals */
      return SendTransaction.helpers.hasValidDecimals(
        this.amount,
        this.selectedCurrency.decimals
      );
    },
    isValidGasLimit() {
      if (this.gasLimit) {
        return (
          BigNumber(this.gasLimit).gt(0) &&
          BigNumber(this.gasLimit).dp() < 1 &&
          toBN(this.gasLimit).gte(toBN(this.defaultGasLimit))
        );
      }
      return false;
    },
    dataRules() {
      return [
        value => {
          return isHexStrict(value);
        }
      ];
    },
    isEthNetwork() {
      return this.network.type.name === ETH.name;
    },
    isToken() {
      if (this.sendTx && this.selectedCurrency?.contract)
        return this.sendTx.isToken();
      return false;
    },
    multiwatch() {
      return (
        this.amount,
        this.isValidAddress,
        this.data,
        this.selectedCurrency,
        new Date().getTime() / 1000
      );
    },
    txFeeETH() {
      return fromWei(this.txFee);
    },
    txFee() {
      if (this.isValidGasLimit) {
        return toBN(this.actualGasPrice).mul(toBN(this.gasLimit)).toString();
      }
      return '0';
    },
    /**
     * Computed property determines whether or not show the loading state of the fee
     * Fee is loaded when: invalid amount, invalid gas limit
     * @return {boolean} true of false based on the above params
     */
    txFeeIsReady() {
      return this.isValidAmount && this.isValidGasLimit;
    },
    getCalculatedAmount() {
      const amount = new BigNumber(this.amount ? this.amount : 0)
        .times(new BigNumber(10).pow(this.selectedCurrency.decimals))
        .toFixed(0);
      return toBN(amount);
    },
    allValidInputs() {
      if (this.sendTx && this.sendTx.currency) {
        return (
          this.isValidAmount &&
          this.sendTx.hasEnoughBalance() &&
          this.isValidAddress
        );
      }
      return false;
    },
    actualGasPrice() {
      if (BigNumber(this.localGasPrice).eq(0)) {
        return BigNumber(this.gasPrice);
      }
      return BigNumber(fromWei(this.localGasPrice));
    },
    formattedDefaultGasLimit() {
      return formatIntegerToString(this.defaultGasLimit);
    }
  },
  watch: {
    multiwatch() {
      this.gasEstimationIsReady = false;
      this.debounceEstimateGas(this.allValidInputs);
    },

    isPrefilled() {
      this.prefillForm();
    },
    tokensList: {
      handler: function (val) {
        this.selectedCurrency = val.length > 0 ? val[0] : {};
        if (this.sendTx) {
          this.sendTx.setCurrency(this.selectedCurrency);
        }
      },
      deep: true,
      immediate: true
    },
    toAddress() {
      if (this.isValidAddress) {
        this.sendTx.setTo(this.toAddress, this.userInputType);
      }
    },
    amount(newVal) {
      // make sure amount never becomes null
      if (!newVal) this.amount = '0';
      if (this.isValidAmount) {
        this.sendTx.setValue(this.getCalculatedAmount);
      }
      this.amountError = '';
      this.debounceAmountError(newVal);
    },
    selectedCurrency: {
      handler: function (newVal) {
        if (this.sendTx) {
          this.sendTx.setCurrency(newVal);
          this.setAmountError(this.amount);
        }
        this.data = '0x';
      },
      immediate: true,
      deep: true
    },
    data() {
      if (isHexStrict(this.data)) this.sendTx.setData(this.data);
    },
    gasLimit(newVal) {
      if (this.isValidGasLimit) {
        this.sendTx.setGasLimit(this.gasLimit);
      }
      this.gasLimitError = '';
      this.debouncedGasLimitError(newVal);
    },
    network() {
      this.clear();
    }
  },
  mounted() {
    this.setSendTransaction();
    this.gasLimit = this.prefilledGasLimit;
    this.selectedCurrency = this.tokensList[0];
    this.sendTx.setCurrency(this.selectedCurrency);
    this.handleLocalGasPrice({
      gasType: this.gasPriceType,
      gasPrice: this.gasPrice
    });
  },
  created() {
    this.debouncedGasLimitError = _.debounce(value => {
      this.setGasLimitError(value);
    }, 1000);
    this.debounceAmountError = _.debounce(value => {
      this.setAmountError(value);
    }, 1000);
    this.debounceEstimateGas = _.debounce(allValidInputs => {
      if (allValidInputs) {
        this.estimateAndSetGas();
      }
    }, 500);
  },
  methods: {
    /**
     * Resets values to default
     */
    clear() {
      if (this.$refs && this.$refs.addressInput)
        this.$refs.addressInput.clear();
      this.toAddress = '';
      this.selectedCurrency = this.tokensList[0];
      this.sendTx = null;
      this.isValidAddress = false;
      this.amount = '0';
      this.data = '0x';
      this.userInputType = '';
      this.localGasPrice = '0';
      this.localGasType = 'economy';
      this.defaultGasLimit = '21000';
      this.gasLimitError = '';
      this.amountError = '';
      this.gasEstimationError = '';
      this.gasEstimationIsReady = false;

      // resets the defaults on mount
      this.setSendTransaction();
      this.gasLimit = this.prefilledGasLimit;
      this.sendTx.setCurrency(this.selectedCurrency);
      this.handleLocalGasPrice({
        gasType: this.gasPriceType,
        gasPrice: this.gasPrice
      });
    },
    /**
     * Method sets gas limit to default when Advanced closed , ONLY IF gasLimit was invalid
     */
    closeToggle() {
      if (!this.isValidGasLimit) {
        this.gasLimit = this.defaultGasLimit;
        this.setGasLimitError(this.gasLimit);
      }
    },
    /**
     * Method sets amountError based on the user input
     * Has to be set manualy and debouned otherwise error message is not displayed when tokens are switched and amount input component is out of focus
     * @param value {string}
     */
    setAmountError(value) {
      if (value) {
        if (BigNumber(value).lt(0)) {
          this.amountError = "Amount can't be negative!";
        } else if (
          this.selectedCurrency?.decimals &&
          !SendTransaction.helpers.hasValidDecimals(
            value,
            this.selectedCurrency.decimals
          )
        ) {
          this.amountError = 'Invalid decimal points';
        } else if (value && this.sendTx && this.sendTx.currency) {
          this.amountError = this.sendTx.hasEnoughBalance()
            ? ''
            : 'Not enough balance to send!';
        } else {
          this.amountError = '';
        }
      } else {
        this.amountError = 'Required';
      }
    },
    /**
     * Method sets gasLimitError based on the user input
     * Has to be set manualy and debouned otherwise error message is not displayed when tokens are switched and gas limit input component is out of focus
     * @param value {string}
     */
    setGasLimitError(value) {
      if (value) {
        if (BigNumber(value).lte(0))
          this.gasLimitError = 'Gas limit must be greater than 0';
        else if (BigNumber(value).dp() > 0)
          this.gasLimitError = 'Gas limit can not have decimal points';
        else if (toBN(value).lt(toBN(this.defaultGasLimit)))
          this.gasLimitError = 'Amount too low. Transaction will fail';
        else {
          this.gasLimitError = '';
        }
      } else {
        this.gasLimitError = 'Required';
      }
    },
    handleLocalGasPrice(e) {
      this.localGasPrice = toWei(e.gasPrice);
      this.localGasType = e.gasType;
      this.sendTx.setLocalGasPrice(this.actualGasPrice);
    },
    setAddress(addr, isValidAddress, userInputType) {
      this.toAddress = addr;
      this.isValidAddress = isValidAddress;
      this.userInputType = userInputType;
    },
    setSendTransaction() {
      this.sendTx = new SendTransaction(this.$store);
    },
    estimateAndSetGas() {
      this.sendTx
        .estimateGas()
        .then(res => {
          this.defaultGasLimit = toBN(res).toString();
          this.gasLimit = toBN(res).toString();
          this.setGasLimitError(this.gasLimit);
          this.sendTx.setGasLimit(res);
          this.gasEstimationError = '';
          this.gasEstimationIsReady = true;
        })
        .catch(e => {
          this.gasEstimationError = e.message;
          this.gasEstimationIsReady = false;
        });
    },
    send() {
      window.scrollTo(0, 0);
      this.sendTx
        .submitTransaction()
        .then(() => {
          this.clear();
        })
        .catch(error => {
          this.clear();
          this.gasEstimationError = error.message;
        });
    },
    prefillForm() {
      if (this.isPrefilled) {
        const foundToken = this.tokensymbol
          ? this.tokensList.find(item => {
              return item.name.toLowerCase() === this.tokenSymbol.toLowerCase();
            })
          : undefined;
        this.data = isHexStrict(this.prefilledData) ? this.prefilledData : '';
        this.amount = this.prefilledAmount;
        this.toAddress = this.prefilledAddress;
        this.gasLimit = this.prefilledGasLimit;
        this.selectedCurrency = foundToken ? foundToken : this.selectedCurrency;
        this.$refs.expandPanel.setToggle(true);
        Toast(this.$t('sendTx.prefilled-warning'), {}, WARNING, 1000);
        this.clearPrefilled();
      }
    },
    convertToDisplay(amount, decimals) {
      const amt = toBN(amount).toString();
      return decimals
        ? BigNumber(amt).div(BigNumber(10).pow(decimals)).toString()
        : amt;
    },
    setEntireBal() {
      if (
        _.isEmpty(this.selectedCurrency) ||
        this.selectedCurrency.contract === MAIN_TOKEN_ADDRESS
      ) {
        this.setAmount(
          BigNumber(this.balanceInETH).minus(this.txFeeETH).toFixed()
        );
      } else {
        this.setAmount(
          this.convertToDisplay(
            this.selectedCurrency.balance,
            this.selectedCurrency.decimals
          )
        );
      }
    },
    setAmount(value) {
      this.amount = value;
    },
    setGasLimit(value) {
      this.gasLimit = value;
    },
    setCurrency(value) {
      this.selectedCurrency = value;
    }
  }
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
