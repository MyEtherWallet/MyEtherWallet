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
            <i :class="['cc', fromAddress.name, 'cc-icon']" />
          </div>
          <p class="value">
            {{ fromAddress.value }} <span>{{ fromAddress.name }}</span>
          </p>
          <p class="block-title">From Address</p>
          <p class="address">{{ fromAddress.address }}</p>
        </div>
        <div class="right-arrow"><img :src="arrowImage" /></div>
        <div class="to-address">
          <div class="icon">
            <i :class="['cc', toAddress.name, 'cc-icon']" />
          </div>
          <p class="value">
            {{ toAddress.value }} <span>{{ toAddress.name }}</span>
          </p>
          <p class="block-title">To Address</p>
          <p class="address">{{ toAddress.address }}</p>
        </div>
      </div>

      <div
        :class="[swapReady ? '' : 'disable', 'confirm-send-button']"
        @click="sendTransaction"
      >
        <button-with-qrcode
          :qrcode="qrcode"
          :buttonname="$t('common.continue')"
        />
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
import { mapGetters } from 'vuex';

import Arrow from '@/assets/images/icons/swap.svg';
import iconBtc from '@/assets/images/currency/btc.svg';
import iconEth from '@/assets/images/currency/eth.svg';
import DetailInformation from './components/DetailInformation';
import ButtonWithQrCode from '@/components/Buttons/ButtonWithQrCode';
import HelpCenterButton from '@/components/Buttons/HelpCenterButton';

import { EthereumTokens, BASE_CURRENCY, utils } from '@/partners';

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
      fromAddress: {},
      toAddress: {}
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
        value: newValue.fromValue,
        name: newValue.fromCurrency,
        address: newValue.fromAddress
          ? newValue.fromAddress
          : this.currentAddress
      };
      this.toAddress = {
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
          this.web3.mew.sendBatchTransactions(this.preparedSwap);
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
        if (
          swapDetails.maybeToken &&
          swapDetails.fromCurrency !== BASE_CURRENCY
        ) {
          const tokenInfo = EthereumTokens[swapDetails.fromCurrency];
          if (!tokenInfo) throw Error('Selected Token not known to MEW Swap');

          this.preparedSwap = {
            from: this.$store.state.wallet.getChecksumAddressString(),
            to: tokenInfo.contractAddress,
            value: 0,
            data: new this.web3.eth.Contract(
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
            ).methods
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
          swapDetails.fromCurrency === BASE_CURRENCY
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
    },
    async swapStarted(swapDetails) {
      this.swapReady = false;
      this.preparedSwap = {};
      if (swapDetails.dataForInitialization) {
        switch (swapDetails.provider) {
          case 'changelly':
            this.preparedSwap = await this.useChangelly(swapDetails);
            this.swapReady = true;
            break;
          case 'bity':
            this.preparedSwap = await this.useBity(swapDetails);
            this.swapReady = true;
            break;
          case 'kybernetwork':
            this.preparedSwap = await this.useKyber(swapDetails);
            this.swapReady = true;
            break;
        }

      }
    },
    signAndTransmitTransaction() {
      if(!this.swapReady) return;
      if (Array.isArray(this.preparedSwap)) {
        this.$store.state.web3.eth.sendBatchTransactions(this.preparedSwap);
      } else {
        if (Object.keys(this.preparedSwap).length > 0) {
          // this.$store.state.web3.eth.sendTransaction(this.preparedSwap);
        }
      }
      this.$emit('swapStarted', this.swapDetails);
      this.$refs.swapconfirmation.hide();
    },
    async useBity(swapDetails) {
      if (swapDetails.maybeToken && swapDetails.fromCurrency !== 'ETH') {
        const tokenInfo = this.$store.state.network.type.tokens.find(item => {
          return item.symbol === swapDetails.fromCurrency;
        });
        return {
          from: this.$store.state.wallet.getChecksumAddressString(),
          to: swapDetails.dataForInitialization.payment_address,
          value: 0,
          data: this.createTokenTransferData(
            this.currentAddress,
            swapDetails.fromValue,
            tokenInfo
          )
        };
      } else if (swapDetails.maybeToken && swapDetails.fromCurrency === 'ETH') {
        return {
          from: this.$store.state.wallet.getChecksumAddressString(),
          to: swapDetails.dataForInitialization.payment_address,
          value: unit.toWei(
            swapDetails.dataForInitialization.input.amount,
            'ether'
          )
        };
      }
    },
    async useChangelly(swapDetails) {
      // TODO: consolidate
      if (swapDetails.maybeToken && swapDetails.fromCurrency !== 'ETH') {
        const tokenInfo = this.$store.state.network.type.tokens.find(item => {
          return item.symbol === swapDetails.fromCurrency;
        });
        return {
          from: this.$store.state.wallet.getChecksumAddressString(),
          to: swapDetails.dataForInitialization.payinAddress,
          value: 0,
          data: this.createTokenTransferData(
            this.currentAddress,
            swapDetails.fromValue,
            tokenInfo
          )
        };
      } else if (swapDetails.maybeToken && swapDetails.fromCurrency === 'ETH') {
        return {
          from: this.$store.state.wallet.getChecksumAddressString(),
          to: swapDetails.dataForInitialization.payinAddress,
          value: unit.toWei(
            swapDetails.dataForInitialization.amountExpectedFrom,
            'ether'
          )
        };
      }
    },
    async useKyber(swapDetails) {
      const txDatas = swapDetails.dataForInitialization.values();
      const bulkTx = [];
      try {
        for (const value of txDatas) {
          value.from = this.$store.state.wallet.getChecksumAddressString();
          if(unit.toWei(this.$store.state.gasPrice, 'gwei') > swapDetails.kyberMaxGas){
            value.gasPrice = swapDetails.kyberMaxGas
          }
          bulkTx.push(value);
        }
        return bulkTx;
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwapConfirmationModal.scss';
</style>
