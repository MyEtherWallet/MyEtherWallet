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
                  :currency="tokensWithBalance"
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
                    type="string"
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
                  toData !== '' ? 'good-button' : 'not-good',
                  'fa fa-check-circle'
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
                  'fa fa-check-circle',
                  gasLimit > 0 ? 'good-button' : 'not-good'
                ]"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
        <div class="submit-button-container">
          <div
            :class="[
              toData.length >= 2 &&
              address.length > 0 &&
              validAddress &&
              toAmt >= 0
                ? ''
                : 'disabled',
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
import { Misc } from '@/helpers';
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
    tokensWithBalance: {
      type: Array,
      default: function() {
        return [];
      }
    },
    nonce: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      toAmt: '0',
      address: '',
      toData: '0x',
      gasLimit: 21000,
      selectedCoinType: {},
      raw: {},
      signed: '{}'
    };
  },
  computed: {
    ...mapGetters({
      wallet: 'wallet',
      network: 'network',
      web3: 'web3',
      gasPrice: 'gasPrice'
    }),
    validAddress() {
      return isAddress(this.address);
    }
  },
  watch: {
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
      this.toAmt = new BigNumber(e.target.value)
        .decimalPlaces(decimals)
        .toFixed();
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
        const convertedAmount = new BigNumber(locVal).exponentiatedBy(
          locCurrency.decimals
        );
        this.toData = await contract.methods
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
    async generateTx() {
      const raw = {
        from: this.wallet.getAddressString(),
        gas: this.gasLimit,
        value:
          this.selectedCoinType.symbol !== this.network.type.name
            ? 0
            : unit.toWei(this.toAmt, 'ether'),
        data: this.toData,
        nonce: this.nonce,
        gasPrice: unit.toWei(this.gasPrice, 'gwei'),
        to:
          this.selectedCoinType.symbol !== this.network.type.name
            ? this.selectedCoinType.address
            : this.address,
        chainId: this.network.type.chainID,
        generateOnly: true
      };
      this.raw = raw;
      const signed = await this.wallet.signTransaction(this.raw);
      this.signed = JSON.stringify(signed);
      this.$refs.signedTxModal.$refs.signedTx.show();
      window.scrollTo(0, 0);
    },
    setSelectedCurrency(e) {
      this.selectedCoinType = e;
    }
  }
};
</script>

<style lang="scss" scoped file="SendOfflineContainer.scss">
@import 'SendOfflineContainer.scss';
</style>
