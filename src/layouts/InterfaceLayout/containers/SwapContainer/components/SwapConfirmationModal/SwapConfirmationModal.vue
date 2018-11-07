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
        :class="[swapReady ? '': 'disable', 'confirm-send-button']"
        @click="signAndTransmitTransaction">
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
import * as unit from 'ethjs-unit';

import Arrow from '@/assets/images/etc/single-arrow.svg';
import iconBtc from '@/assets/images/currency/btc.svg';
import iconEth from '@/assets/images/currency/eth.svg';
import DetailInformation from './components/DetailInformation';
import ButtonWithQrCode from '@/components/Buttons/ButtonWithQrCode';
import HelpCenterButton from '@/components/Buttons/HelpCenterButton';
// TODO see: https://github.com/MyEtherWallet/MyEtherWallet/blob/89282539248349de09ba64b3171408a23d189460/src/dapps/RegisterDomain/RegisterDomain.vue
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
      detailInfo: {
        network: {
          name: 'Network',
          value: 'ETH by mytherapi.com'
        },
        gas: {
          name: 'Gas Limit',
          value: '21000'
        },
        gasPrice: {
          name: 'Gas Price',
          value: '210000 Gwei (0.00321 ETH=$1.234)'
        },
        transactionFee: {
          name: 'Max Transaction Fee',
          value: '441000 Gwei (0.000441 ETH)'
        },
        nonce: {
          name: 'Nonce',
          value: '0'
        },
        data: {
          name: 'Data',
          value: 'None'
        }
      }
    };
  },
  watch: {
    swapDetails(newValue) {
      console.log('modal watcher:', newValue); // todo remove dev item
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
      this.swapStarted(newValue)
    }
  },
  methods: {
    sendTransaction() {
      // this.swapStarted(this.swapDetails);
      // this.$refs.swapconfirmation.hide();
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
    async swapStarted(swapDetails) {
      this.swapReady = false;
      this.preparedSwap = {};
      console.log('swapDetails', swapDetails); // todo remove dev item
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
        console.error(e);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwapConfirmationModal.scss';
</style>
