<template>
  <mew-module
    class="d-flex flex-grow-1 pt-6"
    :title="$t('sendTx.send-tx')"
    :has-elevation="true"
    :has-indicator="true"
  >
    <template #moduleBody>
      <div class="full-width px-lg-3 pb-6">
        <div class="d-flex justify-end mr-3 entire-bal">
          <mew-button
            :title="$t('sendTx.button-entire')"
            btn-style="transparent"
            @click.native="setEntireBal"
          />
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <mew-select
              ref="mewSelect"
              :items="tokens"
              :label="$t('sendTx.type')"
              class="mr-3"
              @input="setCurrency"
            />
          </v-col>
          <v-col cols="12" md="6">
            <mew-input
              ref="mewInput"
              :value="amount"
              :label="$t('sendTx.amount')"
              placeholder=" "
              :right-label="currencyBalance"
              :rules="amtRules"
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
import utils, { fromWei, toBN, isHexStrict } from 'web3-utils';
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
    ...mapState('external', ['ETHUSDValue']),
    ...mapGetters('global', ['network', 'gasPrice']),
    ...mapGetters('wallet', ['balanceInETH', 'tokensList']),
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
    currencyBalance() {
      if (this.selectedCurrency.balance)
        return this.convertToDisplay(
          this.selectedCurrency.balance,
          this.selectedCurrency.decimals
        );
      return '0';
    },
    tokens() {
      const eth = {
        name: this.network.type.name,
        symbol: this.network.type.name,
        subtext: this.network.type.name_long,
        value: this.network.type.name_long,
        balance: this.balance,
        img: this.network.type.icon,
        decimals: 18,
        market_cap: null,
        price_change_24h: null
      };

      const copiedTokens = this.tokensList.slice();
      copiedTokens.unshift(eth);
      return copiedTokens;
    },
    txFeeETH() {
      return fromWei(toBN(this.gasPrice).mul(toBN(this.gasLimit)));
    },
    txFeeUSD() {
      return new BigNumber(
        fromWei(toBN(this.gasPrice).mul(toBN(this.gasLimit)))
      )
        .times(this.ETHUSDValue.value)
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
    async setEntireBal() {
      this.amount = this.convertToDisplay(
        this.sendTx.getEntireBal(),
        this.selectedCurrency.decimals
      );
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

<style lang="scss">
.entire-bal {
  .mew-button {
    margin-bottom: -12px;
  }
}
</style>

<style lang="scss" scoped>
.border-bottom {
  border-bottom: 2px dotted #f5f5f5;
}
</style>
