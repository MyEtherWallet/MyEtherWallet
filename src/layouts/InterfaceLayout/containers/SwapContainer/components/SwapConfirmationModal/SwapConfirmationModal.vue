<template>
  <div class="modal-container">
    <b-modal
      ref="swapconfirmation"
      hide-footer
      centered
      class="bootstrap-modal bootstrap-modal-wide padding-40-20"
      title="Confirmation"
    >
      <div class="time-remaining">
        <h1>{{ timeRemaining }}</h1>
        <p>Time Remaining</p>
      </div>
      <div class="swap-detail">
        <div class="from-address">
          <div class="icon">
            <img :src="fromAddress.image">
          </div>
          <p class="value">{{ fromAddress.value }} <span>{{ fromAddress.name }}</span></p>
          <p class="block-title">From Address</p>
          <p class="address">{{ fromAddress.address }}</p>
        </div>
        <div class="right-arrow">
          <img :src="arrowImage">
        </div>
        <div class="to-address">
          <div class="icon">
            <img :src="toAddress.image">
          </div>
          <p class="value">{{ toAddress.value }} <span>{{ toAddress.name }}</span></p>
          <p class="block-title">To Address</p>
          <p class="address">{{ toAddress.address }}</p>
        </div>
      </div>

      <div
        :class="[swapReady ? '': 'disable', 'confirm-send-button']"
        @click="sendTransaction">
        <button-with-qrcode
          :qrcode="qrcode"
          :buttonname="$t('common.confirmAndSend')"/>
      </div>

      <help-center-button/>

    </b-modal>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import * as unit from 'ethjs-unit';
import { mapGetters } from 'vuex';

import Arrow from '@/assets/images/etc/single-arrow.svg';
import iconBtc from '@/assets/images/currency/btc.svg';
import iconEth from '@/assets/images/currency/eth.svg';
import DetailInformation from './components/DetailInformation';
import ButtonWithQrCode from '@/components/Buttons/ButtonWithQrCode';
import HelpCenterButton from '@/components/Buttons/HelpCenterButton';

import { EthereumTokens, utils } from '@/partners';

export default {
  components: {
    'detail-information': DetailInformation,
    'button-with-qrcode': ButtonWithQrCode,
    'help-center-button': HelpCenterButton
  },
  props: {
    swapDetails: {
      type: Object,
      default: function() {
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
      fromAddress: {
        image: iconEth,
        value: '1.0000000000',
        name: 'ETH',
        address: '0xF54F78F67feCDd37e0C009aB4cCD6549A69540D4'
      },
      toAddress: {
        image: iconBtc,
        value: '0.0034523',
        name: 'BTC',
        address: '0xF54F78F67feCDd37e0C009aB4cCD6549A69540D4'
      }
    };
  },
  computed: {
    ...mapGetters({
      ens: 'ens',
      gasPrice: 'gasPrice',
      web3: 'web3',
      wallet: 'wallet',
      network: 'network'
    })
  },
  watch: {
    swapDetails(newValue) {
      this.fromAddress = {
        image: this.currencyIcons[newValue.fromCurrency],
        value: newValue.fromValue,
        name: newValue.fromCurrency,
        address: newValue.fromAddress ? newValue.fromAddress : ''
      };
      this.toAddress = {
        image: this.currencyIcons[newValue.toCurrency],
        value: newValue.toValue,
        name: newValue.toCurrency,
        address: newValue.toAddress
      };
      this.timeUpdater(newValue);
      this.swapStarted(newValue);
    }
  },
  methods: {
    timeUpdater(swapDetails) {
      clearInterval(this.timerInterval);
      this.timeRemaining = utils.getTimeRemainingString(swapDetails.timestamp);
      this.timerInterval = setInterval(() => {
        this.timeRemaining = utils.getTimeRemainingString(
          swapDetails.timestamp
        );
        if (this.timeRemaining === 'expired') {
          clearInterval(this.timerInterval);
        }
      }, 1000);
    },
    async sendTransaction() {
      if (!this.swapReady) return;
      if (Array.isArray(this.preparedSwap)) {
        if (this.preparedSwap.length > 1) {
          this.web3.mew.sendBatchTransactions([...this.preparedSwap]);
        } else {
          this.web3.eth.sendTransaction(this.preparedSwap[0]);
        }
      } else {
        if (Object.keys(this.preparedSwap).length > 0) {
          this.web3.eth.sendTransaction(this.preparedSwap);
        }
      }
      this.$emit('swapStarted', this.swapDetails);
      this.$refs.swapconfirmation.hide();
    },
    async swapStarted(swapDetails) {
      this.timeUpdater(swapDetails);
      this.swapReady = false;
      this.preparedSwap = {};
      if (
        swapDetails.dataForInitialization &&
        !Array.isArray(swapDetails.dataForInitialization)
      ) {
        if (swapDetails.maybeToken && swapDetails.fromCurrency !== 'ETH') {
          const tokenInfo = EthereumTokens[swapDetails.fromCurrency];
          if (!tokenInfo) throw Error('Selected Token not known to MEW Swap');

          const contract = new this.web3.eth.Contract(
            [
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
            ],
            tokenInfo.contractAddress
          );
          this.preparedSwap = {
            from: this.$store.state.wallet.getChecksumAddressString(),
            to: tokenInfo.contractAddress,
            value: 0,
            data: contract.methods
              .transfer(
                swapDetails.providerAddress,
                new BigNumber(swapDetails.fromValue)
                  .times(new BigNumber(10).pow(tokenInfo.decimals))
                  .toFixed()
              )
              .encodeABI()
          };
        } else if (
          swapDetails.maybeToken &&
          swapDetails.fromCurrency === 'ETH'
        ) {
          this.preparedSwap = {
            from: this.$store.state.wallet.getChecksumAddressString(),
            to: swapDetails.providerAddress,
            value: unit.toWei(swapDetails.providerReceives, 'ether')
          };
        }
      } else {
        this.preparedSwap = swapDetails.dataForInitialization.map(entry => {
          entry.from = this.wallet.getChecksumAddressString();
          if (
            +unit.toWei(this.gasPrice, 'gwei').toString() >
            +swapDetails.kyberMaxGas
          ) {
            entry.gasPrice = swapDetails.kyberMaxGas;
          }
          return entry;
        });
      }
      this.swapReady = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwapConfirmationModal.scss';
</style>
