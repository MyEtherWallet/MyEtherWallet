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
              :is-eth="true"
              :loading="!showSelectedBalance"
              class="d-sm-none"
            />
            <mew-select
              ref="mewSelect"
              label="Token"
              :items="tokens"
              :is-swap="true"
              :value="selectedCurrency"
              @input="setCurrency"
            />
          </div>
        </v-col>
        <v-col cols="12" sm="6" class="pl-sm-1 pt-0 pb-2 pb-sm-4">
          <div class="position--relative">
            <app-button-balance
              :balance="selectedBalance"
              :is-eth="true"
              :loading="!showSelectedBalance"
              class="d-none d-sm-block"
            />
            <mew-input
              label="Amount"
              placeholder="0"
              :value="amount"
              type="number"
              :persistent-hint="true"
              :rules="amtRules"
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
          <module-address-book @setAddress="setAddress" />
        </v-col>
        <!--
      =====================================================================================
        Network Fee (Note: comes with mt-5(20px) mb-8(32px)))
      =====================================================================================
      -->
        <v-col cols="12" class="py-0">
          <app-network-fee
            :show-fee="showSelectedBalance"
            :getting-fee="false"
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
              <div
                class="
                  d-flex
                  align-center
                  justify-end
                  mew-body
                  primary--text
                  pb-3
                  cursor--pointer
                "
                @click="setGasLimit(defaultGasLimit)"
              >
                Reset to default: {{ formattedDefaultGasLimit }}
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
            :disabled="!allValidInputs || !isValidGasLimit"
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
import utils, { fromWei, toBN, isHexStrict, _, toWei } from 'web3-utils';
import { mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import SendTransaction from '@/modules/send/handlers/handlerSend';
import { ETH } from '@/utils/networks/types';
import { Toast, ERROR, WARNING } from '@/modules/toast/handler/handlerToast';
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook';
import SendLowBalanceNotice from './components/SendLowBalanceNotice.vue';
import AppButtonBalance from '@/core/components/AppButtonBalance';
import AppNetworkFee from '@/core/components/AppNetworkFee.vue';
import {
  formatFiatValue,
  formatFloatingPointValue,
  formatIntegerToString
} from '@/core/helpers/numberFormatHelper';
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
    prefilledTokenSymbol: {
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
      addMode: false,
      gasLimit: '21000',
      toAddress: '',
      sendTx: null,
      isValidAddress: false,
      amount: '0',
      selectedCurrency: {},
      data: '0x',
      clearAll: false,
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
      gasLimitError: ''
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'web3', 'address']),
    ...mapState('global', ['online']),
    ...mapGetters('external', ['fiatValue', 'balanceFiatValue']),
    ...mapGetters('global', ['network', 'gasPrice']),
    ...mapGetters('wallet', ['balanceInETH', 'balanceInWei', 'tokensList']),
    buyMore() {
      return this.currencyName === this.selectedCurrency.symbol
        ? 'Buy more.'
        : '';
    },
    hasEnoughEth() {
      // Check whether user has enough eth to cover tx fee + amount to send
      if (this.selectedCurrency.symbol === this.currencyName) {
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
    ethToken() {
      return {
        contract_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        decimals: 18,
        img: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
        isEth: true,
        name: 'Ethereum',
        subtext: 'Ethereum',
        symbol: 'ETH',
        type: 'ERC20',
        value: 'Ethereum',
        id: 'ethereum',
        price: formatFiatValue(this.fiatValue).value,
        tokenBalance: formatFloatingPointValue(this.balanceInETH).value,
        totalBalance: formatFiatValue(this.balanceFiatValue).value
      };
    },
    selectedBalance() {
      if (
        _.isEmpty(this.selectedCurrency) ||
        this.selectedCurrency.symbol === this.currencyName
      ) {
        return this.balanceInWei;
      }
      return BigNumber(this.selectedCurrency.balance).toString();
    },
    tokens() {
      const tokensList = this.tokensList || [];
      const imgs = tokensList.map(item => {
        return item.img;
      });
      const _ethToken = [this.ethToken];
      const mergedList = _ethToken.concat(tokensList);
      BigNumber(this.balanceInETH).lte(0)
        ? mergedList.unshift({
            hasNoEth: true,
            disabled: true,
            text: 'Your wallet is empty.',
            linkText: 'Buy ETH',
            link: 'https://ccswap.myetherwallet.com/#/'
          })
        : null;
      return [
        {
          text: 'Select Token',
          imgs: imgs.splice(0, 5),
          total: `${this.tokensList.length}`,
          divider: true,
          selectTokenLabel: true
        },
        {
          header: 'My Wallet'
        },
        ...mergedList
      ];
    },
    amtRules() {
      return [
        value => !!value || 'Required!',
        value => {
          return BigNumber(value).gte(0) || "Amount can't be negative!";
        },
        () => {
          if (this.sendTx && this.sendTx.currency) {
            return (
              this.sendTx.hasEnoughBalance() || 'Not enough balance to send!'
            );
          }
          return true;
        },
        value => {
          if (value) {
            return (
              SendTransaction.helpers.hasValidDecimals(
                value,
                this.selectedCurrency.decimals
              ) || 'Invalid decimal points'
            );
          }
          return 'Required';
        }
      ];
    },
    isValidAmount() {
      if (this.amount) {
        if (BigNumber(this.amount).gte(0)) {
          if (this.sendTx && this.sendTx.currency)
            return this.sendTx.hasEnoughBalance();
          return SendTransaction.helpers.hasValidDecimals(
            this.amount,
            this.selectedCurrency.decimals
          );
        }
        return false;
      }
      return false;
    },
    gasLimitRules() {
      return this.gasLimitError;
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
    displayedGasPrice() {
      const gasPrice = this.actualGasPrice.toString();
      return BigNumber(fromWei(gasPrice, 'gwei')).toFixed(2);
    },
    isEthNetwork() {
      return this.network.type.name === ETH.name;
    },
    isToken() {
      if (this.sendTx) return this.sendTx.isToken();
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
      return toBN(this.actualGasPrice).mul(toBN(this.gasLimit)).toString();
    },
    txFeeUSD() {
      return BigNumber(
        fromWei(toBN(this.actualGasPrice).mul(toBN(this.gasLimit)))
      )
        .times(this.fiatValue)
        .toFixed(2);
    },
    getCalculatedAmount() {
      const amount = BigNumber(this.amount)
        .times(BigNumber(10).pow(this.selectedCurrency.decimals))
        .toFixed(0);
      return toBN(amount);
    },
    allValidInputs() {
      if (this.sendTx && this.sendTx.currency)
        return this.sendTx.hasEnoughBalance() && this.isValidAddress;
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
    multiwatch: utils._.debounce(function () {
      if (this.allValidInputs) {
        this.estimateAndSetGas();
      }
    }, 500),
    isPrefilled() {
      this.prefillForm();
    },
    tokensList: {
      handler: function (newVal) {
        this.selectedCurrency = newVal.length > 0 ? newVal[0] : {};
      },
      deep: true
    },
    toAddress() {
      if (this.isValidAddress) {
        this.sendTx.setTo(this.toAddress, this.userInputType);
      }
    },
    amount() {
      if (this.isValidAmount) {
        this.sendTx.setValue(this.getCalculatedAmount);
      }
    },
    selectedCurrency() {
      this.sendTx.setCurrency(this.selectedCurrency);
      this.data = '0x';
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
      this.setSendTransaction();
    }
  },
  mounted() {
    this.setSendTransaction();
    this.gasLimit = this.prefilledGasLimit;
    this.selectedCurrency = this.ethToken;
  },
  created() {
    this.debouncedGasLimitError = _.debounce(value => {
      this.setGasLimitError(value);
    }, 1000);
  },
  methods: {
    setGasLimitError(value) {
      if (value) {
        if (BigNumber(value).lte(0))
          this.gasLimitError = 'Gas limit must be greater then 0';
        else if (BigNumber(value).dp() > 0)
          this.gasLimitError = 'Gas limit can not have decimals points';
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
    toggleOverlay() {
      this.addMode = !this.addMode;
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
        })
        .catch(e => {
          Toast(e, {}, ERROR);
        });
    },
    send() {
      window.scrollTo(0, 0);
      this.sendTx.submitTransaction().catch(error => {
        this.error = error;
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
    clear() {
      this.data = '';
      this.amount = '0';
      this.toAddress = '';
      this.$refs.expandPanel.setToggle(false);
      this.$refs.mewSelect.clear();
      this.$refs.addressSelect.clear();
      this.$refs.mewInput.clear();
      this.selectedCurrency = {
        name: this.network.type.name_long,
        symbol: this.currencyName
      };
    },
    convertToDisplay(amount, decimals) {
      return BigNumber(amount.toString())
        .div(BigNumber(10).pow(decimals))
        .toString();
    },
    setEntireBal() {
      if (
        _.isEmpty(this.selectedCurrency) ||
        this.selectedCurrency.symbol === this.currencyName
      ) {
        this.setAmount(
          BigNumber(this.balanceInETH).minus(this.txFeeETH).toFixed()
        );
      } else {
        this.setAmount(
          this.convertToDisplay(
            BigNumber(this.selectedCurrency.balance),
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
