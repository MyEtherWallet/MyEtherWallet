<template>
  <mew-module
    class="d-flex flex-grow-1 pt-6"
    :title="$t('sendTx.send-tx')"
    :has-elevation="true"
    :has-indicator="true"
  >
    <template #moduleBody>
      <div class="full-width px-lg-3 pb-6">
        <v-row>
          <v-col cols="12" md="6">
            <p class="ma-0" />
            <mew-select
              ref="mewSelect"
              :items="tokens"
              class="mr-3"
              :value="selectedCurrency"
              @input="setCurrency"
            />
          </v-col>
          <v-col cols="12" md="6" class="position--relative">
            <p class="ma-0 text-right balance-container">
              {{ selectedBalance }}
            </p>
            <mew-input
              label="Amount"
              placeholder="0"
              :value="amount"
              :persistent-hint="true"
              :rules="amtRules"
              :max-btn-obj="{
                title: 'Max',
                disabled: false,
                method: setEntireBal
              }"
              @input="setAmount"
            />
          </v-col>
        </v-row>
        <module-address-book @setAddress="setAddress" />
      </div>

      <v-container>
        <mew-expand-panel
          ref="expandPanel"
          is-toggle
          has-dividers
          :panel-items="expandPanel"
        >
          <template #panelBody1>
            <div class="d-flex justify-space-between px-5 border-bottom pb-5">
              <div class="mew-body font-weight-medium d-flex align-center">
                {{ $t('sendTx.tx-fee') }}
                <mew-tooltip class="ml-1" text="" />
              </div>
              <div v-show="isEthNetwork">
                <i18n path="sendTx.cost-eth-usd" tag="div">
                  <span slot="eth">{{ txFeeETH }}</span>
                  <span slot="usd">{{ txFeeUSD }}</span>
                </i18n>
              </div>
            </div>
            <div>
              <mew-input
                :value="gasLimit"
                :label="$t('common.gas.limit')"
                placeholder=""
                :rules="gasLimitRules"
                @input="setGasLimit"
              />
            </div>

            <mew-input
              v-show="!isToken"
              v-model="data"
              :label="$t('sendTx.add-data')"
              placeholder="0x..."
              :rules="dataRules"
              class="mt-10 mb-n5"
            />
          </template>
        </mew-expand-panel>
      </v-container>

      <div class="d-flex flex-column mt-12">
        <div class="text-center">
          <mew-button
            :title="$t('sendTx.send')"
            :has-full-width="false"
            btn-size="xlarge"
            :disabled="!allValidInputs"
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
    <mew-toast
      ref="toast"
      :text="toastMsg"
      :toast-type="toastType"
      :duration="1000"
    />
  </mew-module>
</template>

<script>
import utils, { fromWei, toBN, isHexStrict, _ } from 'web3-utils';
import { mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import SendTransaction from '@/modules/send/handlers/handlerSend';
import { ETH } from '@/utils/networks/types';
import { Toast, ERROR, SUCCESS } from '@/modules/toast/handler/handlerToast';
import getService from '@/core/helpers/getService';
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook';

export default {
  components: {
    ModuleAddressBook
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
      toastType: '',
      toastMsg: '',
      gasLimit: '21000',
      toAddress: '',
      sendTx: null,
      isValidAddress: false,
      amount: '0',
      amountErrorMessage: '0',
      selectedCurrency: {},
      data: '0x',
      clearAll: false,
      userInputType: '',
      expandPanel: [
        {
          name: this.$t('common.advanced'),
          subtext: this.$t('sendTx.data-gas')
        }
      ]
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'web3', 'address']),
    ...mapState('global', ['online']),
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['network', 'gasPrice']),
    ...mapGetters('wallet', ['balanceInETH', 'tokensList']),
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
        price: BigNumber(this.fiatValue),
        tokenBalance: this.balance
      };
    },
    selectedBalance() {
      if (
        _.isEmpty(this.selectedCurrency) ||
        this.selectedCurrency.symbol === this.network.type.currencyName
      ) {
        return this.balanceInETH;
      }
      return this.convertToDisplay(
        BigNumber(this.selectedCurrency.balance).toFixed(),
        this.selectedCurrency.decimals
      );
    },
    tokens() {
      const tokensList = this.tokensList || [];
      const imgs = tokensList.map(item => {
        return item.img;
      });
      const ethToken = [this.ethToken];
      const mergedList = ethToken.concat(tokensList);
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
        value => !!value || "Amount can't be empty!",
        value => {
          return new BigNumber(value).gte(0) || "Amount can't be negative!";
        },
        () => {
          if (this.sendTx && this.sendTx.currency) {
            return (
              this.sendTx.hasEnoughBalance() || 'Not enough balance to send!'
            );
          }
          return true;
        },
        value =>
          SendTransaction.helpers.hasValidDecimals(
            value,
            this.selectedCurrency.decimals
          ) || 'Invalid decimal points'
      ];
    },
    gasLimitRules() {
      return [
        value => {
          return !!value && new utils.BN(value).gte(21000);
        }
      ];
    },
    dataRules() {
      return [
        value => {
          return isHexStrict(value);
        }
      ];
    },
    displayedGasPrice() {
      const gasPrice = this.gasPrice.toString();
      return new BigNumber(fromWei(gasPrice, 'gwei')).toFixed(2);
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
      return fromWei(toBN(this.gasPrice).mul(toBN(this.gasLimit)));
    },
    txFeeUSD() {
      return new BigNumber(
        fromWei(toBN(this.gasPrice).mul(toBN(this.gasLimit)))
      )
        .times(this.fiatValue)
        .toFixed(2);
    },
    getCalculatedAmount() {
      const amount = new BigNumber(this.amount)
        .times(new BigNumber(10).pow(this.selectedCurrency.decimals))
        .toFixed(0);
      return toBN(amount);
    },
    allValidInputs() {
      if (this.sendTx && this.sendTx.currency)
        return this.sendTx.hasEnoughBalance() && this.isValidAddress;
      return false;
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
      this.sendTx.setValue(this.getCalculatedAmount);
    },
    selectedCurrency() {
      this.sendTx.setCurrency(this.selectedCurrency);
      this.data = '0x';
    },
    data() {
      if (isHexStrict(this.data)) this.sendTx.setData(this.data);
    },
    gasLimit() {
      this.sendTx.setGasLimit(this.gasLimit);
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
  methods: {
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
          this.gasLimit = toBN(res).toString();
          this.sendTx.setGasLimit(res);
        })
        .catch(e => {
          Toast(e, {}, ERROR);
        });
    },
    send() {
      window.scrollTo(0, 0);
      this.sendTx
        .submitTransaction()
        .then(response => {
          Toast(
            'Cheers! Your transaction was mined. Check it in ',
            {
              title: `${getService(this.network.type.blockExplorerTX)}`,
              url: this.network.type.blockExplorerTX.replace(
                '[[txHash]]',
                response.blockHash
              )
            },
            SUCCESS,
            5000
          );
        })
        .catch(error => {
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
        this.toastType = 'warning';
        this.toastMsg = this.$t('sendTx.prefilled-warning');
        this.$refs.toast.showToast();
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
        symbol: this.network.type.currencyName
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
        this.selectedCurrency.symbol === this.network.type.currencyName
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
