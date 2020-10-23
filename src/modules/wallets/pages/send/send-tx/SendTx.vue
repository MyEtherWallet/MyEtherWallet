<template>
  <mew-module
    class="d-flex flex-grow-1 pt-6"
    :title="$t('sendTx.send-tx')"
    :has-elevation="true"
    :has-indicator="true"
  >
    <template #moduleBody>
      <div class="full-width px-15 pt-3">
        <div class="d-flex justify-end mr-3 entire-bal">
          <mew-button
            :title="$t('sendTx.entire-bal')"
            btn-style="transparent"
            @click.native="setEntireBal"
          />
        </div>
        <v-container class="pt-0">
          <v-row>
            <v-col cols="6">
              <mew-select
                ref="mewSelect"
                :items="ownersTokens"
                :label="$t('sendTx.type')"
                class="mr-3"
                @input="setCurrency"
              />
            </v-col>
            <v-col cols="6">
              <mew-input
                ref="mewInput"
                v-model="amount"
                :label="$t('sendTx.amount')"
                placeholder=" "
                :right-label="currencyBalance"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <mew-address-select
                ref="addressSelect"
                :value="toAddress"
                :copy-tooltip="$t('common.copy')"
                :save-tooltip="$t('common.save')"
                :enable-save-address="true"
                :label="$t('sendTx.to-addr')"
                :items="addresses"
                :placeholder="$t('sendTx.enter-addr')"
                :success-toast="$t('sendTx.success.title')"
                :is-valid-address="isValidAddress()"
                @input="setAddress"
              />
            </v-col>
          </v-row>
        </v-container>
      </div>

      <v-container>
        <mew-expand-panel
          ref="expandPanel"
          is-toggle
          has-dividers
          :panel-items="expandPanel"
          class="px-15"
        >
          <template #panelBody1>
            <div>
              <!-- <mew-input
                :label="$t('common.gas.price')"
                placeholder=" "
                :value="displayedGasPrice()"
                @input="setGasPrice"
              /> -->
              <mew-input
                :value="customGasLimit"
                :label="$t('common.gas.limit')"
                placeholder=""
                @input="setCustomGasLimit"
              />
            </div>

            <div class="d-flex justify-space-between px-5 border-bottom pb-5">
              <div class="mew-body font-weight-medium d-flex align-center">
                {{ $t('sendTx.tx-fee') }}
                <mew-tooltip class="ml-1" text="" />
              </div>
              <div v-show="isEth">
                <i18n path="sendTx.cost-eth-usd" tag="div">
                  <span slot="eth">{{ txFeeETH() }}</span>
                  <span slot="usd">{{ txFeeUSD() }}</span>
                </i18n>
              </div>
            </div>
            <!-- question: what kind of data do people usually send ? -->
            <mew-input
              v-model="data"
              :label="$t('sendTx.add-data')"
              placeholder=" "
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
import utils from 'web3-utils';
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';

import SendTransaction from './index';
import { ETH } from '@/utils/networks/types';
import { Toast, ERROR, SENTRY, SUCCESS } from '@/components/toast';

export default {
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
    ownersTokens: {
      type: Array,
      default: () => {
        return [];
      }
    },
    gasLimit: {
      type: String,
      default: '21000'
    },
    tokenSymbol: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      addresses: [
        {
          address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
          currency: 'ETH',
          nickname: 'My Address',
          resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        },
        {
          address: '0x43689531907482BEE7e650D18411E284A7337A66',
          currency: 'ETH',
          nickname: 'nickname',
          resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        }
      ],
      toastType: '',
      toastMsg: '',
      ethPrice: 0,
      customGasLimit: '',
      toAddress: '',
      sendTx: null,
      amount: '0',
      selectedCurrency: {},
      data: '0x',
      clearAll: false,
      expandPanel: [
        {
          name: this.$t('common.advanced'),
          subtext: this.$t('sendTx.gas-data')
        }
      ]
    };
  },
  computed: {
    ...mapState('wallet', [
      'balance',
      'network',
      'gasPrice',
      'web3',
      'address'
    ]),
    ...mapState('global', ['online']),
    isEth() {
      return this.network.type.name === ETH.name;
    },
    multiwatch() {
      return (
        this.amount,
        this.isValidAddress(),
        this.data,
        this.selectedCurrency,
        new Date().getTime() / 1000
      );
    },
    currencyBalance() {
      return this.selectedCurrency.balance
        ? BigNumber(this.selectedCurrency.balance)
            .div(BigNumber(10).pow(this.selectedCurrency.decimals))
            .toString()
        : this.balance;
    }
  },
  watch: {
    multiwatch: utils._.debounce(function () {
      if (this.validInputs) this.customGasLimit = this.sendTx.estimateGas();
    }, 500),
    network() {
      if (this.online && this.isEth) this.getEthPrice();
      this.setSendTransaction();
    },
    isPrefilled() {
      this.prefillForm();
    },
    ownersTokens: {
      hander: newVal => {
        this.selectedCurrency = newVal[0];
      },
      deep: true
    },
    amount() {
      this.generateData();
    },
    toAddress() {
      this.generateData();
    },
    gasPrice() {
      this.setSendTransaction();
    },
    address() {
      this.setSendTransaction();
    },
    selectedCurrency() {
      this.generateData();
    }
  },
  mounted() {
    this.sendTx = new SendTransaction(
      this.address,
      this.web3,
      this.gasPrice,
      this.network
    );
    this.customGasLimit = this.gasLimit;
    this.online && this.isEth ? this.getEthPrice() : null;
  },
  methods: {
    setSendTransaction() {
      this.sendTx = new SendTransaction(
        this.address,
        this.web3,
        this.gasPrice,
        this.network
      );
    },
    generateData() {
      try {
        if (this.toAddress !== '') {
          const decimals = this.selectedCurrency.decimals
            ? this.selectedCurrency.decimals
            : null;
          const estimateGasAddress = this.selectedCurrency.decimals
            ? this.selectedCurrency.contract
            : this.toAddress;
          this.data = this.sendTx.getTxData(
            this.amount,
            decimals,
            this.toAddress,
            this.selectedCurrency
          );

          this.sendTx
            .estimateGas(
              this.amount,
              estimateGasAddress,
              this.gasPrice,
              this.data
            )
            .then(res => {
              this.customGasLimit = BigNumber(res).toString();
            })
            .catch(e => {
              Toast(e, {}, ERROR);
            });
        }
      } catch (e) {
        Toast(e, {}, SENTRY);
      }
    },
    send() {
      window.scrollTo(0, 0);
      this.sendTx
        .submitTransaction(
          this.customGasLimit,
          this.toAddress,
          this.amount,
          this.data,
          this.selectedCurrency.contract
        )
        .then(response => {
          Toast(
            'Cheers! Your transaction was mined. Check it in ',
            {
              title: this.network.service,
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
          ? this.ownersTokens.find(item => {
              return item.name.toLowerCase() === this.tokenSymbol.toLowerCase();
            })
          : undefined;
        this.data = this.sendTx.isValidData(this.prefilledData)
          ? this.prefilledData
          : '';
        this.amount = this.prefilledAmount;
        this.toAddress = this.prefilledAddress;
        this.customGasLimit = this.gasLimit;
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
      this.toAddress = '';
      this.amount = '0';
      this.toAddress = '';
      this.gasPrice = '90';
      this.isValidAddress = false;
      this.$refs.expandPanel.setToggle(false);
      this.$refs.mewSelect.clear();
      this.$refs.addressSelect.clear();
      this.$refs.mewInput.clear();
      this.selectedCurrency = {
        name: this.network.type.name_long,
        symbol: this.network.type.currencyName
      };
    },
    getEthPrice() {
      this.sendTx.getEthPrice().then(response => {
        this.ethPrice = response;
      });
    },
    displayedGasPrice() {
      const gasPrice = this.gasPrice.toString();
      return gasPrice.includes('.')
        ? `~ ${this.sendTx.getFixedGas().toString()}`
        : gasPrice;
    },
    isAmountValid() {
      const checkAmount = this.sendTx
        ? this.sendTx.checkAmount(this.amount, this.selectedCurrency)
        : { valid: false, msg: this.$t('errorsGlobal.something-went-wrong') };
      if (!this.checkAmount.valid) {
        this.toastType = 'error';
        this.toastMsg = this.checkAmount.msg;
        this.$refs.toast.showToast();
      }
      return checkAmount ? checkAmount.valid : false;
    },
    allValidInputs() {
      return (
        this.isAmountValid() &&
        this.isValidAddress() &&
        this.sendTx.isValidGasLimit(this.customGasLimit) &&
        this.sendTx.isValidData(this.data)
      );
    },
    txFeeETH() {
      return this.sendTx ? this.sendTx.txFeeETH(this.customGasLimit) : '0';
    },
    txFeeUSD() {
      if (this.ethPrice && this.sendTx) {
        return this.sendTx.txFeeUSD(this.customGasLimit, this.ethPrice);
      }
      return '--';
    },
    isValidAddress() {
      return this.sendTx ? this.sendTx.isValidAddress(this.toAddress) : false;
    },
    setAddress(value) {
      this.toAddress = value;
    },
    setEntireBal() {
      this.amount = this.sendTx.getEntireBal(
        this.selectedCurrency,
        this.balance
      );
    },
    // setAmount(value) {
    //   this.amount = value;
    // },
    // setGasPrice(value) {
    //   this.gasPrice = value;
    // },
    setCustomGasLimit(value) {
      this.customGasLimit = value;
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
