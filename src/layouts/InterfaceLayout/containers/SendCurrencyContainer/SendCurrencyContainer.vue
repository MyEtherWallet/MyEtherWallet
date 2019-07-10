<template>
  <div class="dashboard-container grid-container">
    <b-row>
      <b-col>
        <div class="card block--actions">
          <div class="title">
            <h4>Actions</h4>
          </div>
          <div class="margin--top--auto buttons">
            <img src="@/assets/images/buttons/send-tx.png" />
            <img src="@/assets/images/buttons/nft-manager.png" />
          </div>
        </div>
      </b-col>
      <b-col>
        <div class="card block--swap">
          <div class="flex--row--align-center title">
            <h4>Swap</h4>
            <button class="title-button prevent-user-select">
              More...
            </button>
          </div>
          <p>
            MEW has partnered with Bity, Kyber Network, and Simplex to allow
            users to swap fiat to crypto, ETH and BTC, ETH and ERC-20.
          </p>
          <div class="margin--top--auto swap-info">
            <div class="swap-to">
              <p class="monospace">0.026 BTC / 1 ETH</p>
              <div class="margin--left--auto flex--row--align-center">
                <span class="currency-symbol cc ETH cc-icon"></span>
                <img src="@/assets/images/icons/swap.svg" />
                <span class="currency-symbol cc BTC cc-icon"></span>
              </div>
            </div>

            <div class="swap-to">
              <p class="monospace">351.24 USD / 1 ETH</p>
              <div class="margin--left--auto flex--row--align-center">
                <span class="currency-symbol cc ETH cc-icon"></span>
                <img src="@/assets/images/icons/swap.svg" />
                <span class="currency-symbol cc USD cc-icon"></span>
              </div>
            </div>

            <div class="swap-to">
              <p class="monospace">32.116 XMR / 1 ETH</p>
              <div class="margin--left--auto flex--row--align-center">
                <span class="currency-symbol cc ETH cc-icon"></span>
                <img src="@/assets/images/icons/swap.svg" />
                <span class="currency-symbol cc XMR cc-icon"></span>
              </div>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <div class="card">
          <div class="flex--row--align-center title">
            <h4>MEW Dapps</h4>
            <button class="title-button prevent-user-select">
              Vuew All
            </button>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import CurrencyPicker from '../../components/CurrencyPicker';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import Blockie from '@/components/Blockie';
import { Transaction } from 'ethereumjs-tx';
import { Misc, Toast } from '@/helpers';
import BigNumber from 'bignumber.js';
import ethUnit from 'ethjs-unit';
import utils from 'web3-utils';
import fetch from 'node-fetch';

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    blockie: Blockie,
    'currency-picker': CurrencyPicker
  },
  props: {
    tokensWithBalance: {
      type: Array,
      default: function() {
        return [];
      }
    },
    getBalance: {
      type: Function,
      default: function() {}
    },
    highestGas: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      advancedExpand: false,
      isValidAddress: false,
      hexAddress: '',
      address: '',
      value: '0',
      gasLimit: '21000',
      data: '',
      selectedCurrency: '',
      ethPrice: 0
    };
  },

  computed: {
    ...mapState([
      'account',
      'gasPrice',
      'web3',
      'network',
      'linkQuery',
      'online'
    ]),
    txFee() {
      return new BigNumber(ethUnit.toWei(this.gasPrice, 'gwei')).times(
        this.gasLimit || 0
      );
    },
    txFeeEth() {
      if (new BigNumber(this.txFee).gt(0)) {
        return ethUnit.fromWei(this.txFee, 'ether');
      }
      return 0;
    },
    isValidAmount() {
      const notEnoughGasMsg =
        this.$t('errorsGlobal.notAValidAmountTotal') +
        ' Gas ' +
        this.$t('errorsGlobal.toSend');
      const notEnoughTokenMsg =
        this.$t('errorsGlobal.notAValidAmountTotal') +
        ' ' +
        this.selectedCurrency.symbol +
        ' ' +
        this.$t('errorsGlobal.toSend');
      const notEnoughCurrencyMsg =
        this.$t('errorsGlobal.notAValidAmountTotal') +
        ' ' +
        this.network.type.currencyName +
        ' ' +
        this.$t('errorsGlobal.toSend');
      const invalidValueMsg = this.$t('errorsGlobal.invalidValue');
      const enoughTokenBalance = new BigNumber(this.value).lte(
        this.selectedCurrency.balance
      );
      const enoughCurrency = new BigNumber(this.value)
        .plus(this.txFeeEth)
        .lte(this.balanceDefault);
      const enoughGas = new BigNumber(this.txFeeEth).lte(this.balanceDefault);
      const validDecimal = this.isValidDecimals;
      if (new BigNumber(this.value).lt(0)) {
        return {
          msg: invalidValueMsg,
          valid: false
        };
      }
      if (this.isToken) {
        const enoughBalance = enoughTokenBalance && enoughGas && validDecimal;
        return {
          valid: enoughBalance,
          msg: enoughBalance
            ? ''
            : !enoughTokenBalance
            ? notEnoughTokenMsg
            : !enoughGas
            ? notEnoughGasMsg
            : invalidValueMsg
        };
      }
      return {
        valid: enoughCurrency && validDecimal,
        msg: enoughCurrency
          ? ''
          : !enoughCurrency
          ? notEnoughCurrencyMsg
          : invalidValueMsg
      };
    },
    isValidDecimals() {
      const decimals = (this.value + '').split('.')[1];
      if (!decimals) return true;
      if (this.isToken) {
        return decimals.length <= this.selectedCurrency.decimals;
      }
      return decimals.length <= 18;
    },
    isValidData() {
      return Misc.validateHexString(this.data);
    },
    isValidGasLimit() {
      return new BigNumber(this.gasLimit).gte(0);
    },
    balanceDefault() {
      return new BigNumber(ethUnit.fromWei(this.account.balance, 'ether'));
    },
    validInputs() {
      return (
        this.isValidAmount.valid &&
        this.isValidAddress &&
        new BigNumber(this.gasLimit).gte(0) &&
        Misc.validateHexString(this.data)
      );
    },
    isToken() {
      const symbol = this.network.type.currencyName;
      return this.selectedCurrency.symbol !== symbol;
    },
    txData() {
      if (this.isToken) {
        return this.getTokenTransferABI(
          this.value,
          this.selectedCurrency.decimals
        );
      }
      return Misc.sanitizeHex(this.data);
    },
    txValue() {
      if (this.isToken) {
        return '0x00';
      }
      return Misc.sanitizeHex(ethUnit.toWei(this.value, 'ether').toString(16));
    },
    txTo() {
      return this.isToken
        ? this.selectedCurrency.address.toLowerCase()
        : this.hexAddress.toLowerCase().trim();
    },
    multiWatch() {
      return (
        this.value,
        this.isValidAddress,
        this.data,
        this.selectedCurrency,
        new Date().getTime() / 1000
      );
    },
    convert() {
      if (this.ethPrice) {
        return new BigNumber(
          new BigNumber(this.txFeeEth).times(new BigNumber(this.ethPrice))
        )
          .toFixed(2)
          .toString();
      }
      return '--';
    }
  },
  watch: {
    multiWatch: utils._.debounce(function() {
      if (this.validInputs) this.estimateGas();
    }, 500),
    tokensWithBalance() {
      if (Object.keys(this.linkQuery).length > 0) {
        const { data, to, value, gaslimit, tokensymbol } = this.linkQuery;
        const foundToken = tokensymbol
          ? this.tokensWithBalance.find(item => {
              return item.symbol.toLowerCase() === tokensymbol.toLowerCase();
            })
          : undefined;

        this.data = data ? (Misc.validateHexString(data) ? data : '') : '';
        this.value = value ? new BigNumber(value).toFixed() : 0;
        this.hexAddress = to ? to : '';
        this.address = to ? to : '';
        this.gasLimit = gaslimit ? new BigNumber(gaslimit).toString() : '21000';
        this.selectedCurrency = foundToken ? foundToken : this.selectedCurrency;

        Toast.responseHandler(
          'Form has been prefilled. Please proceed with caution!',
          Toast.WARN
        );
        this.$store.dispatch('saveQueryVal', {});
      }
    },
    network(newVal) {
      if (this.online && newVal.type.name === 'ETH') this.getEthPrice();
    }
  },
  mounted() {
    if (this.online && this.network.type.name === 'ETH') this.getEthPrice();
  },
  methods: {
    openSettings() {
      this.$eventHub.$emit('open-settings');
    },
    sendEntireBalance() {
      if (this.isToken) this.value = this.selectedCurrency.balance;
      else
        this.value =
          this.balanceDefault > 0
            ? this.balanceDefault.minus(
                ethUnit.fromWei(
                  new BigNumber(ethUnit.toWei(this.gasPrice, 'gwei'))
                    .times(this.gasLimit)
                    .toString(),
                  'ether'
                )
              )
            : 0;
    },
    getTokenTransferABI(amount, decimals) {
      const jsonInterface = [
        {
          constant: false,
          inputs: [
            { name: '_to', type: 'address' },
            { name: '_amount', type: 'uint256' }
          ],
          name: 'transfer',
          outputs: [{ name: '', type: 'bool' }],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ];
      const contract = new this.web3.eth.Contract(jsonInterface);
      return contract.methods
        .transfer(
          this.hexAddress.toLowerCase(),
          new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toFixed()
        )
        .encodeABI();
    },
    async estimateGas() {
      const coinbase = await this.web3.eth.getCoinbase();
      const params = {
        from: coinbase,
        value: this.txValue,
        to: this.txTo,
        gasPrice: Misc.sanitizeHex(
          ethUnit.toWei(this.gasPrice, 'gwei').toString(16)
        ),
        data: this.txData
      };
      this.web3.eth
        .estimateGas(params)
        .then(gasLimit => {
          this.gasLimit = gasLimit;
        })
        .catch(err => {
          this.gasLimit = -1;
          Toast.responseHandler(err, Toast.ERROR);
        });
    },
    async submitTransaction() {
      window.scrollTo(0, 0);
      try {
        const coinbase = await this.web3.eth.getCoinbase();
        const nonce = await this.web3.eth.getTransactionCount(coinbase);
        const raw = {
          nonce: Misc.sanitizeHex(new BigNumber(nonce).toString(16)),
          gasPrice: Misc.sanitizeHex(
            ethUnit.toWei(this.gasPrice, 'gwei').toString(16)
          ),
          gasLimit: Misc.sanitizeHex(new BigNumber(this.gasLimit).toString(16)),
          to: this.txTo,
          value: this.txValue,
          data: this.txData
        };
        const _tx = new Transaction(raw);
        const json = _tx.toJSON(true);
        json.from = coinbase;
        this.web3.eth.sendTransaction(json).catch(err => {
          Toast.responseHandler(err, Toast.ERROR);
        });
      } catch (e) {
        Toast.responseHandler(e, Toast.ERROR);
      }
    },
    async getEthPrice() {
      const price = await fetch(
        'https://cryptorates.mewapi.io/ticker?filter=ETH'
      )
        .then(res => {
          return res.json();
        })
        .catch(e => {
          Toast.responseHandler(e, Toast.ERROR);
        });
      this.ethPrice = price.data.ETH.quotes.USD.price;
    },
    copyToClipboard(ref) {
      this.$refs[ref].select();
      document.execCommand('copy');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SendCurrencyContainer.scss';
</style>
