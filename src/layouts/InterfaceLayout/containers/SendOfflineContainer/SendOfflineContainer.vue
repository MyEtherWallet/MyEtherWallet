<template>
  <div class="send-offline-container">
    <interface-container-title :title="$t('sendTx.send-offline')" />
    <div class="generate-tx">
      <div class="wrap">
        <div class="send-form">
          <div class="form-block amount-to-address">
            <ul class="type-amount">
              <li class="type">
                <div class="title">
                  <h4>{{ $t('sendTx.type') }}</h4>
                </div>
                <currency-picker
                  :currency="allTokens"
                  :token="true"
                  :default="
                    selectedCoinType.hasOwnProperty('symbol')
                      ? selectedCoinType
                      : {}
                  "
                  page="sendOfflineGenTx"
                  @selectedCurrency="setSelectedCurrency"
                />
              </li>
              <li class="amount">
                <div class="title">
                  <h4>{{ $t('sendTx.amount') }}</h4>
                </div>
                <div class="the-form amount-number">
                  <input
                    :value="toAmt"
                    :placeholder="$t('sendTx.dep-amount')"
                    type="number"
                    step="any"
                    name
                    @input="debouncedAmount"
                  />
                </div>
              </li>
            </ul>
            <div class="to-address">
              <dropdown-address-selector
                :clear-address="clearAddress"
                :title="$t('sendTx.to-addr')"
                @toAddress="getToAddress($event)"
              />
            </div>
          </div>
        </div>

        <div class="send-form">
          <div class="title-container">
            <div class="title">
              <div class="title-helper">
                <h4>{{ $t('sendTx.data') }}</h4>
              </div>
            </div>
          </div>
          <div class="the-form gas-amount">
            <input
              v-model="toData"
              :disabled="selectedCoinType.symbol !== 'ETH'"
              type="string"
              placeholder="e.g. 0x65746865726d696e652d657531"
            />
            <p v-show="!validData">
              {{ $t('sendTx.invalid-data') }}
            </p>
            <div class="good-button-container">
              <i
                :class="[
                  validData && toData.length >= 2 ? '' : 'not-good',
                  'fa fa-check-circle good-button'
                ]"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
        <div class="send-form">
          <div class="title-container">
            <div class="title">
              <div class="title-helper">
                <h4>{{ $t('common.gas.limit') }}</h4>
                <popover :popcontent="$t('popover.gas-limit')" />
              </div>
            </div>
          </div>
          <div class="the-form gas-amount">
            <input
              v-model="gasLimit"
              :placeholder="$t('common.gas.limit')"
              type="number"
            />
            <div class="good-button-container">
              <i
                :class="[
                  'fa fa-check-circle good-button',
                  gasLimit > 0 ? '' : 'not-good'
                ]"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
        <div class="send-form">
          <div class="title-container">
            <div class="title">
              <div class="title-helper">
                <h4>{{ $t('sendTx.nonce') }}</h4>
                <popover :popcontent="$t('popover.nonce')" />
              </div>
            </div>
          </div>
          <div class="the-form gas-amount">
            <input
              v-model="localNonce"
              :placeholder="$t('sendTx.nonce')"
              type="number"
            />
            <div class="good-button-container">
              <i
                :class="[
                  'fa fa-check-circle good-button',
                  localNonce >= 0 ? '' : 'not-good'
                ]"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
        <div class="send-form">
          <div class="title-container">
            <div class="title">
              <div class="title-helper">
                <h4>{{ $t('common.gas.price') }}</h4>
                <popover :popcontent="txSpeedMsg" />
              </div>
            </div>
          </div>
          <div class="the-form gas-amount">
            <input
              v-model="localGasPrice"
              :placeholder="$t('common.gas.price')"
              type="number"
            />
            <div class="good-button-container">
              <i
                :class="[
                  'fa fa-check-circle good-button',
                  localGasPrice > 0 ? '' : 'not-good'
                ]"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
        <div class="submit-button-container">
          <input
            ref="jsonInput"
            type="file"
            name="file"
            style="display: none"
            @change="uploadFile"
          />
          <div
            class="submit-button large-round-button-green-border"
            @click="uploadClick"
          >
            {{ $t('sendTx.import-json') }}
          </div>
          <div
            :class="[
              isAllInputValid ? '' : 'disabled',
              'submit-button large-round-button-green-filled'
            ]"
            @click="generateTx"
          >
            {{ $t('sendTx.generate-tx') }}
          </div>
          <div class="clear-all-btn" @click="clear()">
            {{ $t('common.clear-all') }}
          </div>
        </div>
      </div>
      <signed-tx-modal ref="signedTxModal" :signed-tx="signed" :raw-tx="raw" />
    </div>
  </div>
</template>

<script>
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import CurrencyPicker from '@/layouts/InterfaceLayout/components/CurrencyPicker';
import SignedTxModal from './components/SignedTxModal';
import BigNumber from 'bignumber.js';
import * as unit from 'ethjs-unit';
import { mapState } from 'vuex';
import store from 'store';
import { Misc, Toast } from '@/helpers';
import utils from 'web3-utils';
import DropDownAddressSelector from '@/components/DropDownAddressSelector';

export default {
  components: {
    'signed-tx-modal': SignedTxModal,
    'currency-picker': CurrencyPicker,
    'interface-container-title': InterfaceContainerTitle,
    'dropdown-address-selector': DropDownAddressSelector
  },
  props: {
    checkPrefilled: {
      type: Function,
      default: () => {}
    },
    clearPrefilled: {
      type: Function,
      default: () => {}
    },
    isPrefilled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: '0'
    },
    data: {
      type: String,
      default: ''
    },
    to: {
      type: String,
      default: ''
    },
    gaslimit: {
      type: String,
      default: ''
    },
    gas: {
      type: Number,
      default: 0
    },
    tokensymbol: {
      type: String,
      default: ''
    },
    tokens: {
      type: Array,
      default: function() {
        return [];
      }
    },
    nonce: {
      type: String,
      default: '0'
    },
    highestGas: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      toAmt: 0,
      address: '',
      toData: '0x',
      gasLimit: 21000,
      selectedCoinType: {},
      raw: {},
      signed: '{}',
      localNonce: this.nonce,
      file: '',
      localGasPrice: this.highestGas,
      clearAddress: false
    };
  },
  computed: {
    ...mapState(['wallet', 'network', 'web3', 'linkQuery']),
    txSpeedMsg() {
      const net = this.network.type.name;
      // eslint-disable-next-line
      const msg = `${this.$t('popover.tx-speed-pt-1').replace(
        '{0}',
        net
      )} ${this.$t('popover.tx-speed-pt-2').replace('{0}', net)}`;
      return msg;
    },
    allTokens() {
      const customToken = store.get('customTokens');
      const allTokens = this.tokens.concat(customToken[this.network.type.name]);
      const sortedBySymbol = allTokens.sort((a, b) => {
        if (a.symbol.toUpperCase() < b.symbol.toUpperCase()) {
          return -1;
        } else if (a.symbol.toUpperCase() > b.symbol.toUpperCase()) {
          return 1;
        }
        return 0;
      });
      return sortedBySymbol;
    },
    isAllInputValid() {
      return (
        this.toData.length >= 2 &&
        this.address.length > 0 &&
        this.validAddress &&
        this.toAmt >= 0 &&
        this.gasLimit > 0 &&
        this.localNonce >= 0 &&
        this.localGasPrice
      );
    },
    validData() {
      return Misc.validateHexString(this.toData);
    }
  },
  watch: {
    highestGas(newVal) {
      this.localGasPrice = newVal;
    },
    nonce(newVal) {
      this.localNonce = newVal;
    },
    toAmt(newVal) {
      this.createDataHex(newVal, null, null);
    },
    address(newVal) {
      if (this.validAddress) {
        this.createDataHex(null, newVal, null);
      }
    },
    selectedCoinType(newVal) {
      this.createDataHex(null, null, newVal);
    },
    isPrefilled() {
      this.prefillForm();
    }
  },
  mounted() {
    this.checkPrefilled();
  },
  methods: {
    clear() {
      this.toAmt = 0;
      this.address = '';
      this.toData = '0x';
      this.gasLimit = 21000;
      this.localNonce = this.nonce;
      this.localGasPrice = this.highestGas;
      this.clearAddress = !this.clearAddress;
      this.selectedCoinType = {
        name: this.network.type.name_long,
        symbol: this.network.type.currencyName
      };
    },
    prefillForm() {
      if (this.tokens.length > 0 && this.isPrefilled) {
        const foundToken = this.tokensymbol
          ? this.tokens.find(item => {
              return (
                item.symbol.toLowerCase() === this.tokensymbol.toLowerCase()
              );
            })
          : undefined;
        this.toAmt = new BigNumber(this.value).toFixed();
        this.toData = Misc.validateHexString(this.data) ? this.data : '';
        this.address = this.to;
        this.gasLimit = this.gaslimit
          ? new BigNumber(this.gaslimit).toString()
          : '21000';
        this.localGasPrice = new BigNumber(this.gas).toFixed();
        this.selectedCoinType = foundToken ? foundToken : this.selectedCoinType;
        Toast.responseHandler(
          'Form has been prefilled. Please proceed with caution!',
          Toast.WARN
        );
        this.clearPrefilled();
      }
    },
    debouncedAmount: utils._.debounce(function(e) {
      const symbol = this.network.type.currencyName;
      const decimals =
        this.selectedCoinType.symbol === symbol
          ? 18
          : parseInt(this.selectedCoinType.decimals);
      this.toAmt =
        e.target.valueAsNumber < 0 || isNaN(e.target.valueAsNumber)
          ? 0
          : new BigNumber(e.target.valueAsNumber)
              .decimalPlaces(decimals)
              .toFixed();
    }, 300),
    async createDataHex(amount, address, currency) {
      const locAmount = amount !== null ? amount : this.toAmt;
      const locAddress = address !== null ? address : this.address;
      const locCurrency = currency !== null ? currency : this.selectedCoinType;
      const abi = [
        {
          constant: false,
          inputs: [
            {
              name: '_to',
              type: 'address'
            },
            {
              name: '_value',
              type: 'uint256'
            }
          ],
          name: 'transfer',
          outputs: [
            {
              name: '',
              type: 'bool'
            }
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ];
      const symbol = this.network.type.currencyName;
      if (locCurrency.symbol !== symbol && locAddress !== '') {
        const locVal = locAmount === '' || locAmount === null ? '0' : locAmount;
        const contract = new this.web3.eth.Contract(abi, locCurrency.address);
        const convertedAmount = new BigNumber(locVal).times(
          new BigNumber(10).pow(locCurrency.decimals)
        );
        this.toData = contract.methods
          .transfer(locAddress, convertedAmount.toFixed())
          .encodeABI();
      }
    },
    getToAddress(data) {
      this.address = data.address;
      this.validAddress = data.valid;
    },
    uploadClick() {
      const jsonInput = this.$refs.jsonInput;
      jsonInput.value = '';
      jsonInput.click();
    },
    uploadFile(e) {
      const self = this;
      const reader = new FileReader();
      reader.onloadend = function(evt) {
        try {
          const file = JSON.parse(evt.target.result);
          self.localGasPrice = unit.fromWei(file.gasPrice, 'gwei');
          self.localNonce = file.nonce;
        } catch (e) {
          Toast.responseHandler(e, Toast.WARN);
        }
      };
      reader.readAsBinaryString(e.target.files[0]);
    },
    async generateTx() {
      const symbol = this.network.type.currencyName;
      const isToken = this.selectedCoinType.symbol !== symbol;
      const amtWei = unit.toWei(this.toAmt, 'ether');
      const raw = {
        nonce: Misc.sanitizeHex(new BigNumber(this.localNonce).toString(16)),
        gasLimit: Misc.sanitizeHex(new BigNumber(this.gasLimit).toString(16)),
        gasPrice: Misc.sanitizeHex(
          new BigNumber(unit.toWei(this.localGasPrice, 'gwei')).toString(16)
        ),
        to: isToken
          ? this.selectedCoinType.address
          : this.address.toLowerCase().trim(),
        value: isToken ? 0 : amtWei,
        data: this.toData,
        chainId: this.network.type.chainID
      };
      this.raw = raw;
      const signed = await this.wallet.signTransaction(this.raw);
      this.signed = JSON.stringify(signed);
      this.$refs.signedTxModal.$refs.signedTx.show();
      window.scrollTo(0, 0);
      this.clear();
    },
    setSelectedCurrency(e) {
      const symbol = this.network.type.currencyName;
      this.selectedCoinType = e;
      if (e.symbol === symbol) {
        this.toData = '0x';
      }
    }
  }
};
</script>

<style lang="scss" scoped file="SendOfflineContainer.scss">
@import 'SendOfflineContainer.scss';
</style>
