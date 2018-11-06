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
        @click="sendTransaction">
        <button-with-qrcode
          :qrcode="qrcode"
          buttonname="Continue to confirmation"/>
      </div>

      <help-center-button/>

    </b-modal>
  </div>
</template>

<script>
/* eslint-disable*/
import BigNumber from 'bignumber.js';
import * as unit from 'ethjs-unit';
import { mapGetters } from 'vuex';

import Arrow from '@/assets/images/etc/single-arrow.svg';
import iconBtc from '@/assets/images/currency/btc.svg';
import iconEth from '@/assets/images/currency/eth.svg';
import DetailInformation from './components/DetailInformation';
import ButtonWithQrCode from '@/components/Buttons/ButtonWithQrCode';
import HelpCenterButton from '@/components/Buttons/HelpCenterButton';

import { EthereumTokens } from '@/partners';

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
  computed:{
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
      this.swapStarted(newValue);
    }
  },
  methods: {
    async sendTransaction() {
      if (!this.swapReady) return;
      if (Array.isArray(this.preparedSwap)) {
        if (this.preparedSwap.length > 1) {

          const gasPrice = entry.gasPrice || unit.toWei(this.$store.state.gasPrice, 'gwei');
          const cleaned = this.preparedSwap.map(entry => {
            return {
              from: entry.from,
              to: entry.to,
              value: this.web3.utils.toHex(entry.value),
              data: entry.data || '0x',
              gasPrice: this.web3.utils.toHex(gasPrice)
            };
          });
          console.log('cleaned', cleaned); // todo remove dev item
          this.web3.mew.sendBatchTransactions(cleaned);
        } else {
          const  cleaned = await this.prepareSingleTransaction(this.preparedSwap[0]);
          this.web3.eth.sendTransaction(cleaned);
        }
      } else {
        if (Object.keys(this.preparedSwap).length > 0) {
          const  cleaned = await this.prepareSingleTransaction(this.preparedSwap);
          console.log(cleaned); // todo remove dev item
          this.web3.eth.sendTransaction(cleaned);
        }
      }
      this.$emit('swapStarted', this.swapDetails);
      this.$refs.swapconfirmation.hide();
    },
    async prepareSingleTransaction(preparedSwap){
      const gasPrice = preparedSwap.gasPrice || unit.toWei(this.$store.state.gasPrice, 'gwei')
      const cleaned = {
        from: preparedSwap.from,
        to: preparedSwap.to,
        value: this.web3.utils.toHex(preparedSwap.value),
        data: preparedSwap.data || '0x',
        gasPrice: this.web3.utils.toHex(gasPrice)
      };

      cleaned.gas = await this.web3.eth.estimateGas(cleaned)
      return cleaned;
    },
    createTokenTransferData(fromAddress, amount, tokenDetails) {
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
      const contract = new this.web3.eth.Contract(
        jsonInterface,
        tokenDetails.contractAddress
      );
      return contract.methods
        .transfer(
          fromAddress,
          new BigNumber(amount)
            .times(new BigNumber(10).pow(tokenDetails.decimals))
            .toFixed()
        )
        .encodeABI();
    },
    async swapStarted(swapDetails) {
      this.preparedSwap = await this.finalizeSwap(swapDetails);
      this.swapReady = true;
    },
    async finalizeSwap(swapDetails) {
      this.swapReady = false;
      this.preparedSwap = {};
      console.log('swapDetails', swapDetails); // todo remove dev item
      if (swapDetails.dataForInitialization && !Array.isArray(swapDetails.dataForInitialization)) {
        if (swapDetails.maybeToken && swapDetails.fromCurrency !== 'ETH') {
          const tokenInfo = EthereumTokens[swapDetails.fromCurrency];
          if (!tokenInfo) throw Error('Selected Token not known to MEW Swap');

          return {
            from: this.$store.state.wallet.getChecksumAddressString(),
            to: tokenInfo.contractAddress,
            value: 0,
            data: this.createTokenTransferData(
              swapDetails.providerAddress,
              swapDetails.fromValue,
              tokenInfo
            )
          };
        } else if (
          swapDetails.maybeToken &&
          swapDetails.fromCurrency === 'ETH'
        ) {
          return {
            from: this.$store.state.wallet.getChecksumAddressString(),
            to: swapDetails.providerAddress,
            value: unit.toWei(
              swapDetails.providerReceives,
              'ether'
            )
          };
        }
      } else {
        console.log('kyber only'); // todo remove dev item
        try {
          return swapDetails.dataForInitialization.map(entry => {

            entry.from = this.wallet.getChecksumAddressString();
            if (
              unit.toWei(this.gasPrice, 'gwei') >
              swapDetails.kyberMaxGas
            ) {
              entry.gasPrice = swapDetails.kyberMaxGas || unit.toWei(this.gasPrice, 'gwei'); //TODO check why gasPrice
            } else {
              entry.gasPrice = unit.toWei(this.gasPrice, 'gwei');
            }
            return entry;
          });
        } catch (e) {
          console.error(e);
        }
      }
    },
    signTransaction() {
      if (!this.swapReady) return;
      if (Array.isArray(this.preparedSwap)) {
        // this.web3.mew.sendBatchTransactions(this.preparedSwap);
      } else {
        if (Object.keys(this.preparedSwap).length > 0) {
          console.log(this.preparedSwap); // todo remove dev item
          // this.web3.mew.sendTransactions(this.preparedSwap);
          const cleaned = {
            from: this.preparedSwap.from,
            to: this.preparedSwap.to,
            value: this.preparedSwap.value,
            data: this.preparedSwap.data || '0x',
            gasPrice: this.preparedSwap.gasPrice || unit.toWei(this.$store.state.gasPrice, 'gwei')
          };
          console.log('cleaned', cleaned); // todo remove dev item
          this.web3.eth.signTransaction(cleaned);
        }
      }
      this.$emit('swapStarted', this.swapDetails);
      this.$refs.swapconfirmation.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SwapConfirmationModal.scss';
</style>
