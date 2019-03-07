<template>
  <div class="send-offline-container">
    <interface-container-title :title="$t('common.offline')" />
    <div class="generate-tx">
      <div class="wrap">
        <div class="send-form">
          <div class="form-block amount-to-address">
            <ul class="type-amount">
              <li class="type">
                <div class="title">
                  <h4>{{ $t('interface.sendTxType') }}</h4>
                </div>
                <currency-picker
                  :currency="allTokens"
                  :token="true"
                  page="sendOfflineGenTx"
                  @selectedCurrency="setSelectedCurrency"
                />
              </li>
              <li class="amount">
                <div class="title">
                  <h4>{{ $t('interface.sendTxAmount') }}</h4>
                </div>
                <div class="the-form amount-number">
                  <input
                    :value="toAmt"
                    :placeholder="$t('interface.depAmount')"
                    type="number"
                    step="any"
                    name
                    @input="debouncedAmount"
                  />
                </div>
              </li>
            </ul>
            <div class="to-address">
              <div class="title">
                <h4>{{ $t('interface.sendTxToAddr') }} &nbsp;</h4>
                <blockie
                  v-show="address !== '' && validAddress"
                  :address="address"
                  class="blockie-image-icon"
                  width="32px"
                  height="32px"
                />
                <button
                  class="title-button copy-button prevent-user-select"
                  @click="copyToAddress"
                >
                  {{ $t('common.copy') }}
                </button>
              </div>
              <div class="the-form address-block">
                <textarea
                  ref="toaddress"
                  v-model="address"
                  name="name"
                  placeholder="Please Enter The Address"
                />
                <i
                  :class="[
                    validAddress ? '' : 'not-good',
                    'fa fa-check-circle good-button'
                  ]"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="send-form">
          <div class="title-container">
            <div class="title">
              <div class="title-helper">
                <h4>{{ $t('common.data') }}</h4>
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
            <div class="good-button-container">
              <i
                :class="[
                  toData !== '' ? '' : 'not-good',
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
                <h4>{{ $t('common.gasLimit') }}</h4>
                <popover :popcontent="$t('popover.gasLimit')" />
              </div>
            </div>
          </div>
          <div class="the-form gas-amount">
            <input
              v-model="gasLimit"
              :placeholder="$t('common.gasLimit')"
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
                <h4>{{ $t('common.nonce') }}</h4>
                <popover :popcontent="$t('popover.nonce')" />
              </div>
            </div>
          </div>
          <div class="the-form gas-amount">
            <input
              v-model="nonce"
              :placeholder="$t('common.nonce')"
              type="number"
            />
            <div class="good-button-container">
              <i
                :class="[
                  'fa fa-check-circle good-button',
                  nonce > 0 ? '' : 'not-good'
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
                <h4>{{ $t('common.gasPrice') }}</h4>
                <popover :popcontent="txSpeedMsg" />
              </div>
            </div>
          </div>
          <div class="the-form gas-amount">
            <input
              v-model="localGasPrice"
              :placeholder="$t('common.gasPrice')"
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
            Import JSON
          </div>
          <div
            :class="[
              isAllInputValid ? '' : 'disabled',
              'submit-button large-round-button-green-filled'
            ]"
            @click="generateTx"
          >
            {{ $t('interface.generateTx') }}
          </div>
          <interface-bottom-text
            link="https://kb.myetherwallet.com"
            question="Have issues?"
            link-text="Help Center"
          />
        </div>
      </div>
      <signed-tx-modal ref="signedTxModal" :signed-tx="signed" :raw-tx="raw" />
    </div>
  </div>
</template>

<script>
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import CurrencyPicker from '@/layouts/InterfaceLayout/components/CurrencyPicker';
import SignedTxModal from './components/SignedTxModal';
import Blockie from '@/components/Blockie';
import BigNumber from 'bignumber.js';
import * as unit from 'ethjs-unit';
import { mapGetters } from 'vuex';
import { isAddress } from '@/helpers/addressUtils';
import store from 'store';
import { Misc, Toast } from '@/helpers';
import utils from 'web3-utils';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    blockie: Blockie,
    'signed-tx-modal': SignedTxModal,
    'currency-picker': CurrencyPicker,
    'interface-container-title': InterfaceContainerTitle
  },
  props: {
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
      localGasPrice: this.highestGas
    };
  },
  computed: {
    ...mapGetters({
      wallet: 'wallet',
      network: 'network',
      web3: 'web3'
    }),
    txSpeedMsg() {
      const net = this.network.type.name;
      // eslint-disable-next-line
      const msg = `${this.$t('popover.txSpeedPt1').replace('{0}', net)} ${this.$t('popover.txSpeedPt2').replace('{0}', net)}`;
      return msg;
    },
    validAddress() {
      return isAddress(this.address);
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
        this.localNonce > 0 &&
        this.localGasPrice
      );
    }
  },
  watch: {
    highestGas(newVal) {
      this.localGasPrice = newVal;
    },
    nonce(newVal) {
      this.localNonce = newVal;
    },
    toData(newVal) {
      if (Misc.validateHexString(newVal)) {
        this.toData = newVal;
      } else {
        this.toData = '0x';
      }
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
    }
  },
  methods: {
    debouncedAmount: utils._.debounce(function(e) {
      const decimals =
        this.selectedCoinType.symbol === this.network.type.name
          ? 18
          : this.selectedCoinType.decimals;
      this.toAmt =
        e.target.valueAsNumber < 0 || isNaN(e.target.valueAsNumber)
          ? 0
          : new BigNumber(e.target.value).decimalPlaces(decimals).toFixed();
      e.target.value = this.toAmt;
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
      if (locCurrency.symbol !== this.network.type.name && locAddress !== '') {
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
    copyToAddress() {
      const el = this.$refs.toaddress;
      el.select();
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
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
          self.localNonce = file.localNonce;
        } catch (e) {
          Toast.responseHandler(e, Toast.WARN);
        }
      };
      reader.readAsBinaryString(e.target.files[0]);
    },
    async generateTx() {
      const isToken = this.selectedCoinType.symbol !== this.network.type.name;
      const amt = unit.toWei(this.toAmt, 'ether');
      const raw = {
        nonce: Misc.sanitizeHex(new BigNumber(this.localNonce).toString(16)),
        gasLimit: Misc.sanitizeHex(new BigNumber(this.gasLimit).toString(16)),
        gasPrice: Misc.sanitizeHex(
          new BigNumber(unit.toWei(this.localGasPrice, 'gwei')).toString(16)
        ),
        to: isToken ? this.selectedCoinType.address : this.address,
        value: isToken ? 0 : amt,
        data: this.toData,
        chainId: this.network.type.chainID
      };
      this.raw = raw;
      const signed = await this.wallet.signTransaction(this.raw);
      this.signed = JSON.stringify(signed);
      this.$refs.signedTxModal.$refs.signedTx.show();
      window.scrollTo(0, 0);
    },
    setSelectedCurrency(e) {
      this.selectedCoinType = e;
      if (e.symbol === this.network.type.name) {
        this.toData = '0x';
      }
    }
  }
};
</script>

<style lang="scss" scoped file="SendOfflineContainer.scss">
@import 'SendOfflineContainer.scss';
</style>
