<template>
  <div class="modal-container">
    <b-modal
      ref="swapconfirmation"
      hide-footer
      centered
      class="bootstrap-modal bootstrap-modal-wide padding-40-20"
      title="Confirmation">
      <div class="time-remaining">
        <h1>09:25</h1>
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

      <detail-information :details="detailInfo"/>

      <div
        class="confirm-send-button"
        @click="sendTransaction">
        <button-with-qrcode
          :qrcode="qrcode"
          buttonname="Confirm and Send"/>
      </div>

      <help-center-button/>

    </b-modal>
  </div>
</template>

<script>
/* eslint-disable*/
import web3 from 'web3';
import BigNumber from 'bignumber.js';

import Arrow from '@/assets/images/etc/single-arrow.svg';
import iconBtc from '@/assets/images/currency/btc.svg';
import iconEth from '@/assets/images/currency/eth.svg';
import DetailInformation from './components/DetailInformation';
import ButtonWithQrCode from '@/components/Buttons/ButtonWithQrCode';
import HelpCenterButton from '@/components/Buttons/HelpCenterButton';

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
      currencyIcons: {
        BTC: iconBtc,
        ETH: iconEth
      },
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
      },
      detailInfo: [
        {
          name: 'Network',
          value: 'ETH by mytherapi.com'
        },
        {
          name: 'Gas Limit',
          value: '21000'
        },
        {
          name: 'Gas Price',
          value: '210000 Gwei (0.00321 ETH=$1.234)'
        },
        {
          name: 'Max Transaction Fee',
          value: '441000 Gwei (0.000441 ETH)'
        },
        {
          name: 'Nonce',
          value: '0'
        },
        {
          name: 'Data',
          value: 'None'
        }
      ]
    };
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
    }
  },
  methods: {
    prepare() {
      if (value.dataForInitialization) {
      }
    },
    sendTransaction() {
      this.swapStarted(this.swapDetails);
      this.$refs.swapconfirmation.hide();
      // this.$emit('swapStarted');
    },
    createTokenTransferData(fromAddress, amount, tokenDetails) {
      if (this.swapDetails.fromCurrency !== 'ETH') {
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
        const contract = new this.$store.state.web3.eth.Contract(
          jsonInterface,
          tokenDetails.address
        );
        return contract.methods
          .transfer(
            fromAddress,
            new BigNumber(amount)
              .times(new BigNumber(10).pow(tokenDetails.decimals))
              .toFixed()
          )
          .encodeABI();
      } else {
        return '0x';
      }
    },
    swapStarted(value) {
      if (value.dataForInitialization) {
        switch (value.provider) {
          case 'changelly':
            this.useChangelly(value);
            break;
          case 'bity':
            this.useBity(value);
            break;
          case 'kybernetwork':
            this.useKyber(value);
            break;
          case 'simplex':
            this.useSimplex();
            break;
        }
      }
    },
    useBity(value) {
      this.$store.dispatch('addSwapTransaction', [this.currentAddress, value]);
    },
    useChangelly(value) {
      if (value.maybeToken && value.fromCurrency !== 'ETH') {
        const tokenInfo = this.$store.state.network.type.tokens.find(item => {
          return item.symbol === value.fromCurrency;
        });
        const txData = this.createTokenTransferData(
          this.currentAddress,
          value.fromValue,
          tokenInfo
        );
      }
    },
    useKyber(value) {
      const dataForTransactions = value.dataForInitialization;
    },
    useSimplex(value) {

    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwapConfirmationModal.scss';
</style>
