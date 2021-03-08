<template>
  <div class="modal-container">
    <b-modal
      ref="swapconfirmation"
      :title="$t('common.confirmation')"
      hide-footer
      centered
      class="bootstrap-modal bootstrap-modal-wide padding-40-20"
      static
      lazy
      no-close-on-backdrop
    >
      <div class="time-remaining">
        <h1>{{ timeRemaining }}</h1>
        <p>{{ $t('swap.time-remain') }}</p>
      </div>
      <div class="swap-detail">
        <div class="from-address">
          <div class="icon">
            <i
              v-if="getIcon(fromAddress.name) !== ''"
              :class="['cc', fromAddress.name, 'cc-icon']"
            ></i>
            <img
              v-if="getIcon(fromAddress.name) === ''"
              :src="iconFetcher(fromAddress.name)"
              class="icon-image"
              alt
            />
          </div>
          <p class="value">
            {{ fromAddress.value }}
            <span>{{ fromAddress.name }}</span>
          </p>
          <p class="block-title">{{ $t('sendTx.from-addr') }}</p>
          <p class="address">{{ fromAddress.address }}</p>
        </div>
        <div class="right-arrow">
          <img :src="arrowImage" alt />
        </div>
        <div v-if="!toFiat" class="to-address">
          <div class="icon">
            <i
              v-if="getIcon(toAddress.name) !== ''"
              :class="['cc', toAddress.name, 'cc-icon']"
            ></i>
            <img
              v-if="getIcon(toAddress.name) === ''"
              :src="iconFetcher(toAddress.name)"
              class="icon-image"
              alt
            />
          </div>
          <p class="value">
            {{ toAddress.value }}
            <span>{{ toAddress.name }}</span>
          </p>
          <p class="block-title">{{ $t('sendTx.to-addr') }}</p>
          <p class="address">{{ toAddress.address }}</p>
        </div>
        <div v-else class="to-address">
          <div class="icon">
            <i :class="['cc', toAddress.name, 'cc-icon']" />
          </div>
          <p class="value">
            {{ toAddress.value }}
            <span>{{ toAddress.name }}</span>
          </p>
          <p class="block-title">{{ $t('common.to') }}</p>
          <p class="address">{{ fiatDest }}</p>
        </div>
      </div>
      <div class="fee-container">
        <span class="fee-estimate">{{ $t('swap.estimated-fee') }}</span>
        {{ calculatedFee }} ETH (${{ calculatedFeeUsd }})
      </div>
      <div v-if="showGasWarning" class="gas-price-warning">
        {{ $t('errorsGlobal.high-gas-limit-warning') }}
        <p>{{ $t('swap.current-gas-price', { value: gasPrice }) }}</p>
        <p class="notice">{{ $t('swap.gas-price-source-notice') }}</p>
      </div>
      <!--<p> Exchange Rate: 0.000</p>-->
      <div class="confirm-send-container">
        <div
          :class="[
            swapReady ? '' : 'disabled',
            timerHasEnded ? 'disabled' : '',
            'confirm-send-button submit-button large-round-button-green-filled clickable'
          ]"
          @click="sendTransaction"
        >
          {{ $t('common.continue') }}
        </div>
      </div>

      <help-center-button />
    </b-modal>
  </div>
</template>

<script>
import '@/assets/images/currency/coins/asFont/cryptocoins.css';
import '@/assets/images/currency/coins/asFont/cryptocoins-colors.css';

import BigNumber from 'bignumber.js';
import * as unit from 'ethjs-unit';
import { mapState, mapActions } from 'vuex';

import Arrow from '@/assets/images/etc/single-arrow.svg';
import iconBtc from '@/assets/images/currency/btc.svg';
import iconEth from '@/assets/images/currency/eth.svg';
import HelpCenterButton from '@/components/Buttons/HelpCenterButton';

import {
  EthereumTokens,
  BASE_CURRENCY,
  ERC20,
  fiat,
  hasIcon,
  utils
} from '@/partners';
import { WEB3_WALLET } from '@/wallets/bip44/walletTypes';
import { type as noticeTypes } from '@/helpers/notificationFormatters';
import { Toast } from '@/helpers';

export default {
  components: {
    'help-center-button': HelpCenterButton
  },
  props: {
    swapDetails: {
      type: Object,
      default: function () {
        return {};
      }
    },
    currentAddress: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isToken: false,
      preparedSwap: {},
      finalDetails: {},
      swapReady: false,
      currencyIcons: {
        BTC: iconBtc,
        ETH: iconEth
      },
      timeRemaining: 0,
      qrcode: '',
      arrowImage: Arrow,
      fromAddress: {},
      toAddress: {},
      fiatCurrenciesArray: fiat.map(entry => entry.symbol),
      totalFee: new BigNumber(21000),
      ethPrice: new BigNumber(0)
    };
  },
  computed: {
    ...mapState('main', [
      'ens',
      'gasPrice',
      'web3',
      'account',
      'wallet',
      'network',
      'gasLimitWarning'
    ]),
    toFiat() {
      return this.fiatCurrenciesArray.includes(this.toAddress.name);
    },
    fiatDest() {
      if (this.swapDetails.orderDetails) {
        return this.swapDetails.orderDetails.name;
      }
      return '';
    },
    calculatedFee() {
      const feeTotal = this.totalFee.times(this.gasPrice);
      const feeInEth = unit.fromWei(unit.toWei(feeTotal, 'gwei'), 'ether');
      return new BigNumber(feeInEth).toFormat(6).toString();
    },
    calculatedFeeUsd() {
      return new BigNumber(this.calculatedFee)
        .times(new BigNumber(this.ethPrice))
        .toFormat(2)
        .toString();
    },
    showGasWarning() {
      return this.gasPrice >= this.gasLimitWarning;
    },
    timerHasEnded() {
      return this.timeRemaining === 'expired';
    }
  },
  watch: {
    swapDetails(newValue) {
      this.fromAddress = {
        value: newValue.sendValue || newValue.fromValue,
        name: newValue.fromCurrency,
        address: newValue.fromAddress
          ? newValue.fromAddress
          : this.currentAddress
      };
      this.toAddress = {
        value: newValue.providerSends || newValue.toValue,
        name: newValue.toCurrency,
        address: newValue.toAddress
      };
      this.timeUpdater(newValue);
      this.swapStarted(newValue);
    }
  },
  methods: {
    ...mapActions('main', ['addSwapNotification']),
    iconFetcher(currency) {
      let icon;
      try {
        // eslint-disable-next-line
        icon = require(`@/assets/images/currency/coins/AllImages/${currency}.svg`);
      } catch (e) {
        // eslint-disable-next-line
        return require(`@/assets/images/icons/web-solution.svg`);
      }
      return icon;
    },
    getIcon(currency) {
      return hasIcon(currency);
    },
    incrementFee(newValue) {
      this.totalFee = this.totalFee.plus(new BigNumber(newValue));
    },
    timeUpdater(swapDetails) {
      clearInterval(this.timerInterval);
      this.timeRemaining = utils.getTimeRemainingString(
        swapDetails.timestamp,
        swapDetails.validFor
      );
      this.timerInterval = setInterval(() => {
        this.timeRemaining = utils.getTimeRemainingString(
          swapDetails.timestamp,
          swapDetails.validFor
        );
        if (this.timeRemaining === 'expired') {
          clearInterval(this.timerInterval);
        }
      }, 1000);
    },
    async sendTransaction() {
      if (!this.swapReady) return;

      if (
        Array.isArray(this.preparedSwap) ||
        Object.keys(this.preparedSwap).length > 0
      ) {
        if (Array.isArray(this.preparedSwap)) {
          if (this.preparedSwap.length > 1) {
            this.web3.mew
              .sendBatchTransactions(this.preparedSwap)
              .then(_result => {
                let tradeIndex;
                if (this.account.identifier === WEB3_WALLET) {
                  tradeIndex = 0;
                } else {
                  tradeIndex = [_result.length - 1];
                }
                _result.map((entry, idx) => {
                  if (idx !== tradeIndex) {
                    entry.catch(e => {
                      Toast.responseHandler(e, Toast.ERROR);
                    });
                  }
                });

                _result[tradeIndex]
                  .once('transactionHash', hash => {
                    this.addSwapNotification([
                      noticeTypes.SWAP_HASH,
                      this.currentAddress,
                      this.swapDetails,
                      this.preparedSwap[this.preparedSwap.length - 1],
                      hash
                    ]);
                  })
                  .once('receipt', res => {
                    this.addSwapNotification([
                      noticeTypes.SWAP_RECEIPT,
                      this.currentAddress,
                      this.swapDetails,
                      this.preparedSwap[this.preparedSwap.length - 1],
                      res
                    ]);
                  })
                  .on('error', err => {
                    this.addSwapNotification([
                      noticeTypes.SWAP_ERROR,
                      this.currentAddress,
                      this.swapDetails,
                      this.preparedSwap[this.preparedSwap.length - 1],
                      err
                    ]);
                  })
                  .catch(err => {
                    Toast.responseHandler(err, Toast.ERROR);
                  });
              });
          } else {
            this.web3.eth
              .sendTransaction(this.preparedSwap[0])
              .once('transactionHash', hash => {
                this.addSwapNotification([
                  noticeTypes.SWAP_HASH,
                  this.currentAddress,
                  this.swapDetails,
                  this.preparedSwap[0],
                  hash
                ]);
              })
              .once('receipt', res => {
                this.addSwapNotification([
                  noticeTypes.SWAP_RECEIPT,
                  this.currentAddress,
                  this.swapDetails,
                  this.preparedSwap[0],
                  res
                ]);
              })
              .on('error', err => {
                this.addSwapNotification([
                  noticeTypes.SWAP_ERROR,
                  this.currentAddress,
                  this.swapDetails,
                  this.preparedSwap[0],
                  err
                ]);
              })
              .catch(err => {
                Toast.responseHandler(err, Toast.ERROR);
              });
          }
        } else {
          this.web3.eth
            .sendTransaction(this.preparedSwap)
            .once('transactionHash', hash => {
              this.addSwapNotification([
                noticeTypes.SWAP_HASH,
                this.currentAddress,
                this.swapDetails,
                this.preparedSwap,
                hash
              ]);
            })
            .once('receipt', res => {
              this.addSwapNotification([
                noticeTypes.SWAP_RECEIPT,
                this.currentAddress,
                this.swapDetails,
                this.preparedSwap,
                res
              ]);
            })
            .on('error', err => {
              this.addSwapNotification([
                noticeTypes.SWAP_ERROR,
                this.currentAddress,
                this.swapDetails,
                this.preparedSwap,
                err
              ]);
            })
            .catch(err => {
              Toast.responseHandler(err, Toast.Error);
            });
        }
        this.$emit('swapStarted', [this.currentAddress, this.swapDetails]);
        this.$refs.swapconfirmation.hide();
      }
    },
    async swapStarted(swapDetails) {
      this.totalFee = new BigNumber(0);
      if (swapDetails.isExitToFiat && !swapDetails.bypass) return;
      this.timeUpdater(swapDetails);
      try {
        await this.fetchEthData();
      } catch (e) {
        // eslint-disable-next-line
            console.error(e);
      }
      this.swapReady = false;
      this.preparedSwap = {};
      if (
        swapDetails.dataForInitialization &&
        !Array.isArray(swapDetails.dataForInitialization)
      ) {
        if (
          swapDetails.maybeToken &&
          swapDetails.fromCurrency !== BASE_CURRENCY
        ) {
          const tokenInfo = EthereumTokens[swapDetails.fromCurrency];
          if (!tokenInfo) throw Error('Selected Token not known to MEW Swap');
          this.preparedSwap = {
            from: this.account.address,
            to: tokenInfo.contractAddress,
            value: 0,
            data: new this.web3.eth.Contract(
              ERC20,
              tokenInfo.contractAddress
            ).methods
              .transfer(
                swapDetails.providerAddress,
                new BigNumber(swapDetails.fromValue)
                  .times(new BigNumber(10).pow(tokenInfo.decimals))
                  .toFixed()
              )
              .encodeABI()
          };
          await this.estimateGas(this.preparedSwap);
        } else if (
          swapDetails.maybeToken &&
          swapDetails.fromCurrency === BASE_CURRENCY
        ) {
          this.preparedSwap = {
            from: this.account.address,
            to: swapDetails.providerAddress,
            value: unit.toWei(swapDetails.providerReceives, 'ether')
          };
          await this.estimateGas(this.preparedSwap);
        } else if (
          swapDetails.maybeToken &&
          this.fiatCurrenciesArray.includes(swapDetails.toCurrency)
        ) {
          this.preparedSwap = {
            from: this.wallet.getChecksumAddressString(),
            to: swapDetails.providerAddress,
            value: unit.toWei(swapDetails.providerReceives, 'ether')
          };
          await this.estimateGas(this.preparedSwap);
        }
      } else {
        this.preparedSwap = swapDetails.dataForInitialization.map(entry => {
          if (entry.gas) {
            this.incrementFee(entry.gas);
          }
          entry.from = this.account.address;
          return entry;
        });
      }
      this.swapReady = true;
    },
    async estimateGas(params) {
      try {
        const gasLimit = await this.web3.eth.estimateGas(params);
        this.incrementFee(gasLimit);
      } catch (e) {
        Toast.responseHandler(e, 3);
      }
    },
    async fetchEthData() {
      try {
        const url = 'https://cryptorates.mewapi.io/ticker';
        const fetchValues = await fetch(url);
        const values = await fetchValues.json();
        if (!values) return 0;
        if (!values && !values.data && !values.data['ETH']) return 0;
        this.ethPrice = new BigNumber(values.data['ETH'].quotes.USD.price);
      } catch (e) {
        Toast.responseHandler(e, 3);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwapConfirmationModal.scss';
</style>
