<template>
  <div>
    <div class="d-block d-lg-none">
      <network mobile class="mb-4" />
      <myEthBalance mobile class="mb-4" />
    </div>

    <div class="d-flex mt-4 mt-lg-0">
      <div class="flex-grow-1">
        <mew6-white-sheet>
          <interface-wrap title="Send Transaction">
            <mew-select
              ref="mewSelect"
              :items="tokens"
              :label="$t('sendTx.type')"
              @input="setCurrency"
            />

            <div class="mb-2 text-right">
              <v-btn
                color="primary"
                class="text-transform--initial mb-2"
                x-small
                text
                @click.native="setEntireBal"
              >
                {{ $t('sendTx.button-entire') }}
              </v-btn>
              <mew-input
                ref="mewInput"
                :value="amount"
                :label="$t('sendTx.amount')"
                placeholder=" "
                :right-label="currencyBalance"
                @input="setAmount"
              />
            </div>

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
              class="mb-2"
              @input="setAddress"
            />

            <mew-expand-panel
              ref="expandPanel"
              is-toggle
              has-dividers
              :panel-items="expandPanel"
            >
              <template #panelBody1>
                <div class="font-weight-medium d-flex align-center mb-3">
                  <div>{{ $t('sendTx.tx-fee') }}</div>
                  <mew-tooltip class="ml-1" text="" />
                </div>

                <div v-show="isEth">
                  <i18n path="sendTx.cost-eth-usd" tag="div">
                    <span slot="eth">{{ txFeeETH() }}</span>
                    <span slot="usd">{{ txFeeUSD() }}</span>
                  </i18n>
                </div>

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

                <mew-input
                  v-model="data"
                  class="mt-4"
                  :label="$t('sendTx.add-data')"
                  placeholder=" "
                />
              </template>
            </mew-expand-panel>

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
          </interface-wrap>
        </mew6-white-sheet>
      </div>

      <div class="pa-4 d-none d-lg-block"></div>

      <div class="d-none d-lg-block">
        <network />
        <div class="pa-4"></div>
        <tx-history title="Transaction history" />
        <div class="pa-4"></div>
        <myEthBalance />
        <div class="pa-4"></div>
        <swap />
      </div>
    </div>

    <div class="d-block d-lg-none">
      <tx-history class="mt-4" title="Transaction history" mobile />
      <swap class="mt-4" mobile />
    </div>

    <mew-toast
      ref="toast"
      :text="toastMsg"
      :toast-type="toastType"
      :duration="1000"
    />
  </div>
</template>

<script>
import interfaceWrap from '@/components/interface-wrap/InterfaceWrap';
import txHistory from '@/modules/wallets/components/transaction-history/TransactionHistory';
import network from '@/modules/wallets/components/network/Network';
import swap from '@/modules/wallets/components/swap/Swap';
import myEthBalance from '@/modules/wallets/components/my-eth-balance/MyEthBalance';
import utils from 'web3-utils';
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import SendTransaction from './index';
import { ETH } from '@/utils/networks/types';
import { Toast, ERROR, SENTRY, SUCCESS } from '@/components/toast';
import getService from '@/helpers/getService';

export default {
  components: {
    swap,
    interfaceWrap,
    txHistory,
    network,
    myEthBalance
  },
  props: {
    mobile: {
      type: Boolean,
      default: false
    },
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
          subtext: this.$t('sendTx.data-gas')
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
      'address',
      'usd'
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
      return this.selectedCurrency.symbol !== this.network.type.currencyName &&
        this.selectedCurrency.balance
        ? BigNumber(this.selectedCurrency.balance)
            .div(BigNumber(10).pow(this.selectedCurrency.decimals))
            .toString()
        : this.balance;
    },
    tokens() {
      const eth = {
        name: this.network.type.name,
        symbol: this.network.type.name,
        subtext: this.network.type.name_long,
        value: this.network.type.name_long,
        balance: this.balance,
        img: this.network.type.icon,
        market_cap: null,
        price_change_24h: null
      };

      const copiedTokens = this.ownersTokens.slice();
      copiedTokens.unshift(eth);
      return copiedTokens;
    }
  },
  watch: {
    multiwatch: utils._.debounce(function () {
      if (this.validInputs) {
        this.sendTx
          .estimateGas(this.amount, this.toAddress, this.gasPrice, this.data)
          .then(res => {
            this.customGasLimit = res;
          })
          .catch(e => {
            Toast(e, {}, ERROR);
          });
      }
    }, 500),
    network() {
      this.setSendTransaction();
    },
    isPrefilled() {
      this.prefillForm();
    },
    ownersTokens: {
      handler: function (newVal) {
        this.selectedCurrency = newVal.length > 0 ? newVal[0] : {};
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
    this.setSendTransaction();
    this.customGasLimit = this.gasLimit;
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
      const send = this.sendTx.submitTransaction(
        this.customGasLimit,
        this.toAddress,
        this.amount,
        this.data,
        this.selectedCurrency.contract
      );
      send
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
      // little hack to make this computed react to other changes
      this.data;
      this.selectedCurrency;
      this.toAddress;
      this.amount;
      return this.sendTx ? this.sendTx.txFeeETH(this.customGasLimit) : '0';
    },
    txFeeUSD() {
      if (this.usd.current_price && this.sendTx) {
        return this.sendTx.txFeeUSD(
          this.customGasLimit,
          this.usd.current_price
        );
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
        this.balance,
        this.customGasLimit
      );
    },
    setAmount(value) {
      this.amount = value;
    },
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
